<?php

namespace App\Http\Controllers\Api;

use App\Helpers\AccessControlHelper;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\Users\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Log;

class UserController extends Controller
{
    /**
     * Affiche les utilisateurs
     */
    public function index()
    {
        AccessControlHelper::check('user.search')->authorize();
        return UserResource::collection(User::query()->orderBy('id', 'asc')->get());
    }

    /**
     * Ajoute un nouvel utilisateur
     */
    public function store(StoreUserRequest $request)
    {
        //verification request
        $data = $request->validated();
        User::create($data);
        return response('Succès', 201);
    }

    /**
     * Affiche un utilisateur
     */
    public function show(User $user)
    {
        AccessControlHelper::check('user.consult')->authorize();
        return new UserResource($user);
    }

    /**
     * Met à jour l'utilisateur
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        AccessControlHelper::check('user.update')->authorize();
        $data = $request->validated();
        $user->update($data);
        return new UserResource($user);
    }

    /**
     * Supprime un utilisateur
     */
    public function destroy(User $user)
    {
        AccessControlHelper::check('user.delete')->authorize();
        $user->update(['actif' => false]);
        return response("", 204);
    }


    /**
     * Active un utilisateur qui a été archivé
     */
    public function active(string $id)
    {
        $user = User::find($id);
        $user->update(['actif' => true]);

        return response("", 204);
    }


    /**
     * Retourne tous les utilisateurs pour l'export
     */
    public function export()
    {
        return UserResource::collection(User::query()->orderBy('id', 'asc')->get());
    }
    /**
     * Retourne tous les utilisateurs actif ou inactif (supprimer)
     */
    public function usersActif(bool $isActif)
    {
        $users = User::whereActif($isActif)->orderBy('id', 'asc')->get();
        return UserResource::collection($users);
    }
    /**
     * Permet de créer le login. Si le login existe déjà, de la même manière que sur intradef,
     * un nombre est incrémenté derrière le prénom.
     * @param string $firstName Le nom du nouvel utilisateur
     * @param string $lastName Le prénom du nouvel utilisateur
     * @param string $id id utilisateur
     * @return string $login Le login du nouvel utilisateur au format prenom.nom
     *
     */
    public function implementeLogin($firstName, $lastName, $id = null)
    {
        $nom = strtolower(self::callReplaceTable($firstName));
        $prenom = strtolower(self::callReplaceTable($lastName));
        $login = $prenom . '.' . $nom;
        $login = strtr($login, [' ' => '-']);
        if (strpos($login, '-') + 1 == strlen($login))
            $login = substr($login, 0, -1);
        $incremente = 0;
        if (!is_null($id)) {
            while (!is_null(User::where('id', '!=', $id)->whereLogin($login)->first())) {
                ++$incremente;
                $login = $prenom . $incremente . '.' . $nom;
            }
        } else {
            while (!is_null(User::whereLogin($login)->first())) {
                ++$incremente;
                $login = $prenom . $incremente . '.' . $nom;
            }
        }
        return is_null($id) ? response(strtolower($login), 200) : strtolower($login);
    }
    /**
     * Méthode permettant de remplacer les caractères accentués d'une chaîne de caractère par l'équivalent en caractère plat.
     *
     * @param string (type) $initial
     * @return string (type)
     */
    private function callReplaceTable($initial)
    {
        $TB_CONVERT = array(
            'Š' => 'S',
            'š' => 's',
            'Ð' => 'Dj',
            'Ž' => 'Z',
            'ž' => 'z',
            'À' => 'A',
            'Á' => 'A',
            'Â' => 'A',
            'Ã' => 'A',
            'Ä' => 'A',
            'Å' => 'A',
            'Æ' => 'A',
            'Ç' => 'C',
            'È' => 'E',
            'É' => 'E',
            'Ê' => 'E',
            'Ë' => 'E',
            'Ì' => 'I',
            'Í' => 'I',
            'Î' => 'I',
            'Ï' => 'I',
            'Ñ' => 'N',
            'Ò' => 'O',
            'Ó' => 'O',
            'Ô' => 'O',
            'Õ' => 'O',
            'Ö' => 'O',
            'Ø' => 'O',
            'Ù' => 'U',
            'Ú' => 'U',
            'Û' => 'U',
            'Ü' => 'U',
            'Ý' => 'Y',
            'Þ' => 'B',
            'ß' => 'Ss',
            'à' => 'a',
            'á' => 'a',
            'â' => 'a',
            'ã' => 'a',
            'ä' => 'a',
            'å' => 'a',
            'æ' => 'a',
            'ç' => 'c',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'ì' => 'i',
            'í' => 'i',
            'î' => 'i',
            'ï' => 'i',
            'ð' => 'o',
            'ñ' => 'n',
            'ò' => 'o',
            'ó' => 'o',
            'ô' => 'o',
            'õ' => 'o',
            'ö' => 'o',
            'ø' => 'o',
            'ù' => 'u',
            'ú' => 'u',
            'û' => 'u',
            'ü' => 'u',
            'ý' => 'y',
            'þ' => 'b',
            'ÿ' => 'y',
            'ƒ' => 'f',
            'œ' => 'oe',
        );

        $s = strtr($initial, $TB_CONVERT);

        return $s;
    }
}
