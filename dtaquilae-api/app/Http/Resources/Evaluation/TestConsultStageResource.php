<?php

namespace App\Http\Resources\Evaluation;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestConsultStageResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalCount = 0;
        $goodAnswerCount = 0;
        $this->questionnaire->tests->each(function ($test) use (&$totalCount, &$goodAnswerCount) {
            $totalCount += $test->reponses->count();
            $goodAnswerCount += $test->reponses()->whereIsGoodAnswer(true)->count();
        });
        return [
            'id' => $this->id,
            'libelle' => $this->libelle,
            'date' => Carbon::createFromDate($this->date)->format('d/m/Y'),
            'reussite' => $totalCount > 0 ? number_format(round($goodAnswerCount / ($totalCount / 100), 4), 4) : 0,
            'is_conforme' => $this->is_conforme,
        ];
    }
}
