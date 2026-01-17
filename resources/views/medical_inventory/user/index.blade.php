@extends('layouts.app')

@section('title', 'Medical Inventory')

@section('content')
<div class="container mt-5">
    <h1>Medical Inventory (User View)</h1>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Brand Name</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            @foreach($inventories as $inventory)
                <tr>
                    <td>{{ $inventory->brand_name }}</td>
                    <td>{{ $inventory->product_name }}</td>
                    <td>{{ $inventory->price }}</td>
                    <td>{{ $inventory->stock }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
