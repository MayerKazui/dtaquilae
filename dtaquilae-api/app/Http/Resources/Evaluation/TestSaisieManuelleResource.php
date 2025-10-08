<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestSaisieManuelleResource extends JsonResource
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
            'stagiaire_grade' => $this->stagiaire->grade->abrege,
            'stagiaire_nom' => $this->stagiaire->nom,
            'stagiaire_prenom' => $this->stagiaire->prenom,
            'stagiaire_matricule' => $this->stagiaire->getMatricule(),
            'id_stagiaire' => $this->stagiaire->id,
            'completed' => $this->questionnaire->questions->count() == $this->reponses->count() ? "Complet" : "Incomplet",
            'questionnaire' => $this->questionnaire->nom,
            'questionnaire_id' => $this->questionnaire->id,
            'is_conforme' => $this->is_conforme,
        ];
    }
}
