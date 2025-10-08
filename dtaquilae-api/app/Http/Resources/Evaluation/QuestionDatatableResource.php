<?php

namespace App\Http\Resources\Evaluation;

use App\Models\Evaluation\Question;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionDatatableResource extends JsonResource
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
            'libelle_cours' => $this->libelle_cours,
            'niveau' => $this->niveau,
            'numero_question' => $this->numero_question,
            'statut' => is_null($this->statut_id) ? 'non défini' : $this->statut->libelle,
            'reference_documentaire' => $this->reference_documentaire,
            'actif' => $this->actif,
            'nb_utilisation' => $this->nb_utilisation,
            'date_validation' => Carbon::createFromDate($this->date_validation)->format('d/m/Y'),
            'nb_max_utilisation' => Question::select('nb_utilisation')->distinct()->orderBy('nb_utilisation')->get()->pluck('nb_utilisation')
        ];
    }
}
