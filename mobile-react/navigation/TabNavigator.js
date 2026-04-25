import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import LeaveRequestScreen from '../screens/LeaveRequestScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { LayoutDashboard, MapPin, Calendar, Clock, User } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { View, Platform, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textLight,
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: -5, // Pull label slightly closer to icon for tight centering
                    marginBottom: 10,
                },
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 30 : 20,
                    left: 20,
                    right: 20,
                    height: 80, // Slightly taller to safely contain both icon+label
                    borderRadius: 24,
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 0,
                    paddingTop: 0, // Reset padding
                    ...SHADOWS.medium,
                },
                tabBarItemStyle: {
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 10,
                },
                tabBarIcon: ({ focused, color }) => {
                    let IconComponent;
                    if (route.name === 'Dashboard') IconComponent = LayoutDashboard;
                    else if (route.name === 'Attendance') IconComponent = MapPin;
                    else if (route.name === 'LeaveRequest') IconComponent = Calendar;
                    else if (route.name === 'History') IconComponent = Clock;
                    else if (route.name === 'Profile') IconComponent = User;

                    return (
                        <View style={[
                            styles.iconContainer,
                            focused && styles.activeIconContainer
                        ]}>
                            <IconComponent size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="Attendance"
                component={AttendanceScreen}
                options={{ title: 'Absen' }}
            />
            <Tab.Screen
                name="LeaveRequest"
                component={LeaveRequestScreen}
                options={{ title: 'Izin' }}
            />
            <Tab.Screen
                name="History"
                component={AttendanceHistoryScreen}
                options={{ title: 'Riwayat' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profil' }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconContainer: {
        backgroundColor: '#fef2f2',
    }
});
