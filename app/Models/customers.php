<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class customers extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'customers'; 

    protected $fillable = [
        'name',
        'gender',
        'date_of_birth',
        'cnic',
        'email',
        'phone_number',
        'address',
        'city',
        'username',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];
}
