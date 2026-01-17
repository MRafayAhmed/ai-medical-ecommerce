@extends('layouts.app')

@section('title','Home')

@section('content')
<h1>All Medicines</h1>
<div class="row">
  <!-- Example card; loop your products from the database -->
  <div class="col-md-3 mb-3">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Paracetamol</h5>
        <p class="card-text">Price: Rs. 120</p>
        <a href="#" class="btn btn-sm btn-primary">Add to cart</a>
      </div>
    </div>
  </div>
</div>
@endsection
