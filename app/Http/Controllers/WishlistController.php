<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $wishlist = Wishlist::with('inventory.category')
            ->where('customer_id', $user->id)
            ->get();
            
        return response()->json([
            'data' => $wishlist->map(function($item) {
                return $item->inventory;
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'inventory_id' => 'required|exists:medical_inventories,id',
        ]);

        $user = Auth::user();

        $wishlist = Wishlist::updateOrCreate([
            'customer_id' => $user->id,
            'inventory_id' => $request->inventory_id,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'data' => $wishlist
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $wishlist = Wishlist::where('customer_id', $user->id)
            ->where('inventory_id', $id)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['message' => 'Product removed from wishlist']);
        }

        return response()->json(['message' => 'Item not found in wishlist'], 404);
    }
}
