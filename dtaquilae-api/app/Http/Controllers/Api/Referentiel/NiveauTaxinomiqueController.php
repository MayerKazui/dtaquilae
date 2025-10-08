<?php

namespace App\Http\Controllers\Api\Referentiel;

use App\Http\Controllers\Controller;
use App\Models\Referentiel\NiveauTaxinomique;
use App\Http\Requests\StoreNiveauTaxinomiqueRequest;
use App\Http\Requests\UpdateNiveauTaxinomiqueRequest;
use App\Http\Resources\NiveauTaxinomiqueResource;

class NiveauTaxinomiqueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $niveauTax = NiveauTaxinomique::all();
        return NiveauTaxinomiqueResource::collection($niveauTax);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNiveauTaxinomiqueRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(NiveauTaxinomique $niveauTaxinomique)
    {
        return new NiveauTaxinomiqueResource($niveauTaxinomique);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNiveauTaxinomiqueRequest $request, NiveauTaxinomique $niveauTaxinomique)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NiveauTaxinomique $niveauTaxinomique)
    {
        //
    }
}
