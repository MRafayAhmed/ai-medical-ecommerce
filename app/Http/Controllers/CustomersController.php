<?php

namespace App\Http\Controllers;

use App\Models\customers;
use Illuminate\Http\Request;

class CustomersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = customers::all();
        return response()->json($customers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $customers = new customers();
            $customers->name = $request->name;
            $customers->gender = $request->gender;
            // dd($request->all());
            $customers->date_of_birth = $request->date_of_birth;
            $customers->cnic = $request->cnic;
            $customers->address = $request->address;
            $customers->city = $request->city;
            $customers->email = $request->email;
            $customers->username = $request->username;
            $customers->phone_number = $request->phone_number;
            $customers->postal_code = filled($request->postal_code) ? $request->postal_code : "";
            $customers->password = bcrypt($request->input('password'));
            $customers->save();
            return response()->json(['message' => 'Customer created successfully', 'data' => $customers], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to create customer', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $customer = customers::find($id);
        return $customer;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $customers = customers::find($id);
            if (!$customers) return response()->json(['message' => 'Customer not found'], 404);

            $customers->name = $request->name;
            $customers->gender = $request->gender;
            $customers->date_of_birth = $request->date_of_birth;
            $customers->cnic = $request->cnic;
            $customers->address = $request->address;
            $customers->city = $request->city;
            $customers->email = $request->email;
            $customers->username = $request->username;
            $customers->phone_number = $request->phone_number;
            $customers->postal_code = filled($request->postal_code) ? $request->postal_code : "";
            
            if ($request->filled('password')) {
                $customers->password = bcrypt($request->input('password'));
            }
            
            $customers->save();
            return response()->json(['message' => 'Customer updated successfully', 'data' => $customers]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to update customer', 'error' => $th->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $customer = customers::find($id);
            if ($customer) {
                $customer->delete();
                return response()->json(['message' => 'Customer deleted successfully']);
            }
            return response()->json(['message' => 'Customer not found'], 404);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Failed to delete customer', 'error' => $th->getMessage()], 500);
        }
    }
}
