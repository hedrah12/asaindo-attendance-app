<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'date',
        'start_date',
        'end_date',
        'reason',
        'proof_photo',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
