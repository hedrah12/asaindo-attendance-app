<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'check_in',
        'check_out',
        'latitude',
        'longitude',
        'photo',
        'photo_out',
        'status',
        'is_overtime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
