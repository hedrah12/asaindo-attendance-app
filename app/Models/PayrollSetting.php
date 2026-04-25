<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PayrollSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'label', 'group'];

    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        if (!$setting) return $default;

        switch ($setting->type) {
            case 'integer': return (int) $setting->value;
            case 'boolean': return filter_var($setting->value, FILTER_VALIDATE_BOOLEAN);
            default: return $setting->value;
        }
    }

    public static function set($key, $value)
    {
        return self::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
