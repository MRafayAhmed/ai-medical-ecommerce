<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\customers;
use App\Models\MedicalInventory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\Brand;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RealisticDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure a Branch exists
        $branch = \App\Models\Branch::firstOrCreate(
            ['name' => 'Main Branch'],
            ['address' => 'Karachi', 'phone_number' => '02130000000']
        );

        // 2. Ensure Categories and Brands exist
        $categories = ['Medicine', 'Supplements', 'Devices', 'Protection', 'Personal Care'];
        $catModels = [];
        foreach ($categories as $name) {
            $catModels[$name] = Category::firstOrCreate(['name' => $name]);
        }

        $brands = ['GSK', 'Searle', 'Abbott', 'Getz', 'Sanofi', 'Generic'];
        $brandModels = [];
        foreach ($brands as $name) {
            $brandModels[$name] = Brand::firstOrCreate(['name' => $name]);
        }

        // 2. Clear existing order data to avoid confusion (Optional but good for clean seed)
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // OrderItem::truncate();
        // Order::truncate();
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 3. Populate Realistic Inventory
        $inventoryData = [
            // Winter/Flu Season
            ['product_name' => 'Panadol CF', 'generic_name' => 'Paracetamol/Pseudoephedrine', 'category' => 'Medicine', 'brand' => 'GSK', 'price' => 150, 'stock' => 500],
            ['product_name' => 'Surbex-Z', 'generic_name' => 'Zinc + Vitamin B', 'category' => 'Supplements', 'brand' => 'Abbott', 'price' => 280, 'stock' => 300],
            ['product_name' => 'Cac-1000 Plus', 'generic_name' => 'Calcium + Vitamin C', 'category' => 'Supplements', 'brand' => 'GSK', 'price' => 450, 'stock' => 450],
            ['product_name' => 'Hydryllin Syrup', 'generic_name' => 'Aminophylline', 'category' => 'Medicine', 'brand' => 'Searle', 'price' => 85, 'stock' => 200],
            
            // Karachi Heatwave (Summer)
            ['product_name' => 'ORS Lemon', 'generic_name' => 'Oral Rehydration Salts', 'category' => 'Medicine', 'brand' => 'Searle', 'price' => 25, 'stock' => 2000],
            ['product_name' => 'Entamizole DS', 'generic_name' => 'Diloxanite/Metronidazole', 'category' => 'Medicine', 'brand' => 'Abbott', 'price' => 220, 'stock' => 300],
            
            // Eid-ul-Adha (Digestive)
            ['product_name' => 'Flagyl 400mg', 'generic_name' => 'Metronidazole', 'category' => 'Medicine', 'brand' => 'Sanofi', 'price' => 120, 'stock' => 600],
            ['product_name' => 'Digas Tablet', 'generic_name' => 'Simethicone', 'category' => 'Medicine', 'brand' => 'Getz', 'price' => 180, 'stock' => 400],
            ['product_name' => 'Gaviscon Syrup', 'generic_name' => 'Sodium Alginate', 'category' => 'Medicine', 'brand' => 'GSK', 'price' => 320, 'stock' => 250],
            
            // Devices & Protection
            ['product_name' => 'Digital Thermometer', 'generic_name' => 'Thermometer', 'category' => 'Devices', 'brand' => 'Generic', 'price' => 450, 'stock' => 100],
            ['product_name' => 'Face Mask N95', 'generic_name' => 'Mask', 'category' => 'Protection', 'brand' => 'Generic', 'price' => 80, 'stock' => 1000],
            ['product_name' => 'Sanitizer 100ml', 'generic_name' => 'Alcohol Gel', 'category' => 'Protection', 'brand' => 'Generic', 'price' => 150, 'stock' => 500],
        ];

        foreach ($inventoryData as $item) {
            MedicalInventory::firstOrCreate(
                ['product_name' => $item['product_name']],
                [
                    'generic_name' => $item['generic_name'],
                    'category_id' => $catModels[$item['category']]->id,
                    'brand_id' => $brandModels[$item['brand']]->id,
                    'branch_id' => $branch->id,
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'mrp' => $item['price'] + 10,
                    'discount' => 0,
                    'dosage' => 'As prescribed',
                    'pack_size' => 'Pack of 10',
                    'description' => 'Essential medicine for local health needs.'
                ]
            );
        }

        // 4. Create Test Customers
        $customerNames = ['Ahmed Ali', 'Sarah Khan', 'Zainab Bibi', 'Mustafa Hassan', 'Fatima Sheikh', 'Umar Farooq'];
        $customerList = [];
        foreach ($customerNames as $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';
            $customerList[] = customers::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'username' => str_replace('.', '_', explode('@', $email)[0]),
                    'password' => Hash::make('password'),
                    'phone_number' => '0300' . rand(1000000, 9999999),
                    'address' => 'House ' . rand(1, 100) . ', DHA Phase ' . rand(1, 8) . ', Karachi',
                    'city' => 'Karachi',
                    'gender' => rand(0, 1) ? 'Male' : 'Female',
                    'cnic' => '42101-' . rand(1000000, 9999999) . '-' . rand(1, 9)
                ]
            );
        }

        // 5. Generate Seasonal Orders
        $currentProducts = MedicalInventory::all();
        
        // Scenario A: Winter Flu (Nov - Jan)
        $this->seedOrders($customerList, $currentProducts, '2025-11-15', '2026-01-30', 25, ['Winter', 'General']);

        // Scenario B: Eid-ul-Adha Peaks (Digestive)
        $this->seedOrders($customerList, $currentProducts, '2025-06-10', '2025-06-25', 15, ['Eid', 'General']);

        // Scenario C: Heatwave Peaks (May-June)
        $this->seedOrders($customerList, $currentProducts, '2025-05-01', '2025-06-30', 20, ['Summer', 'General']);
        
        // Scenario D: Today/Recent Activity
        $this->seedOrders($customerList, $currentProducts, Carbon::now()->subDays(2)->toDateString(), Carbon::now()->toDateString(), 10, ['General']);
    }

    private function seedOrders($customers, $products, $startDate, $endDate, $count, $themes)
    {
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        for ($i = 0; $i < $count; $i++) {
            $customer = $customers[array_rand($customers)];
            $orderDate = Carbon::createFromTimestamp(rand($start->timestamp, $end->timestamp));
            
            $order = Order::create([
                'usrer_id' => $customer->id,
                'order_date' => $orderDate,
                'total_amount' => 0,
                'status' => rand(0, 10) > 2 ? 'completed' : 'pending',
                'payment_preference' => rand(0, 1) ? 'Cash' : 'Card',
                'address' => $customer->address,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            $total = 0;
            $itemsCount = rand(1, 4);
            $selectedProducts = $products->random($itemsCount);

            foreach ($selectedProducts as $product) {
                // Bias product selection based on theme
                $bias = 1;
                if (in_array('Winter', $themes) && str_contains($product->product_name, 'CF')) $bias = 5;
                if (in_array('Summer', $themes) && str_contains($product->product_name, 'ORS')) $bias = 5;
                if (in_array('Eid', $themes) && (str_contains($product->product_name, 'Digas') || str_contains($product->product_name, 'Flagyl'))) $bias = 5;

                $qty = rand(1, 2) * $bias;
                $price = $product->price;
                $lineTotal = $qty * $price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $product->id,
                    'qty' => $qty,
                    'price_at_order' => $price,
                    'sub_total' => $lineTotal,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);

                $total += $lineTotal;
            }

            $order->update(['total_amount' => $total]);
        }
    }
}
