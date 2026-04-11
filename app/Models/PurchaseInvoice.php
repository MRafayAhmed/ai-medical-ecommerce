<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseInvoice extends Model
{
    public function details(){
        return $this->hasMany(PurchaseInvoiceDetail::class);
    }
}
