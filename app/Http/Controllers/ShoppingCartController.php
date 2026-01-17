<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\CartItems;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shoppingCarts = ShoppingCart::paginate(10);
        return response()->json($shoppingCarts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $shoppingCart = new ShoppingCart();
            $shoppingCart->user_id = $request->user_id;
            $shoppingCart->branch_id = $request->branch_id;
            $shoppingCart->total_amount = $request->total_amount;
            $shoppingCart->save();
            $this->cartitems($shoppingCart->id , $request->cart_items);
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $shoppingCart = ShoppingCart::find($id);
        return response()->json($shoppingCart);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ShoppingCart $shoppingCart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $shoppingCart = ShoppingCart::find($id);
            $shoppingCart->user_id = $request->user_id;
            $shoppingCart->branch_id = $request->branch_id;
            $shoppingCart->total_amount = $request->total_amount;
            $shoppingCart->save();
            CartItems::where('cart_id', $id)->delete();
            $this->cartitems($shoppingCart->id , $request->cart_items);
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
            $shoppingCart = ShoppingCart::find($id);
            $shoppingCart->delete();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    public function cartitems($cart_id , $cart_items)
    {
        try {
            $data = [];
            foreach ($cart_items as $cart_item) {
                $data[] = [
                    'cart_id' => $cart_id,
                    'item_id' => $cart_item['item_id'],
                    'qty' => $cart_item['qty'],
                    'price' => $cart_item['price'],
                    'total_price' => $cart_item['total_price'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            CartItems::insert($data);
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }
}
