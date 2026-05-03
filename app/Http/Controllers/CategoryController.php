<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('categories_all', 3600, function () {
            return Category::all();
        });
        return response()->json(['data' => $categories]);
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
            $category = new Category();
            $category->name = $request->name;
            if ($request->hasFile('image')) {
                $category->image = $request->file('image')->store('categories', 'public');
            }
            $category->save();
            \Illuminate\Support\Facades\Cache::forget('categories_all');
            \Illuminate\Support\Facades\Cache::forget('categories_all_dashboard');
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
        $category = Category::find($id);
        return response()->json($category);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::find($id);
            $category->name = $request->name;
            if ($request->hasFile('image')) {
                $category->image = $request->file('image')->store('categories', 'public');
            }
            $category->save();
            \Illuminate\Support\Facades\Cache::forget('categories_all');
            \Illuminate\Support\Facades\Cache::forget('categories_all_dashboard');
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
            $category = Category::find($id);
            $category->delete();
            \Illuminate\Support\Facades\Cache::forget('categories_all');
            \Illuminate\Support\Facades\Cache::forget('categories_all_dashboard');
            return $this->index();
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }
}
