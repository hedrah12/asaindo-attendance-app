<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Office;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        $admin = \App\Models\User::factory()->create([
            'name' => 'Admin HRD',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
        ]);

        // Karyawan
        $user = \App\Models\User::factory()->create([
            'name' => 'Karyawan Test',
            'email' => 'user@gmail.com',
            'password' => Hash::make('password'),
        ]);

        // Office
        \App\Models\Office::create([
            'name' => 'Kantor Pusat',
            'latitude' => -6.200000, // Contoh Jakarta
            'longitude' => 106.816666,
            'radius' => 100,
        ]);
    }
}
