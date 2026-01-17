@extends('layouts.app')

@section('title', 'Add Medical Inventory')

@section('content')
<div class="container mt-5">
    <h1>Add New Medical Inventory</h1>
    <form method="POST" action="{{ route('medical-inventory.store') }}">
        @csrf
        <div class="mb-3">
            <label for="branch_id" class="form-label">Branch</label>
            <select class="form-control" id="branch_id" name="branch_id" required>
                <option value="" disabled selected>Select a branch</option>
                @foreach($branches as $branch)
                    <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label for="category_id" class="form-label">Category</label>
            <select class="form-control" id="category_id" name="category_id" required>
                <option value="" disabled selected>Select a category</option>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label for="brand_id" class="form-label">Brand</label>
            <select class="form-control" id="brand_id" name="brand_id" required>
                <option value="" disabled selected>Select a brand</option>
                @foreach($brands as $brand)
                    <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="mb-3">
            <label for="product_name" class="form-label">Product Name</label>
            <input type="text" class="form-control" id="product_name" name="product_name" required>
        </div>
        <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input type="number" step="0.01" class="form-control" id="price" name="price" required>
        </div>
        <div class="mb-3">
            <label for="discount" class="form-label">Discount</label>
            <input type="number" step="0.01" class="form-control" id="discount" name="discount">
        </div>
        <div class="mb-3">
            <label for="generic_name" class="form-label">Generic Name</label>
            <input type="text" class="form-control" id="generic_name" name="generic_name">
        </div>
        <div class="mb-3">
            <label for="dosage" class="form-label">Dosage</label>
            <input type="text" class="form-control" id="dosage" name="dosage">
        </div>
        <div class="mb-3">
            <label for="pack_size" class="form-label">Pack Size</label>
            <input type="text" class="form-control" id="pack_size" name="pack_size">
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label for="mrp" class="form-label">MRP</label>
            <input type="number" step="0.01" class="form-control" id="mrp" name="mrp" required>
        </div>
        <div class="mb-3">
            <label for="stock" class="form-label">Stock</label>
            <input type="number" class="form-control" id="stock" name="stock" required>
        </div>
        <button type="submit" class="btn btn-primary">Add Product</button>
    </form>
</div>
@endsection
