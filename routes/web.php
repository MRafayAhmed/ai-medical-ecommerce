<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Livewire\Volt\Volt;
use App\Http\Controllers\Auth\CustomerLoginController;
use App\Http\Controllers\Auth\SellerLoginController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\MedicalInventoryController;

// Customer authentication routes
Route::prefix('customer')->group(function () {
    Route::get('/login', [CustomerLoginController::class, 'showLoginForm'])
        ->name('customer.login');
        
    Route::post('/login', [CustomerLoginController::class, 'login'])
        ->name('customer.login.submit');
        
    Route::post('/logout', [CustomerLoginController::class, 'logout'])
        ->name('customer.logout');
});

Route::get('/', function () {
    // simple selection page linking to each login (optional)
    return view('auth.choose-login');
});

// Route::get('/customer/login', [CustomerLoginController::class, 'showLoginForm'])->name('customer.login');
// Route::post('/customer/login', [CustomerLoginController::class, 'login']);
// Route::post('/customer/logout', [CustomerLoginController::class, 'logout'])->name('customer.logout');

Route::get('/seller/login', [SellerLoginController::class, 'showLoginForm'])->name('seller.login');
Route::post('/seller/login', [SellerLoginController::class, 'login']);
Route::post('/seller/logout', [SellerLoginController::class, 'logout'])->name('seller.logout');

Route::get('/customer-signup', function () {
    return view('customer.signup');
})->name('customer.signup.form');

Route::post('/customer-signup', [CustomersController::class, 'store'])->name('customer.signup.store');
// Route::resource('customers', CustomersController::class)->except(['create', 'store'])->middleware('auth');
Route::middleware(['auth', 'role:customer'])->group(function () {
    Route::resource('customers', CustomersController::class)->except(['create', 'store']);
});

    // no middleware group here so that anyone can access home
Route::get('/home', [HomeController::class, 'index'])->name('home');
    

Route::middleware('auth:seller')->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    // Route::get('/admin/products', [MedicalInventoryController::class, 'index'])->name('admin.products');
    // add product CRUD routes here
});


// Medical Inventory Routes
Route::middleware('auth:seller')->group(function () {
    Route::resource('medical-inventory', MedicalInventoryController::class)->names([
        'index' => 'medical-inventory.index',
        'create' => 'medical-inventory.create',
        'store' => 'medical-inventory.store',
        'show' => 'medical-inventory.show',
        'edit' => 'medical-inventory.edit',
        'update' => 'medical-inventory.update',
        'destroy' => 'medical-inventory.destroy',
    ]);
});


Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Volt::route('settings/profile', 'settings.profile')->name('profile.edit');
    Volt::route('settings/password', 'settings.password')->name('password.edit');
    Volt::route('settings/appearance', 'settings.appearance')->name('appearance.edit');

    Volt::route('settings/two-factor', 'settings.two-factor')
        ->middleware(
            when(
                Features::canManageTwoFactorAuthentication()
                    && Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword'),
                ['password.confirm'],
                [],
            ),
        )
        ->name('two-factor.show');
});

Route::get('/seller/signup', function () {
    return view('auth.seller-signup');
})->name('seller.signup.form');

Route::post('/seller/signup', [SellerController::class, 'store'])->name('seller.signup.store');
Route::get('/seller/signup', [SellerController::class, 'create'])->name('seller.signup.create');

require __DIR__.'/auth.php';
