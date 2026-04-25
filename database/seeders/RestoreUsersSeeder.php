<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RestoreUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Iqbal Maulana',
                'email' => 'iqbal@gmail.com',
                'password' => Hash::make('password'),
                'salary' => 120000,
                'salary_type' => 'tetap',
            ],
            [
                'name' => 'Fahrul Rozi',
                'email' => 'arul@gmail.com',
                'password' => Hash::make('password'),
                'salary' => 100000,
                'salary_type' => 'harian',
            ],
            [
                'name' => 'Rio',
                'email' => 'rio@gmail.com',
                'password' => Hash::make('password'),
                'salary' => 90000,
                'salary_type' => 'harian',
            ],
        ];

        foreach ($users as $userData) {
            User::firstOrCreate(['email' => $userData['email']], $userData);
        }
    }
}
