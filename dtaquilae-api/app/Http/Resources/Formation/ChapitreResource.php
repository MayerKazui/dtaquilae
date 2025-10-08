<?php

namespace App\Http\Resources\Formation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapitreResource extends JsonResource
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
            'titre' => $this->titre,
            'formation' => $this->formation,
        ];
    }
}
