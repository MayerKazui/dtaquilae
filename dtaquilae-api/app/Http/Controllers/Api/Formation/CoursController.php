<?php

namespace App\Http\Controllers\Api\Formation;

use App\Models\Formation\Cours;
use App\Models\Formation\Chapitre;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCoursRequest;
use App\Http\Requests\UpdateCoursRequest;
use App\Http\Resources\Formation\CoursResource;

class CoursController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CoursResource::collection(
            Cours::query()->orderBy('id', 'asc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCoursRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Cours $cours)
    {
        return new CoursResource($cours);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCoursRequest $request, Cours $cours)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cours $cours)
    {
        //
    }
    public function getSousChapitres($id)
    {
        //$id = id du sous chapitre selectionne
        $sousChapitres = Chapitre::whereTitre(Chapitre::find($id)->titre)->select('id')->get();

        $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres)->orderBy('libelle', 'asc')->distinct('libelle')->get();

        return CoursResource::collection($cours);
    }

    public function getCours($libelle_cours)
    {
        //$id = id du sous chapitre selectionne
        $cours_recherche = Cours::whereLibelle(Cours::find($libelle_cours)->libelle_cours)->select('libelle_cours')->get();

        $cours = Cours::whereIn('libelle_cours', $libelle_cours)->orderBy('libelle', 'asc')->distinct('libelle')->get();

        return CoursResource::collection($cours);
    }

    public static function getAtas()
    {
        return response(Cours::all()->pluck('ata')->map(function ($ata) {
            if (str_contains($ata, "\n")) {
                return explode("\n", $ata);
            }
            return $ata;
        })->flatten()->unique()->toJson());
    }
}
