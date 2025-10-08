<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionQuestionnaireConsultResource extends JsonResource
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
            'libelle' => $this->libelle,
            'ata' => $this->ata,
            'niveau' => $this->niveau,
            'numero_question' => $this->numero_question,
            'proposition_une' => $this->proposition_une,
            'proposition_deux' => $this->proposition_deux,
            'proposition_trois' => $this->proposition_trois,
            'reponse' => $this->reponse,
            'images' => $this->images,
            'libelle_cours' => $this->libelle_cours
        ];
    }
}
