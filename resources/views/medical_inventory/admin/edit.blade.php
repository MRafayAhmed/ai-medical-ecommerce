@extends('layouts.app')

@section('title', 'Edit Medical Inventory')

@section('content')
<div class="container mt-5">
    <h1>Edit Medical Inventory</h1>

    <form method="POST" action="{{ route('medical-inventory.update', $inventory->id) }}">
        @csrf
        @method('PUT')

        <div class="mb-3">
            <label for="branch_id" class="form-label">Branch</label>
            <select class="form-control" id="branch_id" name="branch_id" required>
                @foreach($branches as $branch)
                    <option value="{{ $branch->id }}" {{ $inventory->branch_id == $branch->id ? 'selected' : '' }}>
                        {{ $branch->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="category_id" class="form-label">Category</label>
            <select class="form-control" id="category_id" name="category_id" required>
                @foreach($categories as $category)
                    <option value="{{ $category->id }}" {{ $inventory->category_id == $category->id ? 'selected' : '' }}>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="brand_id" class="form-label">Brand</label>
            <select class="form-control" id="brand_id" name="brand_id" required>
                @foreach($brands as $brand)
                    <option value="{{ $brand->id }}" {{ $inventory->brand_id == $brand->id ? 'selected' : '' }}>
                        {{ $brand->name }}
                    </option>
                @endforeach
            </select>
        </div>

        <div class="mb-3">
            <label for="product_name" class="form-label">Product Name</label>
            <input type="text" class="form-control" id="product_name" name="product_name"
                   value="{{ $inventory->product_name }}" required>
        </div>

        <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input type="number" step="0.01" class="form-control" id="price" name="price"
                   value="{{ $inventory->price }}" required>
        </div>

        <div class="mb-3">
            <label for="discount" class="form-label">Discount</label>
            <input type="number" step="0.01" class="form-control" id="discount" name="discount"
                   value="{{ $inventory->discount }}">
        </div>

        <div class="mb-3">
            <label for="stock" class="form-label">Stock</label>
            <input type="number" class="form-control" id="stock" name="stock"
                   value="{{ $inventory->stock }}" required>
        </div>

        <button type="submit" class="btn btn-success">Update</button>
        <a href="{{ route('medical-inventory.index') }}" class="btn btn-secondary">Cancel</a>
    </form>
</div>
@endsection
