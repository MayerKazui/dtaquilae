<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionnaireRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $coursParSousChapitreAdjusted = [];

        // Ajustement des clés en supprimant les points finaux
        if ($this->has('coursParSousChapitre')) {
            foreach ($this->input('coursParSousChapitre') as $sousChapitreKey => $sousChapitre) {
                $adjustedKey = rtrim($sousChapitreKey, '.'); // Supprime le point final s'il existe
                $coursParSousChapitreAdjusted[$adjustedKey] = $sousChapitre;
            }

            // Remplacer la requête modifiée pour la validation
            $this->merge(['coursParSousChapitre' => $coursParSousChapitreAdjusted]);
        }

        // Définition des règles de validation
        $rules = [
            'selectedFormationId' => 'required|numeric',
            'selectedFormation' => 'required|string',
            'selectedTest' => 'nullable|string',
            'selectedModules' => 'nullable|array',
            'selectedOptions' => 'array',
            'coursParSousChapitre' => 'array',
        ];

        // Construire dynamiquement des règles pour chaque cours dans chaque sous-chapitre ajusté
        foreach ($coursParSousChapitreAdjusted as $sousChapitreKey => $sousChapitre) {
            foreach ($sousChapitre as $index => $cours) {
                $repere = "coursParSousChapitre.{$sousChapitreKey}.{$index}";
                $rules["{$repere}.id"] = 'required|numeric';
                $rules["{$repere}.ata"] = 'required|string';
                $rules["{$repere}.niveau"] = 'required|numeric';
                $rules["{$repere}.nb_questions_ref"] = 'required|numeric';
                $rules["{$repere}.nb_questions"] = 'required|numeric';
                $rules["{$repere}.sous_chapitre_id"] = 'required|numeric';
                $rules["{$repere}.sous_chapitre"] = 'required|string';
                $rules["{$repere}.test"] = 'required|string';
                $rules["{$repere}.questionsNiveauUn"] = 'required|numeric';
                $rules["{$repere}.questionsNiveauTrois"] = 'required|numeric';
            }
        }

        return $rules;
    }



}
