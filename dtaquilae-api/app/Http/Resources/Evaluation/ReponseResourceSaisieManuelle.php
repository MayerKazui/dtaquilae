<?php

namespace App\Http\Resources\Evaluation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReponseResourceSaisieManuelle extends JsonResource
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
            'id' => $this->id ? $this->id : null,
            'is_good_answer' => $this->is_good_answer,
            'reponse' => $this->reponse,
        ];
    }
}
