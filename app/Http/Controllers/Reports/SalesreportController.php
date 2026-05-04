<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SalesreportController extends Controller
{
    public function filter_salesreport(Request $request)
    {
        $query = Order::with(['customer', 'items.inventory']);

        if ($request->filled('start_date')) {
            $query->whereDate('order_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('order_date', '<=', $request->end_date);
        }

        if ($request->filled('order_status')) {
            $query->where('status', $request->order_status);
        }

        if ($request->filled('payment_preference')) {
            $query->where('payment_preference', $request->payment_preference);
        }

        $orders = $query->latest()->get();

        $data = [];
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $data[] = [
                    'Order ID' => $order->id,
                    'Order Date' => $order->order_date,
                    'User' => $order->customer?->name ?? 'N/A',
                    'Items' => $item->inventory?->product_name ?? 'N/A',
                    'Generic Name' => $item->inventory?->generic_name ?? 'N/A',
                    'Quantity' => $item->qty,
                    'Price' => $item->price_at_order,
                    'Order Status' => $order->status,
                    'Total' => $item->sub_total,
                ];
            }
        }

        if ($request->has('export') && $request->export == 'excel') {
            return $this->exportToCsv($data);
        }

        return response()->json($data);
    }

    private function exportToCsv($data)
    {
        $headers = [
            'Content-type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename=sales_report_' . date('Y-m-d') . '.csv',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0'
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');
            
            // Add UTF-8 BOM for Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            if (!empty($data)) {
                // Header
                fputcsv($file, array_keys($data[0]));

                // Data
                foreach ($data as $row) {
                    fputcsv($file, array_values($row));
                }
            }
            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}