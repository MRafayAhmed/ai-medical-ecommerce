<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\Seller;
use App\Http\Controllers\MedicalInventoryController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SellerController;
use Illuminate\Support\Facades\Validator;

Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => $user,
    ]);
});

Route::middleware('auth:sanctum')->get('/profile', function (Request $request) {
    return $request->user();
});

Route::post('/seller/signup', function (Request $request) {
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:sellers',
        'password' => 'required|string|min:8',
    ]);

    $seller = Seller::create([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
    ]);

    return response()->json(['message' => 'Seller registered successfully', 'seller' => $seller], 201);
});

// Medical Inventory API Routes
// Public Medical Inventory Routes
Route::get('/medical-inventory/attributes', [MedicalInventoryController::class, 'attributes']);
Route::get('/medical-inventory', [MedicalInventoryController::class, 'index']);
Route::get('/medical-inventory/{medicalInventory}', [MedicalInventoryController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/medical-inventory', [MedicalInventoryController::class, 'store']);
    Route::put('/medical-inventory/{medicalInventory}', [MedicalInventoryController::class, 'update']);
    Route::delete('/medical-inventory/{medicalInventory}', [MedicalInventoryController::class, 'destroy']);
    Route::apiResource('customers', \App\Http\Controllers\CustomersController::class);
});

Route::match(['get', 'post'], '/customer/login', function (Request $request) {
    // 1. Handle GET requests (user mistake)
    if ($request->isMethod('get')) {
        return response()->json(['message' => 'Method Not Allowed. Please use POST with email and password.'], 405);
    }

    // 2. Validate
    $validator = Illuminate\Support\Facades\Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    try {
        // 3. DB Check
        $user = \App\Models\customers::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 4. Generate Token
        $token = $user->createToken('customer-api-token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);

    } catch (\Exception $e) {
        // 5. Catch DB/Server errors
        return response()->json([
            'message' => 'Server Error',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::post('/customer/register', [\App\Http\Controllers\CustomersController::class, 'store']);

Route::match(['get', 'post'], '/seller/login', function (Request $request) {
    if ($request->isMethod('get')) {
        return response()->json(['message' => 'Method Not Allowed. Please use POST with email and password.'], 405);
    }

    $validator = Illuminate\Support\Facades\Validator::make($request->all(), [
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    try {
        $user = Seller::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('seller-api-token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Server Error',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::middleware(['auth:sanctum', 'seller'])->group(function () {
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('branches', BranchController::class)->except(['index', 'show']);
    Route::match(['PUT', 'POST'], '/categories/{id}', [CategoryController::class, 'update']);
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show', 'update']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('branches', BranchController::class)->only(['index', 'show']);
    Route::apiResource('shopping-carts', ShoppingCartController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('sellers', SellerController::class);
    Route::get('/admin/stats', [App\Http\Controllers\Admin\DashboardController::class, 'index']);
    Route::apiResource('wishlist', WishlistController::class)->only(['index', 'store', 'destroy']);
});

// Publicly accessible routes
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('brands', BrandController::class)->only(['index', 'show']);
Route::apiResource('branches', BranchController::class)->only(['index', 'show']);
