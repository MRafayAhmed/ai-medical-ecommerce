<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'usrer_id',
        'order_date',
        'total_amount',
        'status',
        'payment_preference',
        'address'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(customers::class, 'usrer_id');
    }
}
