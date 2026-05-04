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
    public function featuredProducts(Request $request)
    {
        $letter = $request->query('letter');
        $query = MedicalInventory::with(['brand', 'category', 'branch']);

        if ($letter) {
            $query->where('product_name', 'LIKE', "{$letter}%");
        }

        // Return paginated results
        return response()->json($query->paginate(24));
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (session_id()) session_write_close(); // Unblock other requests if using sessions
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
        
        $inventories = Cache::remember($cacheKey, 86400, function () use ($query) {
            return $query->paginate(20); // Increased page size for fewer round-trips if navigating
        });
        
        return response()->json($inventories);
    }

    public function dashboardData(Request $request)
    {
        if (session_id()) session_write_close();
        
        $search = $request->get('q');
        
        // 1. Fetch Categories (Cached)
        $categories = Cache::remember('categories_all_dashboard', 3600, function () {
            return Category::all();
        });

        // 2. Fetch Inventory (First page, selective columns for speed)
        $inventories = $this->index()->original;

        // 3. Fetch Wishlist and Recent Orders if logged in
        $wishlist = [];
        $recentOrders = [];
        if (Auth::guard('sanctum')->check()) {
            $user = Auth::guard('sanctum')->user();
            $wishlist = \App\Models\Wishlist::where('customer_id', $user->id)
                                           ->pluck('inventory_id')
                                           ->toArray();
            
            // Fetch orders for any authenticated user (as usrer_id)
            $recentOrders = \App\Models\Order::where('usrer_id', $user->id)
                                            ->latest()
                                            ->take(12)
                                            ->get();
        }

        return response()->json([
            'categories' => $categories,
            'inventory' => $inventories,
            'wishlist' => $wishlist,
            'recentOrders' => $recentOrders
        ]);
    }

    public function recentOrders(Request $request)
    {
        $userId = auth('sanctum')->id();
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $orders = \App\Models\Order::where('usrer_id', $userId)
            ->orderBy('id', 'desc')
            ->take(12)
            ->get();

        return response()->json($orders);
    }

    public function analyzeRx(Request $request)
    {
        $request->validate([
            'rx_image' => 'required|image|max:10240', // Max 10MB
        ]);

        try {
            // 1. Get the uploaded file
            $image = $request->file('rx_image');
            
            // 2. Call Python API
            // Using the provided ngrok URL
            $pythonApiUrl = 'https://unsatirised-deathly-israel.ngrok-free.dev/ocr_api'; // Updated from user request
            // Let's assume root or specific endpoint. User said "this is the python scipt ... url".
            // Usually APIs have an endpoint. If it's a script, maybe it's just POST /
            // I'll try POST / first or look at user prompt again. "upload a image to a python endpoint".
            
            // I will use the root URL if no endpoint specified, but safest to append /predict or /extract if standard. 
            // However, user just gave the base URL. I'll use the base URL.
            // Correction: I'll use the base URL for now.
            
            $response = \Illuminate\Support\Facades\Http::withoutVerifying()->attach(
                'file', file_get_contents($image->path()), $image->getClientOriginalName()
            )->post($pythonApiUrl);

            if ($response->failed()) {
                \Illuminate\Support\Facades\Log::error('Python API Error: ' . $response->body());
                return response()->json(['message' => 'Failed to analyze prescription with AI service'], 502);
            }

            $data = $response->json();
            
            // Transform Python API response to match Frontend expectations
            // Python returns: { "verified_medicines": [ { "medicine_name": "...", "generic": "...", ... } ] }
            // Frontend expects: [ { "name": "...", "generic": "...", ... } ]
            
            $medicines = [];
            if (isset($data['verified_medicines']) && is_array($data['verified_medicines'])) {
                foreach ($data['verified_medicines'] as $med) {
                    $medicines[] = [
                        'name' => $med['medicine_name'] ?? 'Unknown',
                        'generic' => $med['generic'] ?? null,
                        'dosage' => $med['dosage'] ?? null,
                    ];
                }
            } else {
                 // Fallback if structure is different
                 \Illuminate\Support\Facades\Log::warning('Unexpected Python API response structure', ['data' => $data]);
                 return response()->json(['message' => 'Invalid response from AI service'], 502);
            }

            return response()->json($medicines);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('AnalyzeRx Exception: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to analyze prescription', 'error' => $e->getMessage()], 500);
        }
    }

    public function alternatives(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Alternatives Request:', $request->all());
        $genericName = $request->query('generic_name');

        if (!$genericName) {
            return response()->json(['message' => 'Generic name is required'], 400);
        }

        $alternatives = MedicalInventory::where('generic_name', $genericName)
                                        ->with(['brand', 'category', 'branch'])
                                        ->get();

        return response()->json($alternatives);
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

    public function getStocks()
    {
        $stocks = \App\Services\MaintainStockService::get_all_items();
        return response()->json($stocks);
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
        // Flush all related cache keys
        \Illuminate\Support\Facades\Cache::forget('inventory_attributes');
        \Illuminate\Support\Facades\Cache::forget('categories_all_dashboard');
        
        // Since cache keys are dynamic (pagination/search), 
        // the safest way in development is to clear the whole cache tags or prefix 
        // if supported, but here we will just clear the common ones.
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
    }
}