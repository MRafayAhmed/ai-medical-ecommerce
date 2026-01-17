<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

class HomeController extends Controller
{
	public function __construct()
	{
    	$this->middleware(function ($request, $next) {
        	$response = $next($request);
        	return $response->header('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
            	            ->header('Pragma', 'no-cache')
        	                ->header('Expires', 'Sat, 01 Jan 1990 00:00:00 GMT');
    	});
	}
	public function index()
	{
		return view('home');
	}
}
