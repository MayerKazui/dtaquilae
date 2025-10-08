<?php

namespace App\Http\Resources\Evaluation;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionnaireDatatableResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Charger les questions associées avec le questionnaire
        $questions = $this->questions()->get();

        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'date' => Carbon::createFromDate($this->date)->format('d/m/Y'),
        ];
    }
}
