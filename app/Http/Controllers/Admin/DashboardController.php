<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\customers;
use App\Models\Seller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $stats = [
            'buyers' => customers::count(),
            'sellers' => Seller::count(),
            'ordersToday' => Order::whereDate('order_date', $today)->count(),
            'revenue' => Order::sum('total_amount'),
            'verifications' => 5, // Mocked for now
            'newSignups' => customers::whereDate('created_at', $today)->count(),
            'returns' => 0, // Mocked
            'deliveryDays' => 3, // Mocked
            'supportTickets' => 12, // Mocked
            'avgOrderValue' => Order::count() > 0 ? Order::sum('total_amount') / Order::count() : 0,
            
            // Recent activity
            'recentActivity' => $this->getRecentActivity()
        ];

        return response()->json($stats);
    }

    private function getRecentActivity()
    {
        $activities = [];

        // Last 3 customers
        $recentCustomers = customers::latest()->take(3)->get();
        foreach ($recentCustomers as $customer) {
            $activities[] = [
                'id' => 'cust_' . $customer->id,
                'message' => "New customer \"{$customer->name}\" registered.",
                'time' => $customer->created_at->diffForHumans()
            ];
        }

        // Last 3 orders
        $recentOrders = Order::with('customer')->latest()->take(3)->get();
        foreach ($recentOrders as $order) {
            $customerName = $order->customer ? $order->customer->name : 'Unknown';
            $activities[] = [
                'id' => 'ord_' . $order->id,
                'message' => "Order #{$order->id} for {$customerName} placed.",
                'time' => $order->created_at->diffForHumans()
            ];
        }

        // Sort by time (hacky since we don't have a shared activity table)
        return collect($activities)->take(5);
    }
}
