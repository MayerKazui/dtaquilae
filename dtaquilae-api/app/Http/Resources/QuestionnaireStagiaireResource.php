<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Evaluation\QuestionResource;

class QuestionnaireStagiaireResource extends JsonResource
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
            'date' => $this->date,
            'is_active' => $this->is_active,
            'nomTest' => $this->nomTest,
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
        ];
    }
}
