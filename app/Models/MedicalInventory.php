<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalInventory extends Model
{
    use HasFactory;

    protected $table = 'medical_inventories';
    public $timestamps = false;
    protected $fillable = [
        'brand_name',
        'branch_id',
        'product_name',
        'price',
        'discount',
        'category_id',
        'generic_name',
        'dosage',
        'pack_size',
        'description',
        'mrp',
        'stock',
        'image',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class , 'branch_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class , 'category_id');
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class , 'brand_id');
    }
}
