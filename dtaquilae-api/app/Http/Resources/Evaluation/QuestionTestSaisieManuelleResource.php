<?php

namespace App\Http\Resources\Evaluation;

use App\Models\Evaluation\Reponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class QuestionTestSaisieManuelleResource extends JsonResource
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
            'numero_question' => $this->numero_question,
            'proposition_une' => $this->proposition_une,
            'proposition_deux' => $this->proposition_deux,
            'proposition_trois' => $this->proposition_trois,
            'reponse_question' => $this->reponse,
            'reponse' => $this->reponses->count() > 0 ? ReponseResourceSaisieManuelle::collection($this->reponses)
                : [new ReponseResourceSaisieManuelle(new Reponse(['reponse' => null, 'is_good_answer' => false]))],
            'test_id' => $this->test,
            'stagiaire' => $this->stagiaire->grade->abrege . ' ' . $this->stagiaire->nom . ' ' . $this->stagiaire->prenom,
            'user_id' => $this->stagiaire->id,
            'question_id' => $this->id
        ];
    }
}
