<?php

namespace App\Http\Resources\Evaluation;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionnaireConsultationResource extends JsonResource
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
            'nom' => $this->nom,
            'date' => Carbon::createFromDate($this->date)->format('d/m/Y'),
            'actif' => $this->is_active,
            'testsUniques' => $this->testsUniques,
            'supprimable' => $this->supprimable,
            'questions' => QuestionQuestionnaireConsultResource::collection($this->questions), // Transformez chaque question en ressource individuelle
        ];
    }
}
