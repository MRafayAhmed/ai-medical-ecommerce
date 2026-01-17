@extends('layouts.app')

@section('content')
<div class="text-center">
    <h2>Choose Login</h2>
    <a class="btn btn-primary m-2" href="{{ route('customer.login') }}">Customer Login</a>
    <a class="btn btn-secondary m-2" href="{{ route('seller.login') }}">Seller Login</a>
</div>
@endsection
