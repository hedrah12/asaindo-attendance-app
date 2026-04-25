import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions, StatusBar, Platform, Alert } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { attendanceService, authService } from '../api/services';
import { User, Calendar, Clock, MapPin, ChevronRight, LogOut, Wallet, Bell, Zap, ArrowUpRight, TrendingUp, Eye, EyeOff, Info, History } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showSalary, setShowSalary] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        fetchData();
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        try {
            const [profileData, summaryData] = await Promise.all([
                authService.getProfile(),
                attendanceService.getSummary()
            ]);
            setProfile(profileData);
            setSummary(summaryData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            await SecureStore.deleteItemAsync('auth_token');
            navigation.replace('Login');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const formatCurrency = (val) => {
        return `Rp ${new Intl.NumberFormat('id-ID').format(val || 0)}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header Section */}
            <View style={[styles.headerArea, { paddingTop: Platform.OS === 'ios' ? 50 : 30 }]}>
                <View style={styles.headerLeft}>
                    <Text style={styles.dateLabel}>{format(currentTime, 'EEEE, dd MMMM yyyy')}</Text>
                    <Text style={styles.greetingText}>Halo, {profile?.name?.split(' ')[0]}! 👋</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.notifBtn}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Bell size={22} color={COLORS.text} />
                        <View style={styles.dot} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={20} color={COLORS.danger} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* 1. Live Time Server Section */}
                <LinearGradient
                    colors={[COLORS.primary, '#be123c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.timeCard}
                >
                    <View style={styles.timeHeader}>
                        <Clock size={20} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.timeLabel}>LIVE SERVER TIME</Text>
                    </View>
                    <Text style={styles.timeValue}>{format(currentTime, 'HH:mm:ss')}</Text>
                    <Text style={styles.timeSubLabel}>Sinkronisasi otomatis dengan server</Text>
                    <View style={styles.timeDecoration}>
                        <Clock size={120} color="rgba(255,255,255,0.08)" />
                    </View>
                </LinearGradient>

                {/* 2. Attendance Status Area */}
                <View style={styles.statusArea}>
                    <Text style={styles.sectionTitleSmall}>PRESENSI REGULER</Text>
                    <View style={styles.statusRow}>
                        <TouchableOpacity
                            style={[styles.statusItem, { backgroundColor: '#f0fdf4' }]}
                            onPress={() => navigation.navigate('Attendance', { isOvertime: false })}
                        >
                            <View style={styles.statusIconBox}>
                                <Zap size={18} color="#15803d" />
                            </View>
                            <View>
                                <Text style={styles.statusLabel}>Absen Masuk</Text>
                                <Text style={[styles.statusValue, { color: '#15803d' }]}>
                                    {summary?.today_check_in || '--:--'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.statusItem, { backgroundColor: '#fef2f2' }]}
                            onPress={() => navigation.navigate('Attendance', { isOvertime: false })}
                        >
                            <View style={styles.statusIconBox}>
                                <LogOut size={18} color="#b91c1c" />
                            </View>
                            <View>
                                <Text style={styles.statusLabel}>Absen Keluar</Text>
                                <Text style={[styles.statusValue, { color: '#b91c1c' }]}>
                                    {summary?.today_check_out || '--:--'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {summary?.can_overtime && (
                        <>
                            <Text style={[styles.sectionTitleSmall, { marginTop: 16 }]}>PRESENSI LEMBUR</Text>
                            <View style={styles.statusRow}>
                                <TouchableOpacity
                                    style={[styles.statusItem, { backgroundColor: '#fdf4ff' }]}
                                    onPress={() => navigation.navigate('Attendance', { isOvertime: true })}
                                >
                                    <View style={styles.statusIconBox}>
                                        <TrendingUp size={18} color="#a21caf" />
                                    </View>
                                    <View>
                                        <Text style={styles.statusLabel}>Mulai Lembur</Text>
                                        <Text style={[styles.statusValue, { color: '#a21caf' }]}>
                                            {summary?.today_overtime_in || '--:--'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.statusItem, { backgroundColor: '#fff7ed' }]}
                                    onPress={() => navigation.navigate('Attendance', { isOvertime: true })}
                                >
                                    <View style={styles.statusIconBox}>
                                        <LogOut size={18} color="#c2410c" />
                                    </View>
                                    <View>
                                        <Text style={styles.statusLabel}>Selesai Lembur</Text>
                                        <Text style={[styles.statusValue, { color: '#c2410c' }]}>
                                            {summary?.today_overtime_out || '--:--'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>

                {/* 3. Total Salary Section (Detailed) */}
                <View style={styles.salaryContainer}>
                    <LinearGradient
                        colors={['#1e293b', '#0f172a']}
                        style={styles.salaryCard}
                    >
                        <View style={styles.salaryHeader}>
                            <View style={styles.salaryIconCircle}>
                                <Wallet size={24} color={COLORS.primary} />
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.salaryTitle}>Estimasi Gaji</Text>
                                <Text style={styles.salaryPeriod}>{summary?.period_label}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowSalary(!showSalary)}
                            >
                                {showSalary ? <EyeOff size={22} color="rgba(255,255,255,0.6)" /> : <Eye size={22} color="rgba(255,255,255,0.6)" />}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.salaryMain}>
                            <Text style={styles.grandTotalLabel}>Grand Total Salery</Text>
                            <Text style={styles.grandTotalValue}>
                                {showSalary ? formatCurrency(summary?.grand_total) : 'Rp •••••••••'}
                            </Text>
                        </View>

                        {showSalary && (
                            <View style={styles.salaryDetails}>
                                <View style={styles.divider} />
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Gaji Pokok ({summary?.total_days} hari)</Text>
                                    <Text style={styles.detailValue}>{formatCurrency(summary?.salary_pokok)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <View>
                                        <Text style={styles.detailLabel}>Tunjangan Transport</Text>
                                        <Text style={styles.perDayText}>({formatCurrency(summary?.allowance_transport_per_day)} /hari)</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{formatCurrency(summary?.allowance_transport_total)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <View>
                                        <Text style={styles.detailLabel}>Tunjangan Makan</Text>
                                        <Text style={styles.perDayText}>({formatCurrency(summary?.allowance_food_per_day)} /hari)</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{formatCurrency(summary?.allowance_food_total)}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <View>
                                        <Text style={styles.detailLabel}>Lembur</Text>
                                        <Text style={styles.perDayText}>({formatCurrency(summary?.allowance_overtime_per_day)} /kali)</Text>
                                    </View>
                                    <Text style={styles.detailValue}>{formatCurrency(summary?.allowance_overtime_total)}</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Info size={14} color="rgba(255,255,255,0.4)" />
                                    <Text style={styles.infoText}>Gaji dihitung berdasarkan kehadiran & tunjangan harian.</Text>
                                </View>
                            </View>
                        )}
                    </LinearGradient>
                </View>

                {/* 4. Main Actions (Big & Attractive) */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.mainActionBtn}
                        onPress={() => navigation.navigate('Attendance')}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#f8fafc']}
                            style={styles.actionInner}
                        >
                            <View style={[styles.actionIconBox, { backgroundColor: '#fff1f2' }]}>
                                <MapPin size={26} color={COLORS.primary} />
                            </View>
                            <Text style={styles.actionText}>Absen Sekarang</Text>
                            <Text style={styles.actionSubText}>Check-in Lokasi</Text>
                            <View style={styles.actionArrow}>
                                <ArrowUpRight size={18} color={COLORS.primary} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.mainActionBtn}
                        onPress={() => navigation.navigate('History')}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#f8fafc']}
                            style={styles.actionInner}
                        >
                            <View style={[styles.actionIconBox, { backgroundColor: '#f0f9ff' }]}>
                                <History size={26} color="#0ea5e9" />
                            </View>
                            <Text style={styles.actionText}>History Absensi</Text>
                            <Text style={styles.actionSubText}>Lihat Riwayat</Text>
                            <View style={styles.actionArrow}>
                                <ArrowUpRight size={18} color="#0ea5e9" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Quick Shortcuts */}
                <View style={styles.shortcutSection}>
                    <Text style={styles.sectionTitle}>Menu Lainnya</Text>
                    <View style={styles.shortcutRow}>
                        <TouchableOpacity
                            style={styles.shortcutItem}
                            onPress={() => navigation.navigate('LeaveRequest')}
                        >
                            <View style={[styles.shortcutIcon, { backgroundColor: '#fdf2f8' }]}>
                                <Calendar size={22} color={COLORS.primary} />
                            </View>
                            <Text style={styles.shortcutLabel}>Izin/Cuti</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shortcutItem}
                            onPress={() => Alert.alert('Segera Hadir', 'Fitur Performa sedang dalam pengembangan.')}
                        >
                            <View style={[styles.shortcutIcon, { backgroundColor: '#f0f9ff' }]}>
                                <TrendingUp size={22} color="#0ea5e9" />
                            </View>
                            <Text style={styles.shortcutLabel}>Performa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.shortcutItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <View style={[styles.shortcutIcon, { backgroundColor: '#f0fdf4' }]}>
                                <User size={22} color="#22c55e" />
                            </View>
                            <Text style={styles.shortcutLabel}>Profil</Text>
                        </TouchableOpacity>
                    </View>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // Header
    headerArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...SHADOWS.soft,
    },
    dateLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    greetingText: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.text,
        marginTop: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: '#fef2f2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
        borderWidth: 2,
        borderColor: '#f8fafc',
    },

    // 1. Time Card
    timeCard: {
        margin: 24,
        borderRadius: 32,
        padding: 24,
        overflow: 'hidden',
        ...SHADOWS.vibrant,
    },
    timeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    timeLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.5,
    },
    timeValue: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.surface,
        letterSpacing: 1,
    },
    timeSubLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },
    timeDecoration: {
        position: 'absolute',
        bottom: -30,
        right: -20,
    },

    // 2. Status Area
    statusArea: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitleSmall: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.textLight,
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statusItem: {
        flex: 1,
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    statusIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    // 3. Salary Container
    salaryContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    salaryCard: {
        borderRadius: 32,
        padding: 24,
        ...SHADOWS.medium,
    },
    salaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    salaryIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    salaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.surface,
    },
    salaryPeriod: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    eyeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    salaryMain: {
        marginBottom: 10,
    },
    grandTotalLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
        marginBottom: 4,
    },
    grandTotalValue: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.surface,
    },
    salaryDetails: {
        marginTop: 10,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 15,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
    },
    detailValue: {
        fontSize: 13,
        color: COLORS.surface,
        fontWeight: '600',
    },
    perDayText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
        marginTop: 8,
    },
    infoText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        flex: 1,
    },

    // 4. Action Grid
    actionGrid: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
        marginBottom: 32,
    },
    mainActionBtn: {
        flex: 1,
        height: 160,
        borderRadius: 28,
        overflow: 'hidden',
        ...SHADOWS.soft,
    },
    actionInner: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    actionIconBox: {
        width: 50,
        height: 50,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    actionSubText: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    actionArrow: {
        position: 'absolute',
        top: 16,
        right: 16,
    },

    // Shortcut Section
    shortcutSection: {
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    shortcutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        padding: 24,
        borderRadius: 28,
        ...SHADOWS.soft,
    },
    shortcutItem: {
        alignItems: 'center',
        gap: 8,
    },
    shortcutIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shortcutLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text,
    },
});
