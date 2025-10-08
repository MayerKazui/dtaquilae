<?php

namespace App\Http\Controllers\Api\Formation;

use App\Models\User;
use App\Models\Evaluation\Test;
use App\Models\Formation\Stage;
use App\Models\Referentiel\Role;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use App\Http\Resources\StageResource;
use App\Http\Requests\StoreStageRequest;
use App\Http\Requests\UpdateStageRequest;
use App\Http\Resources\Users\UserResource;
use App\Http\Requests\StageDateControlRequest;
use App\Http\Resources\Users\UserStageConsultationResource;

class StageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StageResource::collection(
            Stage::query()->orderBy('id', 'asc')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStageRequest $request)
    {
        $data = $request->validated();
        // Créer le stage
        $stage = Stage::create($data);
        // Associer des stagiaires au stage en utilisant la méthode attach
        $stage->stagiaires()->attach(array_column($data['stagiaires'], 'id'));

        return response(["idStage" => $stage->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Stage $stage)
    {
        return new StageResource($stage);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStageRequest $request, Stage $stage)
    {
        $data = $request->validated();

        // Mettre à jour les données de base du stage
        $stage->update($data);

        // Vérifier les stagiaires à synchroniser
        if (isset($data['stagiaires'])) {
            $nouveauxStagiairesIds = array_column($data['stagiaires'], 'id');
            $anciensStagiairesIds = $stage->stagiaires()->pluck('stage_stagiaire.user_id')->toArray();

            // Identifier les stagiaires supprimés
            $stagiairesSupprimesIds = array_diff($anciensStagiairesIds, $nouveauxStagiairesIds);

            // Supprimer les tests des stagiaires supprimés qui ne sont pas terminés
            if (!empty($stagiairesSupprimesIds)) {
                DB::transaction(function () use ($stagiairesSupprimesIds) {
                    foreach ($stagiairesSupprimesIds as $stagiaireId) {
                        // Supprimer les tests non terminés associés au stagiaire
                        Test::where('user_id', $stagiaireId)
                            ->where('is_finish', false)
                            ->delete();
                    }
                });
            }

            // Synchroniser les stagiaires avec le stage
            $stage->stagiaires()->sync($nouveauxStagiairesIds);
        }

        return response(new StageResource($stage), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stage $stage)
    { {
            // Vérifier si des tests ont été passés par les stagiaires pendant la période de stage
            $testsCount = Test::whereIn('user_id', $stage->stagiaires->pluck('id'))
                ->whereBetween('date', [$stage->debut, $stage->fin])
                ->count();

            if ($testsCount > 0) {
                return response('Impossible de supprimer le stage. Des tests ont été passés pendant la période de stage.', 403);
            }

            // Supprimer le stage
            // Détacher tous les stagiaires associés au stage
            $stage->stagiaires()->detach();

            // Supprimer le stage
            $stage->delete();


            return response('Le stage a été supprimé avec succès.', 200);
        }


    }

    /**
     * Recupere tous les satagiaire que ne son pas en stage entre les date donnée
     */
    static function stagiairesSansStageEntreDates($debut, $fin)
    {

        $startDate = $debut;
        $endDate = $fin;

        $stagiairesSansStage = User::where('role_id', 1)->where('actif', true)
            ->whereDoesntHave('stages', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('debut', [$startDate, $endDate])
                    ->orWhereBetween('fin', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('debut', '<=', $startDate)
                            ->where('fin', '>=', $endDate);
                    });
            })
            ->get();
        return UserStageConsultationResource::collection($stagiairesSansStage);
    }

    /**
     * recupere tous les direteur de stage qui ne son pas en stage au date proposées
     */
    static function directeurSansStageEntreDates($debut, $fin, $id = null)
    {
        $startDate = $debut;
        $endDate = $fin;

        $directeurSansStageQuery = User::whereIn('role_id', [2, 5])
            ->where('actif', true)
            ->whereDoesntHave('stageDirecteur', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('debut', [$startDate, $endDate])
                    ->orWhereBetween('fin', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('debut', '<=', $startDate)
                            ->where('fin', '>=', $endDate);
                    });
            })
            ->whereDoesntHave('stageAdjoint', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('debut', [$startDate, $endDate])
                    ->orWhereBetween('fin', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('debut', '<=', $startDate)
                            ->where('fin', '>=', $endDate);
                    });
            });

        if (!is_null($id)) {
            $directeurSansStageQuery->orWhere('id', $id);
        }

        $directeurs = $directeurSansStageQuery->get();

        return UserResource::collection($directeurs);
    }

    /**
     *
     */
    static function adjointSansStageEntreDates($debut, $fin, $id = null)
    {

        $startDate = $debut;
        $endDate = $fin;

        $adjointSansStageQuery = User::where('role_id', 2)->where('actif', true)
            ->whereDoesntHave('stageAdjoint', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('debut', [$startDate, $endDate])
                    ->orWhereBetween('fin', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('debut', '<=', $startDate)
                            ->where('fin', '>=', $endDate);
                    });
            })
            ->whereDoesntHave('stageDirecteur', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('debut', [$startDate, $endDate])
                    ->orWhereBetween('fin', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('debut', '<=', $startDate)
                            ->where('fin', '>=', $endDate);
                    });
            });
        if ($id !== 'null') {
            $adjointSansStageQuery->orWhere('id', $id);
        }
        $adjoints = $adjointSansStageQuery->get();
        return UserResource::collection($adjoints);
    }

    /**
     * Récupère tous les stages déjà terminés.
     */
    public function stagesTerminer()
    {
        $today = now()->toDateString(); // Obtient la date du jour

        return StageResource::collection(
            Stage::whereDate('fin', '<', $today) // Date de fin antérieure à la date d'aujourd'hui
                ->orderBy('fin', 'desc') // Trie par ordre de fin décroissante
                ->get()
        );
    }

    /**
     * Récupère tous les stages à venir.
     */
    public function stagesAVenir()
    {
        $today = now()->toDateString(); // Obtient la date du jour

        return StageResource::collection(
            Stage::whereDate('debut', '>', $today) // Date de début postérieure à la date d'aujourd'hui
                ->orderBy('debut', 'asc')
                ->get()
        );
    }

    /**
     * Récupère tous les stages en cours.
     */
    public function stagesEnCours()
    {
        $today = now()->toDateString(); // Obtient la date du jour

        return StageResource::collection(
            Stage::whereDate('debut', '<=', $today) // Date de début inférieure ou égale à la date d'aujourd'hui
                ->whereDate('fin', '>=', $today) // Date de fin supérieure ou égale à la date d'aujourd'hui
                ->orderBy('id', 'asc')
                ->get()
        );
    }

}
