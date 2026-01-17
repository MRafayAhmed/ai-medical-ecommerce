<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Branch;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Seller::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $branches = Branch::all(); // Fetch all branches from the database
        return view('auth.seller-signup', compact('branches'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $seller = new Seller();
        $seller->name = $request->name; 
        $seller->registration_no = $request->registration_no;
        $seller->ntn = $request->ntn;
        $seller->email = $request->email;
        $seller->username = $request->username;
        $seller->store_address = $request->store_address;
        $seller->phone_no = $request->phone_no;
        $seller->password = Hash::make($request->password);
        $seller->branch_id = $request->branch_id;
        $seller->pharma_license = $request->file('pharma_license') ? $request->file('pharma_license')->store('licenses', 'public') : ($request->pharma_license ?? "");
        $seller->owner_cnic_front = $request->file('owner_cnic_front') ? $request->file('owner_cnic_front')->store('cnic_fronts', 'public') : ($request->owner_cnic_front ?? "");
        $seller->owner_cnic_back = $request->file('owner_cnic_back') ? $request->file('owner_cnic_back')->store('cnic_backs', 'public') : ($request->owner_cnic_back ?? "");
        $seller->bank_acc_title = $request->bank_acc_title;
        $seller->iban = $request->iban;
        $seller->bank_name = $request->bank_name;
        $seller->role = $request->role;

        $seller->save();

        if ($request->wantsJson()) {
            return response()->json($seller, 201);
        }

        return redirect('/')->with('success', 'Seller created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $seller = Seller::find($id);
        return response()->json($seller);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Seller $seller)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $seller = Seller::find($id);
        if (!$seller) return response()->json(['message' => 'Seller not found'], 404);

        $seller->name = $request->name; 
        $seller->registration_no = $request->registration_no;
        $seller->ntn = $request->ntn;
        $seller->email = $request->email;
        $seller->username = $request->username;
        $seller->store_address = $request->store_address;
        $seller->phone_no = $request->phone_no;
        if ($request->filled('password')) {
            $seller->password = Hash::make($request->password);
        }
        $seller->branch_id = $request->branch_id;
        $seller->bank_acc_title = $request->bank_acc_title;
        $seller->iban = $request->iban;
        $seller->bank_name = $request->bank_name;
        $seller->role = $request->role;

        $seller->save();

        return response()->json($seller);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $seller = Seller::find($id);
        if ($seller) {
            $seller->delete();
            return response()->json(['message' => 'Seller deleted successfully']);
        }
        return response()->json(['message' => 'Seller not found'], 404);
    }
}
