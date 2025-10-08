<?php

namespace App\Http\Controllers\Api\Referentiel;

use App\Http\Controllers\Controller;
use App\Models\Referentiel\Statut;
use App\Http\Requests\StoreStatutRequest;
use App\Http\Requests\UpdateStatutRequest;

class StatutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStatutRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Statut $statut)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStatutRequest $request, Statut $statut)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Statut $statut)
    {
        //
    }
}
