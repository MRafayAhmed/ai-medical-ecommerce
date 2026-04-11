<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseInvoice;
use App\Models\PurchaseInvoiceDetail;
use App\Models\StockLedger;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseInvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = PurchaseInvoice::with('details.item')->latest()->get();
        return response()->json($invoices);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function getnumber(){
        $latest_nummber = PurchaseInvoice::latest()->first();
        if($latest_nummber){
            $last_number = $latest_nummber->document_no;
            $new_number = $last_number + 1;
        }else{
            $new_number = 1;
        }
        $formattedNumber = str_pad($new_number, 4, '0', STR_PAD_LEFT);
        return [$new_number , 'PI-'.$formattedNumber ];
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $purchase_invocie = new PurchaseInvoice();
        $document_no = $this->getnumber();
        $purchase_invocie->document_no = $document_no[0];
        $purchase_invocie->document_identity = $document_no[1];
        $purchase_invocie->branch_id = isset($request->branch_id) ? $request->branch_id : 1;
        $purchase_invocie->document_date = Carbon::parse($request->document_date)->format('Y-m-d');
        $purchase_invocie->total_amount = isset($request->total_amount) ? $request->total_amount : 0;
        $purchase_invocie->save();
        if($request->items){
            $this->storedetails($request->items , $purchase_invocie->id);
        }
        return $this->index();        
    }

    public function storedetails($items , $purchase_invocie_id){
        $data = [];
        foreach($items as $item){
            $data[] = [
                'purchase_invoice_id' => $purchase_invocie_id,
                'item_id' => $item['item_id'],
                'qty' => $item['qty'],
                'rate' => $item['rate'],
                'amount' => $item['amount'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        PurchaseInvoiceDetail::insert($data);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $purchase_invocie = PurchaseInvoice::with('details')->find($id);
        return response()->json($purchase_invocie);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseInvoice $purchaseInvoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $purchase_invocie = PurchaseInvoice::find($id);
        $purchase_invocie->branch_id = isset($request->branch_id) ? $request->branch_id : 1;
        $purchase_invocie->document_date = Carbon::parse($request->document_date)->format('Y-m-d');
        $purchase_invocie->total_amount = isset($request->total_amount) ? $request->total_amount : 0;
        $purchase_invocie->save();
        PurchaseInvoiceDetail::where('purchase_invoice_id' , $purchase_invocie->id)->delete();
        if($request->items){
            $this->storedetails($request->items , $purchase_invocie->id);
        }
        return $this->index();        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $purchase_invocie = PurchaseInvoice::find($id);
        $purchase_invocie->delete();
        PurchaseInvoiceDetail::where('purchase_invoice_id' , $id)->delete();
        return $this->index();        
    }
    
    public function markispost($id){
        try {
            DB::beginTransaction();
            $purchase_invocie = PurchaseInvoice::findOrFail($id);
            $purchase_invocie->is_post = 1;
            $purchase_invocie->save();
            
            $purchase_invocie_details = PurchaseInvoiceDetail::where('purchase_invoice_id' , $id)->get();
            $data = [];
            foreach($purchase_invocie_details as $detail){
                $data[] = [
                    'ref_id' => $id,
                    'ref_document_identity' => $purchase_invocie->document_identity,
                    'item_id' => $detail->item_id,
                    'qty' => $detail->qty,
                    'base_qty' => $detail->qty,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
            
            if (count($data) > 0) {
                StockLedger::insert($data);
            }
            
            DB::commit();
            return $this->index();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to post invoice: ' . $e->getMessage()], 500);
        }
    }
}
