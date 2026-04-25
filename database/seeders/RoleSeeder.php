<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'karyawan', 'guard_name' => 'web']);

        // Assign admin role to the main admin
        $admin = User::where('email', 'admin@gmail.com')->first();
        if ($admin) {
            $admin->assignRole($adminRole);
        }

        // Assign employee role to all other users
        $employees = User::whereNot('email', 'admin@gmail.com')->get();
        foreach ($employees as $employee) {
            $employee->assignRole($employeeRole);
        }
    }
}
