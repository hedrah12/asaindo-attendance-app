<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Send a push notification to one or more Expo Push Tokens.
     *
     * @param string|array $to Expo Push Token(s)
     * @param string $title Notification title
     * @param string $body Notification body
     * @param array $data Additional data payload
     * @return bool
     */
    public static function sendPushNotification($to, string $title, string $body, array $data = [])
    {
        if (empty($to)) {
            return false;
        }

        $tokens = is_array($to) ? $to : [$to];
        
        // Filter out invalid/empty tokens
        $tokens = array_values(array_filter($tokens));
        
        if (empty($tokens)) {
            return false;
        }

        $messages = [];
        foreach ($tokens as $token) {
            $messages[] = [
                'to' => $token,
                'title' => $title,
                'body' => $body,
                'data' => $data,
                'sound' => 'default',
            ];
        }

        try {
            $response = Http::post('https://exp.host/--/api/v2/push/send', $messages);

            if ($response->successful()) {
                return true;
            }

            Log::error('Expo Push Notification Error', [
                'response' => $response->json(),
                'tokens' => $tokens
            ]);
        } catch (\Exception $e) {
            Log::error('Expo Push Notification Exception', [
                'message' => $e->getMessage(),
                'tokens' => $tokens
            ]);
        }

        return false;
    }
}
