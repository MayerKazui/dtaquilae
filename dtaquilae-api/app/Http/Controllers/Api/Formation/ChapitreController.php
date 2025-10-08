<?php

namespace App\Http\Controllers\Api\Formation;

use App\Models\Formation\Chapitre;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChapitreRequest;
use App\Http\Requests\UpdateChapitreRequest;
use App\Http\Resources\Formation\ChapitreResource;

class ChapitreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ChapitreResource::collection(
            Chapitre::query()->whereNotNull('formation_id')->orderBy('titre','asc')->distinct('titre')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChapitreRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Chapitre $chapitre)
    {
        return new ChapitreResource($chapitre);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChapitreRequest $request, Chapitre $chapitre)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chapitre $chapitre)
    {
        //
    }

    public function getSousChapitres($id)
    {
        $chapitres = Chapitre::whereTitre(Chapitre::findOrFail($id)->titre)->select('id')->get();
        $sousChapitres = Chapitre::whereIn('chapitre_sup_id', $chapitres)->orderBy('titre', 'asc')->distinct('titre')->get();

        return ChapitreResource::collection($sousChapitres);
    }

    public function getChapitre($idCours){
        $chapitres = Chapitre::where('cours_id', $idCours)->get();
        return response()-> json($chapitres);
    }
}
