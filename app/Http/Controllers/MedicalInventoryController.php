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
        $search = request()->get('q');
        $categoryId = request()->get('category_id');
        
        $query = MedicalInventory::with(['brand', 'category', 'branch']);
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('generic_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
        
        // Cache based on page, search query, and category
        $cacheKey = 'inventory_page_' . $page . '_search_' . md5($search) . '_cat_' . $categoryId;
        
        $inventories = Cache::remember($cacheKey, 3600, function () use ($query) {
            return $query->paginate(10);
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
        if (!$medicalInventory) {
            return response()->json(['message' => 'Product not found'], 404);
        }
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
            if (!$inventory) {
                return response()->json(['message' => 'Product not found'], 404);
            }
            
            // Manual assignment to handle all fields safely
            if ($request->has('branch_id')) $inventory->branch_id = $request->branch_id;
            if ($request->has('brand_id')) $inventory->brand_id = $request->brand_id;
            if ($request->has('category_id')) $inventory->category_id = $request->category_id;
            if ($request->has('product_name')) $inventory->product_name = $request->product_name;
            if ($request->has('price')) $inventory->price = $request->price;
            if ($request->has('discount')) $inventory->discount = filled($request->discount) ? $request->discount : 0;
            if ($request->has('stock')) $inventory->stock = $request->stock;
            if ($request->has('generic_name')) $inventory->generic_name = $request->generic_name;
            if ($request->has('dosage')) $inventory->dosage = $request->dosage;
            if ($request->has('pack_size')) $inventory->pack_size = $request->pack_size;
            if ($request->has('description')) $inventory->description = $request->description;
            if ($request->has('mrp')) $inventory->mrp = $request->mrp;
            
            if ($request->hasFile('image')) {
                $inventory->image = $request->file('image')->store('products', 'public');
            }
            
            $inventory->save();

            $this->clearCache();
            return response()->json(['message' => 'Product updated successfully', 'data' => $inventory]);
        } catch (\Throwable $th) {
            \Illuminate\Support\Facades\Log::error('MedicalInventory Update Error: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to update product', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $inventory = MedicalInventory::find($id);
            if (!$inventory) {
                return response()->json(['message' => 'Product not found'], 404);
            }
            $inventory->delete();
            
            $this->clearCache();
            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Deletion failed', 'error' => $th->getMessage()], 500);
        }
    }

    private function clearCache()
    {
        Cache::forget('inventory_attributes');
        // Clear first 5 pages which is the most common use case.
        for ($i = 1; $i <= 5; $i++) {
            Cache::forget('inventory_page_' . $i);
        }
    }
}