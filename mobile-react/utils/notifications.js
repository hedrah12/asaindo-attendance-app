import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGoAndroid = Constants.appOwnership === 'expo' && Platform.OS === 'android';

// Dynamically require Notifications to avoid crashes in Expo Go Android SDK 53+
let Notifications = null;
if (!isExpoGoAndroid) {
    try {
        Notifications = require('expo-notifications');
    } catch (e) {
        console.log('Failed to load expo-notifications:', e);
    }
}

if (Notifications) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

export async function registerForPushNotificationsAsync() {
    if (isExpoGoAndroid || !Notifications) {
        console.warn('Push Notifications (Remote) tidak didukung di Expo Go untuk SDK 53+. Gunakan Development Build.');
        return null;
    }

    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Gagal mendapatkan push token untuk push notification!');
            return;
        }

        // Use projectId from expo config if available
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('Push Token:', token);
    } else {
        alert('Harus menggunakan perangkat fisik untuk Push Notifications');
    }

    return token;
}

export function handleNotifications(onReceive, onResponse) {
    if (isExpoGoAndroid || !Notifications) {
        return () => { };
    }

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
        if (onReceive) onReceive(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        if (onResponse) onResponse(response);
    });

    return () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
    };
}
