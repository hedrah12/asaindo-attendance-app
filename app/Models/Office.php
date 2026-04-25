<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $fillable = [
        'name',
        'latitude',
        'longitude',
        'radius',
        'check_in_time',
        'check_out_time',
        'overtime_in_time',
        'overtime_out_time',
    ];
}
