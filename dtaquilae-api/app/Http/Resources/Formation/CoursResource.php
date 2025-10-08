<?php

namespace App\Http\Resources\Formation;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Evaluation\QuestionResource;

class CoursResource extends JsonResource
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
            'niveau'=> $this->niveau,
            'nb_questions_ref' => $this->nb_questions,
            'nb_questions' => $this->nb_questions,
            'sous_chapitre_id' => $this->sous_chapitre_id,
            'sous_chapitre' => $this->sousChapitre->titre,
            'test' =>$this->test,
            'questionsNiveauUn'=> $this->questionsNiveauUn,
            'questionsNiveauDeux'=> $this->questionsNiveauDeux,
            'questionsNiveauTrois'=> $this->questionsNiveauTrois,
            'module' => $this->module,
        ];
    }
}
