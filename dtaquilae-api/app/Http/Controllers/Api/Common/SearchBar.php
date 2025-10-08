<?php

namespace App\Http\Controllers\Api\Common;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Referentiel\Role;
use App\Models\Referentiel\Grade;
use Illuminate\Http\JsonResponse;
use App\Models\Referentiel\Statut;
use Illuminate\Support\Facades\DB;
use App\Models\Evaluation\Question;
use Illuminate\Support\Facades\Log;
use App\Helpers\AccessControlHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use App\Http\Resources\Evaluation\QuestionResource;
use App\Http\Resources\Evaluation\TestResource;
use App\Models\Evaluation\Test;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\JsonResponse as HttpFoundationJsonResponse;

class SearchBar extends Controller
{

    protected $query;

    /**
     * Méthode principale retournant la liste des objets correspondant à la recherche
     *
     * @param Request $request - La requête HTTP contenant la payload
     * @return AnonymousResourceCollection|HttpFoundationJsonResponse La liste des objets | Erreur 500
     */
    public function getItems(Request $request): AnonymousResourceCollection|HttpFoundationJsonResponse
    {
        $this->constructQuery($request);
        return $this->getModelResources($request);
    }

    /**
     * Construction de la requête prenant en compte le nom de la table, les colonnes
     *
     * @param Request $request - La requête HTTP contenant la payload
     */
    private function constructQuery($request): void
    {
        $search = Str::of($request->search)->lower()->value();
        $this->query = DB::table($request->table);
        foreach ($request->columns as $key => $column) {
            if ($key == 0) {
                if($column === "niveau"){
                    $tmpValue = intval($search);
                    $this->query->whereRaw("{$column} = {$tmpValue}");
                } else {
                    $this->query->whereRaw("LOWER({$column}) LIKE '%{$search}%'");
                }
            } else {
                if($column === "niveau"){
                    $tmpValue = intval($search);
                    $this->query->orWhereRaw("{$column} = {$tmpValue}");
                } else {
                    $this->query->orWhereRaw("LOWER({$column}) LIKE '%{$search}%'");
                }
            }
        }
    }

    /**
     * Retourne la bonne ressource en fonction du nom de la table (si erreur, retour d'une erreur 500)
     *
     * @param Request $request - La requête HTTP contenant la payload
     * @return AnonymousResourceCollection|JsonResponse La ressource associée | Erreur 500
     */
    private function getModelResources($request): AnonymousResourceCollection|JsonResponse
    {
        switch ($request->table) {
            case 'users':
                return $this->getUsers($request);
                break;
            case 'questions':
                $access = AccessControlHelper::check('question.search');
                abort_if($access->denied(),$access->code(),$access->message());
                return $this->getQuestions($request);
                break;
                case 'tests':
                    $access = AccessControlHelper::check('test.search');
                    abort_if($access->denied(),$access->code(),$access->message());
                    return $this->getTests($request);
                    break;
            default:
                return response()->json(['message' => 'La table ' . $request->table . ' n\'existe pas.'], 500);
        }
    }

    /**
     * Retourne la ressource concernant les utilisateurs.
     * @param Request $request - La requête HTTP contenant la payload
     * @return AnonymousResourceCollection La liste des utilisateurs concernés
     */
    private function getUsers($request): AnonymousResourceCollection
    {
        $search = Str::of($request->search)->lower()->value();
        foreach ($request->columnsForeign as $column) {
            switch($column) {
                case "grade_id":
                    $this->query->orWhereIn($column, Grade::whereRaw("LOWER(libelle) LIKE '%{$search}%'")->pluck('id')->toArray());
                    break;
                case "role_id":
                    $this->query->orWhereIn($column, Role::whereRaw("LOWER(libelle) LIKE '%{$search}%'")->pluck('id')->toArray());
                    break;
            }
        }

        return UserResource::collection(
            User::fromSub($this->query->orderBy('id', 'asc'), User::make()->getTable())->whereActif($request->activeBoolean)->distinct()->get()
        );
    }

    /**
     * Retourne la ressource concernant les questions.
     * @param Request $request - La requête HTTP contenant la payload
     * @return AnonymousResourceCollection La liste des questions concernées
     */
    private function getQuestions($request): AnonymousResourceCollection
    {
        $search = Str::of($request->search)->lower()->value();
        foreach ($request->columnsForeign as $column) {
            switch($column) {
                case "statut_id":
                    $this->query->orWhereIn($column, Statut::whereRaw("LOWER(libelle) LIKE '%{$search}%'")->pluck('id')->toArray());
                    break;
            }
        }

        return QuestionResource::collection(
            Question::fromSub($this->query->orderBy('id', 'asc'), Question::make()->getTable())->whereActif($request->activeBoolean)->distinct()->get()
        );
    }
    private function getTests($request): AnonymousResourceCollection
    {
        $search = Str::of($request->search)->lower()->value();
        foreach ($request->columnsForeign as $column) {
            switch($column) {
                case "statut_id":
                    $this->query->orWhereIn($column, Statut::whereRaw("LOWER(libelle) LIKE '%{$search}%'")->pluck('id')->toArray());
                    break;
            }
        }

        return TestResource::collection(
            Test::fromSub($this->query->orderBy('id', 'asc'), Test::make()->getTable())->get()
        );
    }
}
