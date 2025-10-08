<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Http\Controllers\Controller;
use App\Models\Evaluation\Question;
use App\Models\Evaluation\Ressource;
use App\Http\Requests\StoreRessourceRequest;
use App\Http\Requests\UpdateRessourceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RessourceController extends Controller
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
    public function store(StoreRessourceRequest $request)
    {
        $request->validated();
        if ($request->has("images")) {
            $question = Question::find($request->get('idQuestion'));
            foreach ($request->file('images') as $image) {
                $fileName = str_replace('.', '-', uniqid('img', true)) . $image->getClientOriginalName();
                $image->move(storage_path('resources'), $fileName);
                $ressource = Ressource::create(["nom" => $fileName]);
                $question->ressources()->attach($ressource);
            }
            return response('stockage');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $imageName)
    {
        Storage::disk('ressources')->delete($imageName);
        $ressource = Ressource::whereNom($imageName)->first();
        $ressource->questions()->detach();
        $ressource->delete();
        return response(200);
    }

    public function getUrls(int $idQuestion): array
    {
        $question = Question::find($idQuestion);
        $arrayRessourcesUrls = [];
        $storage = Storage::disk('ressources');
        if ($question->ressources->count() > 0) {
            $question->ressources->each(function ($ressource) use (&$arrayRessourcesUrls, $storage) {
                array_push($arrayRessourcesUrls, $storage->temporaryUrl($ressource->nom, now()->addMinutes(10)));
            });
        }
        return $arrayRessourcesUrls;
    }

    public function download(Request $request): StreamedResponse
    {
        abort_if(!$request->hasValidSignature(), 404);
        $storage = Storage::disk('ressources');
        $retour = null;
        try {
            $retour = $storage->download($request->query('path'));
        } catch (\Exception $e) {
            abort(404, 'Aucun fichier n\'existe avec ce nom');
        }
        return $retour;
    }
    /**
     * Display the specified resource.
     */
    public function show(Ressource $ressource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRessourceRequest $request, Ressource $ressource)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ressource $ressource)
    {
        //
    }

}
