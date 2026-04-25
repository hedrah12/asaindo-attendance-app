import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Platform, StatusBar } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { attendanceService } from '../api/services';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Calendar, FileText, Image as ImageIcon, Send, ChevronLeft, Info } from 'lucide-react-native';

export default function LeaveRequestScreen({ navigation }) {
    const [type, setType] = useState('Izin');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const leaveTypes = ['Izin', 'Sakit', 'Cuti'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setProof(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!reason) {
            Alert.alert('Error', 'Alasan harus diisi.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', type.toLowerCase());
            formData.append('start_date', format(startDate, 'yyyy-MM-dd'));
            formData.append('end_date', format(endDate, 'yyyy-MM-dd'));
            formData.append('reason', reason);

            if (proof) {
                formData.append('proof_photo', {
                    uri: proof.uri,
                    name: 'proof.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await attendanceService.submitLeaveRequest(formData);
            if (response.message || response.data) {
                Alert.alert('Sukses', response.message || 'Pengajuan berhasil dikirim.');
                navigation.goBack();
            } else {
                Alert.alert('Gagal', 'Gagal mengirim pengajuan.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Gagal mengirim pengajuan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Form Pengajuan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.introCard}>
                    <Text style={styles.introTitle}>Butuh Izin atau Cuti?</Text>
                    <Text style={styles.introSubtitle}>Silakan lengkapi detail pengajuan Anda di bawah ini.</Text>
                </View>

                <View style={styles.formCard}>
                    {/* Leave Type Selector */}
                    <Text style={styles.label}>Jenis Pengajuan</Text>
                    <View style={styles.typeGrid}>
                        {leaveTypes.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.typeBtn, type === t && styles.activeTypeBtn]}
                                onPress={() => setType(t)}
                            >
                                <Text style={[styles.typeText, type === t && styles.activeTypeText]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Date Picker Section */}
                    <View style={styles.dateSection}>
                        <View style={styles.dateBlock}>
                            <Text style={styles.label}>Tanggal Mulai</Text>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
                                <Calendar size={18} color={COLORS.primary} />
                                <Text style={styles.dateValue}>{format(startDate, 'dd MMM yyyy')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateBlock}>
                            <Text style={styles.label}>Tanggal Selesai</Text>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
                                <Calendar size={18} color={COLORS.primary} />
                                <Text style={styles.dateValue}>{format(endDate, 'dd MMM yyyy')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            onChange={(event, date) => {
                                setShowStartPicker(false);
                                if (date) setStartDate(date);
                            }}
                        />
                    )}

                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            minimumDate={startDate}
                            onChange={(event, date) => {
                                setShowEndPicker(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}

                    {/* Reason Textarea */}
                    <Text style={styles.label}>Alasan Pengajuan</Text>
                    <View style={styles.textAreaContainer}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Jelaskan alasan Anda secara singkat..."
                            placeholderTextColor={COLORS.textLight}
                            multiline
                            numberOfLines={4}
                            value={reason}
                            onChangeText={setReason}
                        />
                    </View>

                    {/* Upload Proof */}
                    <Text style={styles.label}>Dokumen Bukti (Opsional)</Text>
                    <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                        {proof ? (
                            <Image source={{ uri: proof.uri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <View style={styles.uploadIconCircle}>
                                    <ImageIcon size={28} color={COLORS.primary} />
                                </View>
                                <Text style={styles.uploadText}>Unggah Foto atau Dokumen</Text>
                                <Text style={styles.uploadHint}>Maks. 5MB (JPG, PNG)</Text>
                            </View>
                        )}
                        {proof && (
                            <View style={styles.editProofBadge}>
                                <Text style={styles.editProofText}>Ubah File</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Send size={20} color="#fff" />
                                <Text style={styles.submitBtnText}>Kirim Pengajuan</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

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
    introCard: {
        marginTop: 20,
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    introSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusXXL,
        padding: 24,
        ...SHADOWS.medium,
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    typeBtn: {
        flex: 1,
        height: 48,
        borderRadius: SIZES.radiusL,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    activeTypeBtn: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        ...SHADOWS.vibrant,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    activeTypeText: {
        color: COLORS.surface,
    },
    dateSection: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    dateBlock: {
        flex: 1,
    },
    dateInput: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: SIZES.radiusL,
        paddingHorizontal: 16,
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dateValue: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    textAreaContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: SIZES.radiusXL,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        marginBottom: 24,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        fontSize: 14,
        color: COLORS.text,
    },
    uploadArea: {
        width: '100%',
        height: 160,
        borderRadius: SIZES.radiusXL,
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 32,
    },
    uploadPlaceholder: {
        alignItems: 'center',
    },
    uploadIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    uploadHint: {
        fontSize: 11,
        color: COLORS.textLight,
        marginTop: 4,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editProofBadge: {
        position: 'absolute',
        bottom: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    editProofText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    submitBtn: {
        height: 60,
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radiusXL,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        ...SHADOWS.vibrant,
    },
    submitBtnText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
