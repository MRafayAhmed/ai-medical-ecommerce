@extends('layout')

@section('content')
<div class="container mt-5">
    <h1>Seller Signup</h1>
    <form method="POST" action="{{ route('seller.signup.store') }}" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" required>
        </div>
        <div class="mb-3">
            <label for="registration_no" class="form-label">Registration No</label>
            <input type="text" class="form-control" id="registration_no" name="registration_no" required>
        </div>
        <div class="mb-3">
            <label for="ntn" class="form-label">NTN</label>
            <input type="text" class="form-control" id="ntn" name="ntn" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" required>
        </div>
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" name="username" required>
        </div>
        <div class="mb-3">
            <label for="phone_no" class="form-label">Phone No</label>
            <input type="text" class="form-control" id="phone_no" name="phone_no" required>
        </div>
        <div class="mb-3">
            <label for="store_address" class="form-label">Store Address</label>
            <input type="text" class="form-control" id="store_address" name="store_address" required>
        </div>
        <div class="mb-3">
            <label for="pharma_license" class="form-label">Pharma License</label>
            <input type="file" class="form-control" id="pharma_license" name="pharma_license" >
        </div>
        <div class="mb-3">
            <label for="owner_cnic_front" class="form-label">Owner CNIC Front</label>
            <input type="file" class="form-control" id="owner_cnic_front" name="owner_cnic_front" >
        </div>
        <div class="mb-3">
            <label for="owner_cnic_back" class="form-label">Owner CNIC Back</label>
            <input type="file" class="form-control" id="owner_cnic_back" name="owner_cnic_back" >
        </div>
        <div class="mb-3">
            <label for="bank_acc_title" class="form-label">Bank Account Title</label>
            <input type="text" class="form-control" id="bank_acc_title" name="bank_acc_title" required>
        </div>
        <div class="mb-3">
            <label for="iban" class="form-label">IBAN</label>
            <input type="text" class="form-control" id="iban" name="iban" required>
        </div>
        <div class="mb-3">
            <label for="bank_name" class="form-label">Bank Name</label>
            <input type="text" class="form-control" id="bank_name" name="bank_name" required>
        </div>
        <div class="mb-3">
            <label for="branch_id" class="form-label">Branch</label>
            <select class="form-control" id="branch_id" name="branch_id" required>
                <option value="" disabled selected>Select a branch</option>
                @foreach($branches as $branch)
                    <option value="{{ $branch->id }}" data-branch-name="{{ $branch->name }}">{{ $branch->name }}</option>
                @endforeach
            </select>
            <!-- <input type="hidden" id="branch_name" name="branch_name"> -->
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password" required>
        </div>
        <div class="mb-3">
            <label for="role" class="form-label">Role</label>
            <select class="form-control" id="role" name="role" required>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="multimanager">Multi Manager</option>
                <option value="admin">Admin</option>
            </select>
            <!-- <input type="text" class="form-control" id="role" name="role" value="seller" readonly> -->
        </div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
    </form>
</div>

<script>
    document.getElementById('branch_id').addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        document.getElementById('branch_name').value = selectedOption.getAttribute('data-branch-name');
    });
</script>
@endsection
