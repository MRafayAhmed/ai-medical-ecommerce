<?php

namespace App\Services;

use App\Models\MedicalInventory;
use App\Models\StockLedger;

class MaintainStockService
{
    public static function get_all_items()
    {
        $items = MedicalInventory::all()->pluck('id')->toArray();
        $data = [];
        foreach($items as $item){
            $stock = StockLedger::where('item_id', $item)->sum('qty');
            $data[] = [
                'item_id' => $item,
                'stock' => $stock,
            ];
        }
        return $data;
    }
    public static function validateStock($items)
    {
        $itemSums = [];
        foreach ($items as $item) {
            $itemId = $item['item_id'] ?? $item['inventory_id'] ?? null;
            $requestedQty = $item['qty'] ?? 0;
            if ($itemId && $requestedQty > 0) {
                if (!isset($itemSums[$itemId])) {
                    $itemSums[$itemId] = 0;
                }
                $itemSums[$itemId] += $requestedQty;
            }
        }

        foreach ($itemSums as $itemId => $requestedQty) {
            // Stock is calculated purely from the StockLedger (sum of all entries).
            // If an item has no ledger entries, its stock is treated as 0.
            $currentStock = StockLedger::where('item_id', $itemId)->sum('qty');

            if ($requestedQty > $currentStock) {
                $inventory = MedicalInventory::find($itemId);
                $itemName = $inventory ? $inventory->product_name : "Item ID {$itemId}";
                throw new \Exception("Sorry, '{$itemName}' is out of stock. Only {$currentStock} remaining.");
            }
        }
    }

    public static function maintainStock($items, $ref_id, $ref_document_identity ,$type)
    {
        $data = [];
        $multiplier = ($type == 'decrease') ? -1 : 1;
        foreach ($items as $item) {
            $data[] = [
                'ref_id' => $ref_id,
                'ref_document_identity' => $item['ref_document_identity'] ?? $ref_document_identity,
                'qty' => $item['qty'] * $multiplier,
                'item_id' => $item['item_id'] ?? $item['inventory_id'],  // support both key names
                'base_qty' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        StockLedger::insert($data);
    }
    /**
     * Decrease the stock of a given inventory item.
     *
     * @param int $inventoryId
     * @param int $qty
     * @return bool
     */
    public function decreaseStock($inventoryId, $qty)
    {
        $inventory = MedicalInventory::find($inventoryId);
        if ($inventory) {
            $inventory->stock = $inventory->stock - $qty;
            return $inventory->save(); // Also ensuring the change is actually saved to the database.
        }
        return false;
    }
    
    /**
     * Increase the stock of a given inventory item (e.g. for cancelled orders).
     *
     * @param int $inventoryId
     * @param int $qty
     * @return bool
     */
    public function increaseStock($inventoryId, $qty)
    {
        $inventory = MedicalInventory::find($inventoryId);
        if ($inventory) {
            $inventory->stock = $inventory->stock + $qty;
            return $inventory->save();
        }
        return false;
    }
}
