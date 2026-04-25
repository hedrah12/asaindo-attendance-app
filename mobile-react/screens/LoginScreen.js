import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Dimensions, StatusBar, ScrollView } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '../constants/theme';
import { authService } from '../api/services';
import { registerForPushNotificationsAsync } from '../utils/notifications';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { LogIn, Lock, Mail, Smartphone, ArrowRight, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Silakan isi email dan password');
            return;
        }

        setLoading(true);
        try {
            let deviceId = '';

            // 1. Coba ambil ID Hardware (Terutama Android)
            if (Platform.OS === 'android') {
                deviceId = Application.androidId;
            }

            // 2. Jika ID hardware tidak ada (Emulator/Expo Go) atau di iOS, gunakan ID Virtual
            if (!deviceId || deviceId === 'android_emulator_or_missing') {
                // Cek apakah sudah pernah buat ID virtual sebelumnya
                deviceId = await SecureStore.getItemAsync('virtual_device_id');

                if (!deviceId) {
                    // Buat ID baru yang unik dan simpan permanen
                    deviceId = `VIRTUAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    await SecureStore.setItemAsync('virtual_device_id', deviceId);
                }
            }

            // Get Push Token
            let pushToken = null;
            try {
                pushToken = await registerForPushNotificationsAsync();
            } catch (err) {
                console.log('Failed to get push token:', err);
            }

            const data = await authService.login(email, password, deviceId, pushToken);
            await SecureStore.setItemAsync('auth_token', data.access_token);
            navigation.replace('Main');
        } catch (error) {
            console.error('Login Error:', error);
            let errorMessage = 'Terjadi kesalahan sistem';

            if (error.response?.data?.errors) {
                const errorData = error.response.data.errors;
                const firstKey = Object.keys(errorData)[0];
                errorMessage = errorData[firstKey][0];
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Alert.alert('Gagal Login', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* High-End Background Mesh */}
            <View style={styles.meshContainer}>
                <View style={styles.meshCircle1} />
                <View style={styles.meshCircle2} />
                <View style={styles.meshCircle3} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.topSection}>
                        <View style={styles.brandIconBox}>
                            <Zap size={32} color={COLORS.surface} strokeWidth={2.5} />
                        </View>
                        <Text style={styles.brandTitle}>ASA<Text style={{ color: COLORS.surface, opacity: 0.6 }}>INDO</Text></Text>
                        <Text style={styles.brandTagline}>Empowering Your Workday</Text>
                    </View>

                    <View style={styles.loginBentoCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.welcomeTitle}>Sign In</Text>
                            <Text style={styles.welcomeSubtitle}>Enter your credentials to continue</Text>
                        </View>

                        <View style={styles.formArea}>
                            {/* Email Field - Simplified for stability */}
                            <View style={styles.inputBento}>
                                <View style={styles.inputInner}>
                                    <Mail size={20} color={COLORS.primary} />
                                    <TextInput
                                        style={styles.field}
                                        placeholder="Email Address"
                                        placeholderTextColor={COLORS.textLight}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Password Field */}
                            <View style={styles.inputBento}>
                                <View style={styles.inputInner}>
                                    <Lock size={20} color={COLORS.primary} />
                                    <TextInput
                                        style={styles.field}
                                        placeholder="Password"
                                        placeholderTextColor={COLORS.textLight}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Premium Primary Action */}
                            <TouchableOpacity
                                style={styles.primaryBtn}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={COLORS.surface} />
                                ) : (
                                    <>
                                        <Text style={styles.btnText}>Masuk Ke Akun</Text>
                                        <View style={styles.btnArrow}>
                                            <ArrowRight size={18} color={COLORS.primary} strokeWidth={3} />
                                        </View>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bentoFooter}>
                            <View style={styles.divider} />
                            <View style={styles.securityInfo}>
                                <Smartphone size={12} color={COLORS.textLight} />
                                <Text style={styles.securityText}>Secure Device Binding Active</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomLink}>
                        <Text style={styles.bottomLinkText}>New Employee? <Text style={styles.bottomLinkAction}>Contact HR</Text></Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a', // Deep slate for premium look
    },
    meshContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    meshCircle1: {
        position: 'absolute',
        top: -50,
        right: -80,
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: COLORS.primary,
        opacity: 0.25,
    },
    meshCircle2: {
        position: 'absolute',
        bottom: 100,
        left: -100,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: COLORS.secondary,
        opacity: 0.15,
    },
    meshCircle3: {
        position: 'absolute',
        top: 200,
        left: 50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#6366f1',
        opacity: 0.1,
    },
    mainWrapper: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    brandIconBox: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.vibrant,
        marginBottom: 20,
        transform: [{ rotate: '-10deg' }],
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: COLORS.surface,
        letterSpacing: -1,
    },
    brandTagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 6,
        fontWeight: '500',
    },
    loginBentoCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 32,
        padding: 24,
        ...SHADOWS.medium,
    },
    cardHeader: {
        marginBottom: 32,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    welcomeSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    formArea: {
        gap: 16,
    },
    inputBento: {
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 64,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputBentoActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#fff',
        ...SHADOWS.soft,
    },
    inputInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    field: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: -4,
    },
    forgotText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    primaryBtn: {
        backgroundColor: COLORS.text, // Dark button for contrast
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 24,
        ...SHADOWS.vibrant,
    },
    btnText: {
        flex: 1,
        color: COLORS.surface,
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btnArrow: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bentoFooter: {
        marginTop: 32,
        alignItems: 'center',
    },
    divider: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#f1f5f9',
        marginBottom: 20,
    },
    securityInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    securityText: {
        fontSize: 11,
        color: COLORS.textLight,
        fontWeight: '600',
    },
    bottomLink: {
        marginTop: 32,
        alignItems: 'center',
    },
    bottomLinkText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
    },
    bottomLinkAction: {
        color: COLORS.surface,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
