import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, StatusBar, Platform, Alert } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { authService } from '../api/services';
import { User, Mail, Shield, LogOut, ChevronRight, Clock, Award, Phone } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await authService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Konfirmasi Keluar',
            'Apakah Anda yakin ingin keluar dari aplikasi?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Keluar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await authService.logout();
                            await SecureStore.deleteItemAsync('auth_token');
                            navigation.replace('Login');
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const ProfileItem = ({ icon: Icon, label, value }) => (
        <View style={styles.profileItem}>
            <View style={styles.itemIconBox}>
                <Icon size={20} color={COLORS.primary} />
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemLabel}>{label}</Text>
                <Text style={styles.itemValue}>{value || '-'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header / Banner */}
            <LinearGradient
                colors={[COLORS.primary, '#be123c']}
                style={styles.headerBanner}
            >
                <View style={styles.headerContent}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <User size={50} color={COLORS.primary} strokeWidth={1.5} />
                        </View>
                        <View style={styles.editBadge}>
                            <Award size={12} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.userName}>{profile?.name}</Text>
                    <Text style={styles.userRole}>Level: {profile?.roles?.[0]?.name || 'Karyawan'}</Text>
                </View>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Info Card */}
                <View style={[styles.sectionCard, { marginTop: -30 }]}>
                    <Text style={styles.sectionTitle}>Informasi Personal</Text>
                    <ProfileItem icon={Mail} label="Email" value={profile?.email} />
                    <View style={styles.divider} />
                    <ProfileItem icon={Phone} label="Device ID" value={profile?.device_id} />
                </View>

                {/* Account Settings Card */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Jadwal Kerja</Text>
                    <ProfileItem
                        icon={Clock}
                        label="Jam Kerja Reguler"
                        value={`${profile?.work_in_time?.substring(0, 5) || '08:00'} - ${profile?.work_out_time?.substring(0, 5) || '17:00'}`}
                    />
                    {profile?.can_overtime && (
                        <>
                            <View style={styles.divider} />
                            <ProfileItem
                                icon={TrendingUp}
                                label="Jadwal Lembur"
                                value={`${profile?.overtime_in_time?.substring(0, 5) || '18:00'} - ${profile?.overtime_out_time?.substring(0, 5) || '21:00'}`}
                            />
                        </>
                    )}
                </View>

                {/* Danger Zone */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <LogOut size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Keluar dari Aplikasi</Text>
                    <ChevronRight size={18} color={COLORS.danger} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

                <View style={styles.footerInfo}>
                    <Text style={styles.versionText}>Aplikasi Terhubung v1.2.0</Text>
                    <Text style={styles.copyText}>© 2026 HR System</Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

// Add TrendingUp import
import { TrendingUp } from 'lucide-react-native';

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
    headerBanner: {
        paddingTop: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: 60,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    headerContent: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    editBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#f59e0b',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    userName: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.surface,
    },
    userRole: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        ...SHADOWS.soft,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textLight,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    itemIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    itemContent: {
        flex: 1,
    },
    itemLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 4,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.1)',
        gap: 16,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.danger,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 40,
        gap: 4,
    },
    versionText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    copyText: {
        fontSize: 10,
        color: COLORS.border,
    }
});
