<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Seller extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'registration_no',
        'ntn',
        'email',
        'username',
        'store_address',
        'phone_no',
        'password',
        'branch_id',
        'pharma_license',
        'owner_cnic_front',
        'owner_cnic_back',
        'bank_acc_title',
        'iban',
        'bank_name',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}
