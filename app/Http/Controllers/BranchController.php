<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $branches = Branch::paginate(10);
        return response()->json($branches);
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
            $branch = new Branch();
            $branch->name = $request->name;
            $branch->address = $request->address;
            $branch->phone_number = $request->phone_number;
            $branch->save();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $branch = Branch::find($id);
        return response()->json($branch);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Branch $branch)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $branch = Branch::find($id);
            $branch->name = $request->name;
            $branch->address = $request->address;
            $branch->phone_number = $request->phone_number;
            $branch->save();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $branch = Branch::find($id);
            $branch->delete();
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }
}
