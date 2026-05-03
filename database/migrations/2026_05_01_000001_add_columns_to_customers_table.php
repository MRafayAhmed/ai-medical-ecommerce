<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'name')) {
                $table->string('name')->after('id');
            }
            if (!Schema::hasColumn('customers', 'gender')) {
                $table->enum('gender', ['Male', 'Female'])->nullable()->after('name');
            }
            if (!Schema::hasColumn('customers', 'date_of_birth')) {
                $table->date('date_of_birth')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('customers', 'cnic')) {
                $table->string('cnic')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('customers', 'email')) {
                $table->string('email')->unique()->after('cnic');
            }
            if (!Schema::hasColumn('customers', 'phone_number')) {
                $table->string('phone_number')->nullable()->after('email');
            }
            if (!Schema::hasColumn('customers', 'address')) {
                $table->string('address')->nullable()->after('phone_number');
            }
            if (!Schema::hasColumn('customers', 'city')) {
                $table->string('city')->nullable()->after('address');
            }
            if (!Schema::hasColumn('customers', 'username')) {
                $table->string('username')->unique()->after('city');
            }
            if (!Schema::hasColumn('customers', 'password')) {
                $table->string('password')->after('username');
            }
            if (!Schema::hasColumn('customers', 'postal_code')) {
                $table->string('postal_code')->nullable()->after('password');
            }
            if (!Schema::hasColumn('customers', 'remember_token')) {
                $table->rememberToken()->after('postal_code');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'name', 'gender', 'date_of_birth', 'cnic', 'email',
                'phone_number', 'address', 'city', 'username', 'password',
                'postal_code', 'remember_token',
            ]);
        });
    }
};
