<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'inventory_id',
    ];

    public function customer()
    {
        return $this->belongsTo(customers::class, 'customer_id');
    }

    public function inventory()
    {
        return $this->belongsTo(MedicalInventory::class, 'inventory_id');
    }
}
