<?php

namespace App\Http\Resources\Users;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'grade_id' => $this->grade_id,
            'grade_libelle' => $this->grade->libelle,
            'grade_abrege' => $this->grade->abrege,
            'matricule' => $this->matricule,
            'numeroAlliance' => $this->numeroAlliance,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'role_id' => $this->role_id,
            'role_libelle' => $this->role->libelle,
            'created_at' => $this->created_at->format('d/m/Y H:i:s'),
        ];
    }
}
