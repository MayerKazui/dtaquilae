<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use App\Models\Referentiel\Statut;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class QuestionResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $statut = is_null($this->statut_id) ? 'non défini' : Statut::find($this->statut_id)->libelle;
        return [
            'id' => $this->id,
            'libelle' => $this->libelle,
            'ata' => $this->ata,
            'niveau' => $this->niveau,
            'created_at' => $this->created_at->format('d/m/Y'),
            'numero_question' => $this->numero_question,
            'proposition_une' => $this->proposition_une,
            'proposition_deux' => $this->proposition_deux,
            'proposition_trois' => $this->proposition_trois,
            'reponse' => $this->reponse,
            'niveau_taxinomique_id' => $this->niveau_taxinomique_id,
            'verificateur' => $this->verificateur,
            'valideur' => $this->valideur,
            'date_verif' => $this->date_verif,
            'date_validation' => $this->date_validation,
            'statut' => $statut,
            'reference_documentaire' => $this->reference_documentaire,
            'actif' => $this->actif,
            'statut_id' => $this->statut_id,
            'auteur' => $this->auteur,
            'observations' => $this->observations->sortBy('id')->values()->all(),
            'images' => $this->images,
            'reponseStagiaire' => $this->when(isset($this->reponseStagiaire), function () {
                return [
                    'id' => $this->reponseStagiaire->id,
                    'reponse' => $this->reponseStagiaire->reponse,
                    'is_good_answer' => $this->reponseStagiaire->is_good_answer,
                ];
            }),
        ];
    }
}
