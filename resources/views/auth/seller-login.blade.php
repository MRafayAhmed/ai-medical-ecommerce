@extends('layouts.app')

@section('title','Seller Login')

@section('content')
<div class="row justify-content-center">
  <div class="col-md-6">
    <h3>Seller Login</h3>

    @if($errors->any())
      <div class="alert alert-danger">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="/seller/login">
      @csrf
      <div class="mb-3">
        <label>Email</label>
        <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
      </div>
      <div class="mb-3">
        <label>Password</label>
        <input type="password" name="password" class="form-control" required>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" name="remember" class="form-check-input" id="remember2">
        <label class="form-check-label" for="remember2">Remember me</label>
      </div>
      <button class="btn btn-secondary">Login</button>
    </form>
  </div>
</div>
@endsection
