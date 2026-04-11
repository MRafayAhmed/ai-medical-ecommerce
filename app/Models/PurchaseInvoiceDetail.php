<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseInvoiceDetail extends Model
{
    protected $fillable = [
        'purchase_invoice_id',
        'item_id',
        'qty',
        'rate',
        'amount',
    ];

    public function item(){
        return $this->belongsTo(MedicalInventory::class , 'item_id');
    }
}