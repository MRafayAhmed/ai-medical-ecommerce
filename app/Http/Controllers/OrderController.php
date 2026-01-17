<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['items.inventory', 'customer'])->latest()->paginate(10);
        return response()->json($orders);
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
            return \DB::transaction(function() use ($request) {
                $order = new Order();
                $order->usrer_id = $request->user_id; // Mapping frontend user_id to usrer_id
                $order->order_date = now();
                $order->total_amount = $request->total_amount;
                $order->status = 'pending';
                $order->payment_preference = $request->payment_preference;
                $order->address = $request->address;
                $order->save();

                foreach ($request->items as $item) {
                    // Create order item
                    $orderItem = new \App\Models\OrderItem();
                    $orderItem->order_id = $order->id;
                    $orderItem->item_id = $item['inventory_id'];
                    $orderItem->qty = $item['qty'];
                    $orderItem->price_at_order = $item['price'];
                    $orderItem->sub_total = $item['qty'] * $item['price'];
                    $orderItem->save();

                    // Decrease Stock
                    $inventory = \App\Models\MedicalInventory::find($item['inventory_id']);
                    if ($inventory) {
                        $inventory->stock = $inventory->stock - $item['qty'];
                        $inventory->save();
                    }
                }

                return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
            });
        } catch (\Throwable $th) {
            \Illuminate\Support\Facades\Log::error('Order Placement Error: ' . $th->getMessage());
            return response()->json(['message' => 'Failed to place order', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,cancelled'
        ]);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully', 'order' => $order]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}
