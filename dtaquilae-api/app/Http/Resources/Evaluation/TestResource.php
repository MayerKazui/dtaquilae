<?php

namespace App\Http\Resources\Evaluation;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\Users\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TestResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stage = $this->stagiaire
        ->stages()
        ->where('debut', '<=', $this->date)
        ->where('fin', '>=', $this->date)
        ->first();

        return [
            'id' => $this->id,
            'libelle' => $this->libelle,
            'stage' => $this->stagiaire->stages()->where('debut', '<=', $this->date)->where('fin', '>=', $this->date)->first()->libelle,
            'debut' => $stage ? Carbon::createFromDate($stage->debut)->format('d/m/Y'): null,
            'fin' => $stage ? Carbon::createFromDate($stage->fin)->format('d/m/Y'): null,
            'date' => Carbon::createFromDate($this->date)->format('d/m/Y'),
            'questionnaire_nom' => $this->questionnaire->nom,
            'questionnaire_id' => $this->questionnaire->id,
            'is_counter_test' => $this->is_counter_test,
            'stagiaire' => new UserResource($this->stagiaire),
            'reponses' => $this->reponses,
            'is_conforme' => $this->is_conforme
        ];
    }
}
