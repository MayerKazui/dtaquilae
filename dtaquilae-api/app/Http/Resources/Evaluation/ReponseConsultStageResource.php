<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReponseConsultStageResource extends JsonResource
{
    public static $wrap = false;
    private static function getReponse($reponse)
    {
        switch ($reponse->reponse) {
            case $reponse->question->proposition_une:
                return "A";
            case $reponse->question->proposition_deux:
                return "B";
            case $reponse->question->proposition_trois:
                return "C";
            default:
                return "NR";
        }
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_question' => $this->question->numero_question,
            'id_question' => $this->question->id,
            'is_good_answer' => $this->is_good_answer,
            'reponse' => self::getReponse($this),
        ];
    }
}
