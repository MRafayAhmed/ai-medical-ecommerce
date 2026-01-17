@extends('layouts.app')

@section('title','Admin Dashboard')

@section('content')
<h1>Seller Dashboard</h1>

<a href="{{ url('/admin/products') }}" class="btn btn-success mb-3">Manage Products</a>

<!-- quick preview of customer view -->
<a href="{{ url('/home') }}" class="btn btn-outline-secondary mb-3">View as Customer</a>

<div>
  <p>Welcome, {{ auth('seller')->user()->name ?? 'Seller' }}</p>
  <!-- add widgets, counts, etc -->
</div>
@endsection
