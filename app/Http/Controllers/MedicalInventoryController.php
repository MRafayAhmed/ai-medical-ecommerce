<?php

namespace App\Http\Controllers;

use App\Models\MedicalInventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Branch;
use App\Models\Category;
use App\Models\Brand;

use Illuminate\Support\Facades\Cache;

class MedicalInventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $page = request()->get('page', 1);
        $inventories = Cache::remember('inventory_page_' . $page, 3600, function () {
            return MedicalInventory::with(['brand', 'category', 'branch'])->paginate(10);
        });
        return response()->json($inventories);
    }

    public function attributes()
    {
        return Cache::remember('inventory_attributes', 3600, function () {
            return [
                'brands' => Brand::all(),
                'categories' => Category::all(),
                'branches' => Branch::all()
            ];
        });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // ... (unused in API context)
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $product = new MedicalInventory();
            $product->brand_id = $request->brand_id;
            $product->brand_name = $request->brand_name;
            $product->branch_id = $request->branch_id;
            $product->product_name = $request->product_name;
            $product->price = $request->price;
            $product->discount = filled($request->discount) ? $request->discount : 0;
            $product->category_id = $request->category_id;
            $product->generic_name = $request->generic_name;
            $product->dosage = $request->dosage;
            $product->pack_size = $request->pack_size;
            $product->description = $request->description;
            $product->mrp = $request->mrp;
            $product->stock = $request->stock;
            $product->save();

            $this->clearCache();
            return $this->index();
        } catch (\Throwable $th) {
            \Illuminate\Support\Facades\Log::error('MedicalInventory Store Error: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to create product', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $medicalInventory = MedicalInventory::with(['brand', 'category', 'branch'])->find($id);
        return response()->json($medicalInventory);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // ...
    }

    /**
     * Update the specified inventory item in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $inventory = MedicalInventory::find($id);
            // $inventory->update($request->all());
            $inventory->branch_id = $request->branch_id;
            $inventory->brand_id = $request->brand_id;
            $inventory->category_id = $request->category_id;
            $inventory->product_name = $request->product_name;
            $inventory->price = $request->price;
            $inventory->discount = filled($request->discount) ? $request->discount : 0;
            $inventory->stock = $request->stock;
            $inventory->generic_name = $request->generic_name;
            $inventory->dosage = $request->dosage;
            $inventory->pack_size = $request->pack_size;
            $inventory->description = $request->description;
            $inventory->mrp = $request->mrp;
            $inventory->save();

            $this->clearCache();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $inventory = MedicalInventory::find($id);
            $inventory->delete();
            
            $this->clearCache();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    private function clearCache()
    {
        Cache::forget('inventory_attributes');
        // Clear first 5 pages just to be safe, or use tags if driver supports it. 
        // For file driver, we can't delete wildcards easily. 
        // We'll clear the first few pages which is the most common use case.
        for ($i = 1; $i <= 10; $i++) {
            Cache::forget('inventory_page_' . $i);
        }
    }
}