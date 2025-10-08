<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
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
                'libelle' => $this->libelle,
                'abrege'=>$this->abrege,
            ];
        }

}
