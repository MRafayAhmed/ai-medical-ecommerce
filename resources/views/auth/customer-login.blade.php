@extends('layouts.app')

@section('title','Customer Login')

@section('content')
<div class="row justify-content-center">
  <div class="col-md-6">
    <h3>Customer Login</h3>

    @if($errors->any())
      <div class="alert alert-danger">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="/customer/login">
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
      <input type="checkbox" name="remember" class="form-check-input" id="remember">
      <label class="form-check-label" for="remember">Remember me</label>
      </div>
      <button class="btn btn-primary">Login</button>
    </form>

    <!-- Ensure Bootstrap CSS and JS are included -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  </div>
</div>
@endsection
