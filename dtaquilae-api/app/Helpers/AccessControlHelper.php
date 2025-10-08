<?php

namespace App\Helpers;

use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Auth;

class AccessControlHelper
{
    private const ACCESSES = [
        'CDFRE' => [
            'user' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'stage' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'questionnaire' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'question' => ['search' => true, 'consult' => true, 'update' => true, 'validate' => true, 'delete' => true],
            'test' => ['export' => true, 'search' => true, 'consult' => true, 'edit' => true, 'conforme' => true],
        ],
        'ADM' => [
            'user' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'stage' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'questionnaire' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'question' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'verify' => true, 'delete' => true],
            'test' => ['create' => true, 'export' => true, 'edit' => true, 'delete' => true, 'search' => true, 'conforme' => true],
            'ressources' => ['create' => true, 'edit' => true, 'delete' => true, 'search' => true]
        ],
        'IEC' => [
            'user' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'stage' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true],
            'questionnaire' => [],
            'question' => ['create' => true, 'search' => true, 'consult' => true],
            'test' => ['edit' => true, 'export' => true],
        ],
        'PGS' => [
            'user' => ['create' => true, 'search' => true, 'consult' => true, 'update' => true, 'delete' => true],
            'stage' => ['search' => true, 'consult' => true],
            'questionnaire' => [],
            'question' => [],
            'test' => ['edit' => true, 'export' => true],
        ],
        'STA' => [
            'user' => [],
            'stage' => [],
            'questionnaire' => ['consult' => true],
            'question' => [],
            'test' => ['pass' => true],
        ],
    ];

    /**
     * Vérifie la présence de la/des permission(s) en paramètre.
     * Utilisation :
     *  - Dans controller : AccessControlHelper::check('domaine.action')
     *  - En tant que middleware : Route::(....)->middleware('access.control:domaine.action1,domaine.action2')
     *
     * @param mixed $permissions - Dans un controller : un string stipulant le domaine et l'action, dans un middleware un string stipulant les domaines et actions séparées par une virgule
     * @return Illuminate\Auth\Access\Response - L'autorisation si la permission est présente, sinon une erreur 403 (Forbidden)
     */
    public static function check(...$permissions): Response
    {
        //Transformation du paramètre en Illuminate\Support\Collection
        $permissions = collect($permissions);
        $user = Auth::user();
        $retour = false;
        // Vérification de la présence pour chaque permission
        $permissions->each(function ($permission) use (&$retour, $user) {
            $permissionArray = explode('.', $permission);
            $retour = isset (self::ACCESSES[$user->role->abrege][$permissionArray[0]][$permissionArray[1]]) ? true : false;
            return !$retour;
        });
        return $retour ? Response::allow() : Response::deny('Vous n\'êtes pas autorisé à effectuer cette action', 403);
    }
}
