import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, Switch, Platform, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Device from 'expo-device';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { attendanceService } from '../api/services';
import { MapPin, Camera, CheckCircle2, XCircle, Clock, ChevronLeft, Info, Search, Calendar as CalendarIcon, User } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { authService } from '../api/services';

export default function AttendanceScreen({ navigation, route }) {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('Mengambil lokasi...');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOvertime, setIsOvertime] = useState(route.params?.isOvertime || false);
    const [attendanceSummary, setAttendanceSummary] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualDate, setManualDate] = useState(new Date());
    const [manualTime, setManualTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        if (route.params?.isOvertime !== undefined) {
            setIsOvertime(route.params.isOvertime);
        }
    }, [route.params?.isOvertime]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Akses lokasi diperlukan untuk absen.');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            setLocation(loc.coords);

            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const item = reverseGeocode[0];
                setAddress(`${item.street || ''} ${item.name || ''}, ${item.city || ''}`);
            }
        })();

        fetchProfile();
        fetchSummary();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authService.getProfile();
            setUserProfile(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSummary = async () => {
        try {
            const data = await attendanceService.getSummary();
            setAttendanceSummary(data);
        } catch (error) {
            console.error(error);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Akses kamera diperlukan.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0]);
        }
    };

    const handleAction = async (type) => {
        if (!isManualMode && !location) {
            Alert.alert('Error', 'Lokasi belum didapatkan.');
            return;
        }

        // Anti-Fake GPS Guard (Hanya jika bukan mode manual)
        if (!isManualMode && location.mocked) {
            Alert.alert(
                '❌ Akses Ditolak',
                'Fake GPS atau Mock Location terdeteksi! Harap matikan aplikasi pemalsu lokasi dan Developer Options untuk melakukan absensi.',
                [{ text: 'Mengerti' }]
            );
            return;
        }

        if (!photo && (type === 'in' || type === 'overtime_in')) {
            Alert.alert('Error', 'Foto diperlukan untuk absen.');
            return;
        }

        if (isManualMode && !selectedEmployee) {
            Alert.alert('Error', 'Silakan pilih karyawan terlebih dahulu.');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isManualMode) {
                const manualPayload = {
                    target_user_id: selectedEmployee.id,
                    date: format(manualDate, 'yyyy-MM-dd'),
                    time: format(manualTime, 'HH:mm:ss'),
                    type: isOvertime ? (type === 'in' ? 'overtime_in' : 'overtime_out') : type,
                    photo: `data:image/jpeg;base64,${photo.base64}`,
                    latitude: location.latitude,
                    longitude: location.longitude,
                };
                response = await attendanceService.submitManualAttendance(manualPayload);
            } else {
                const payload = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    photo: photo ? `data:image/jpeg;base64,${photo.base64}` : null,
                    is_mock_location: location.mocked || false,
                    is_emulator: !Device.isDevice,
                    is_developer_mode: false,
                };

                if (isOvertime) {
                    if (type === 'in') {
                        response = await attendanceService.overtimeCheckIn(payload);
                    } else {
                        response = await attendanceService.overtimeCheckOut(payload);
                    }
                } else {
                    if (type === 'in') {
                        response = await attendanceService.checkIn(payload);
                    } else {
                        response = await attendanceService.checkOut(payload);
                    }
                }
            }

            if (response.message || response.data) {
                Alert.alert('Berhasil', response.message || 'Presensi berhasil dicatat.');
                setPhoto(null);
                fetchSummary();
            } else {
                Alert.alert('Gagal', 'Terjadi kesalahan saat memproses data.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Terjadi kesalahan sistem');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (text) => {
        setSearchQuery(text);
        if (text.length > 2) {
            try {
                const results = await attendanceService.searchEmployees(text);
                setSearchResults(results);
            } catch (error) {
                console.error(error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const isIqbal = userProfile?.name?.toLowerCase() === 'iqbal maulana';
    const { format } = require('date-fns');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Presensi Digital</Text>
                <TouchableOpacity style={styles.infoBtn}>
                    <Info size={20} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Anti-Fake GPS Warning Banner */}
                {location?.mocked && (
                    <View style={styles.warningBanner}>
                        <Zap size={20} color="#fff" />
                        <Text style={styles.warningText}>Fake GPS Terdeteksi! Absen Dinonaktifkan.</Text>
                    </View>
                )}
                {/* Mode Selector */}
                <View style={styles.modeCard}>
                    <View style={styles.modeText}>
                        <Text style={styles.modeTitle}>{isOvertime ? 'Mode Lembur' : 'Mode Reguler'}</Text>
                        <Text style={styles.modeSubtitle}>Beralih ke absen lembur jika perlu</Text>
                    </View>
                    <Switch
                        value={isOvertime}
                        onValueChange={setIsOvertime}
                        trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                        thumbColor={isOvertime ? COLORS.primary : COLORS.surface}
                    />
                </View>

                {/* Main Action Area */}
                <View style={styles.mainCard}>
                    {/* Location Chip */}
                    <View style={styles.locationChip}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.locationText} numberOfLines={1}>{address}</Text>
                    </View>

                    {/* Stylized Camera Container */}
                    <TouchableOpacity style={styles.cameraContainer} onPress={takePhoto} activeOpacity={0.8}>
                        {photo ? (
                            <Image source={{ uri: photo.uri }} style={styles.fullImage} />
                        ) : (
                            <View style={styles.cameraPlaceholder}>
                                <View style={styles.cameraCircle}>
                                    <Camera size={44} color={COLORS.primary} strokeWidth={1.5} />
                                </View>
                                <Text style={styles.cameraInstruction}>Ketuk untuk Foto Diri</Text>
                            </View>
                        )}
                        {photo && (
                            <View style={styles.retakeBadge}>
                                <Camera size={14} color={COLORS.surface} />
                                <Text style={styles.retakeText}>Ambil Ulang</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Action Buttons - Refined for V2 */}
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            style={[styles.mainActionBtn, { backgroundColor: COLORS.success }]}
                            onPress={() => handleAction('in')}
                            disabled={loading || location?.mocked}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <CheckCircle2 size={24} color="#fff" />
                                    <Text style={styles.mainActionText}>Masuk</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.mainActionBtn, { backgroundColor: COLORS.text }]}
                            onPress={() => handleAction('out')}
                            disabled={loading || location?.mocked}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : (
                                <>
                                    <XCircle size={24} color="#fff" />
                                    <Text style={styles.mainActionText}>Pulang</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Today's Status Banner */}
                <View style={styles.statusBanner}>
                    <View style={styles.bannerHeader}>
                        <Clock size={18} color={COLORS.text} />
                        <Text style={styles.bannerTitle}>Status ({isOvertime ? 'Lembur' : 'Reguler'})</Text>
                    </View>
                    <View style={styles.bannerRow}>
                        <View style={styles.bannerItem}>
                            <Text style={styles.bannerLabel}>Masuk</Text>
                            <Text style={styles.bannerValue}>
                                {isOvertime ? attendanceSummary?.today_overtime_in || '--:--' : attendanceSummary?.today_check_in || '--:--'}
                            </Text>
                        </View>
                        <View style={styles.bannerDivider} />
                        <View style={styles.bannerItem}>
                            <Text style={styles.bannerLabel}>Pulang</Text>
                            <Text style={styles.bannerValue}>
                                {isOvertime ? attendanceSummary?.today_overtime_out || '--:--' : attendanceSummary?.today_check_out || '--:--'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Hidden Manual Mode (Subtle and at the very bottom) */}
                {isIqbal && (
                    <View style={styles.stealthSection}>
                        <View style={styles.stealthHeader}>
                            <Text style={styles.stealthTitle}>Konfigurasi Lanjutan</Text>
                            <Switch
                                value={isManualMode}
                                onValueChange={setIsManualMode}
                                trackColor={{ false: COLORS.border, true: '#e2e8f0' }}
                                thumbColor={isManualMode ? COLORS.textLight : '#f1f5f9'}
                                style={{ transform: [{ scale: 0.8 }] }}
                            />
                        </View>

                        {isManualMode && (
                            <View style={styles.stealthForm}>
                                {/* Search Employee */}
                                <View style={styles.inputGroup}>
                                    <View style={styles.stealthSearchWrapper}>
                                        <Search size={14} color={COLORS.textLight} />
                                        <TextInput
                                            style={styles.stealthSearchInput}
                                            placeholder="Cari user..."
                                            value={selectedEmployee ? selectedEmployee.name : searchQuery}
                                            onChangeText={handleSearch}
                                        />
                                        {selectedEmployee && (
                                            <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                                                <XCircle size={14} color={COLORS.textLight} />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {searchResults.length > 0 && !selectedEmployee && (
                                        <View style={styles.stealthSearchResults}>
                                            {searchResults.map((emp) => (
                                                <TouchableOpacity
                                                    key={emp.id}
                                                    style={styles.stealthResultItem}
                                                    onPress={() => {
                                                        setSelectedEmployee(emp);
                                                        setSearchResults([]);
                                                    }}
                                                >
                                                    <Text style={styles.stealthResultText}>{emp.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                {/* Date Time Pickers */}
                                <View style={styles.stealthDateTimeGrid}>
                                    <TouchableOpacity style={styles.stealthDateBtn} onPress={() => setShowDatePicker(true)}>
                                        <CalendarIcon size={14} color={COLORS.textLight} />
                                        <Text style={styles.stealthDateText}>{format(manualDate, 'dd/MM/yy')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.stealthDateBtn} onPress={() => setShowTimePicker(true)}>
                                        <Clock size={14} color={COLORS.textLight} />
                                        <Text style={styles.stealthDateText}>{format(manualTime, 'HH:mm')}</Text>
                                    </TouchableOpacity>
                                </View>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={manualDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) setManualDate(date);
                                        }}
                                    />
                                )}
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={manualTime}
                                        mode="time"
                                        is24Hour={true}
                                        display="default"
                                        onChange={(event, time) => {
                                            setShowTimePicker(false);
                                            if (time) setManualTime(time);
                                        }}
                                    />
                                )}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 40 }} />
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

import { TextInput } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        backgroundColor: COLORS.surface,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    infoBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: SIZES.radiusXL,
        marginTop: 20,
        ...SHADOWS.soft,
    },
    modeText: {
        flex: 1,
    },
    modeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    modeSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    stealthSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    stealthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: 0.3, // Sangat samar
    },
    stealthTitle: {
        fontSize: 10,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    stealthForm: {
        marginTop: 15,
    },
    stealthSearchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 36,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 8,
    },
    stealthSearchInput: {
        flex: 1,
        fontSize: 12,
        color: COLORS.text,
    },
    stealthSearchResults: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    stealthResultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    stealthResultText: {
        fontSize: 12,
        color: COLORS.text,
    },
    stealthDateTimeGrid: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    stealthDateBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 6,
    },
    stealthDateText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.text,
    },
    mainCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusXXL,
        marginTop: 24,
        padding: 24,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    locationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
        maxWidth: '90%',
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        marginRight: 8,
    },
    warningBanner: {
        backgroundColor: '#ef4444',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 20,
        gap: 10,
        ...SHADOWS.vibrant,
    },
    warningText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    locationText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 8,
    },
    cameraContainer: {
        width: '100%',
        height: 280,
        borderRadius: SIZES.radiusXXL,
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cameraPlaceholder: {
        alignItems: 'center',
    },
    cameraCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cameraInstruction: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    retakeBadge: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    retakeText: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: '600',
    },
    actionGrid: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    mainActionBtn: {
        flex: 1,
        height: 64,
        borderRadius: SIZES.radiusXL,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        ...SHADOWS.vibrant,
    },
    mainActionText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBanner: {
        backgroundColor: COLORS.text,
        marginTop: 24,
        padding: 24,
        borderRadius: SIZES.radiusXXL,
        ...SHADOWS.medium,
    },
    bannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.surface,
    },
    bannerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bannerItem: {
        flex: 1,
        alignItems: 'center',
    },
    bannerLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    bannerValue: {
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.surface,
    },
    bannerDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.1)',
    }
});
