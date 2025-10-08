<?php

namespace App\Http\Resources;

use App\Http\Resources\Evaluation\TestConsultStageResource;
use App\Http\Resources\Users\UserResource;
use App\Http\Resources\Users\UserStageConsultationResource;
use App\Models\Evaluation\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Log;

class StageResource extends JsonResource
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
            'formation_id' => $this->formation_id,
            'formation' => $this->formation->libelle,
            'debut' => $this->debut,
            'fin' => $this->fin,
            'stagiaires' => UserStageConsultationResource::collection($this->stagiaires),
            'directeur_id' => $this->directeur_id,
            'directeur' => $this->directeur->grade->abrege . " " . $this->directeur->nom . " " . $this->directeur->prenom,
            'adjoint_id' => $this->adjoint_id,
            'adjoint' => $this->adjoint != null ? $this->adjoint->grade->abrege . " " . $this->adjoint->nom . " " . $this->adjoint->prenom : "",
            'debut_table' => Carbon::createFromDate($this->debut)->format('d/m/Y'),
            'fin_table' => Carbon::createFromDate($this->fin)->format('d/m/Y'),
            'tests' => TestConsultStageResource::collection(Test::whereBetween('date', [$this->debut, $this->fin])->whereIn("user_id", $this->stagiaires->pluck('id')->toArray())->distinct('libelle')->get())
        ];
    }
}
