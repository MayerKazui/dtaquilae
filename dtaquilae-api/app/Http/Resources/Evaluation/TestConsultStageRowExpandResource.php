<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestConsultStageRowExpandResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalCount = $this->reponses->count();
        $goodAnswerCount = $this->reponses()->whereIsGoodAnswer(true)->count();
        return [
            'id' => $this->id,
            'stagiaire' => $this->stagiaire->grade->abrege . ' ' . $this->stagiaire->nom . ' ' . $this->stagiaire->prenom . ' - ' . $this->stagiaire->getMatricule(),
            'id_stagiaire' => $this->stagiaire->id,
            'reussite' => $totalCount > 0 ? number_format(round($goodAnswerCount / ($totalCount / 100), 4), 4) : 0
        ];
    }
}
