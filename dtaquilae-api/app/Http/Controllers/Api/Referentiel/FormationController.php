<?php

namespace App\Http\Controllers\Api\Referentiel;

use App\Http\Controllers\Controller;
use App\Models\Referentiel\Formation;
use App\Http\Requests\StoreFormationRequest;
use App\Http\Requests\UpdateFormationRequest;
use App\Http\Resources\Formation\FormationResource;

class FormationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return FormationResource::collection(Formation::query()->orderBy('id', 'asc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFormationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormationRequest $request, Formation $formation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation)
    {
        //
    }
}
