<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
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
        if ($this->input('type') === 'qcm') {
            return [
                'numero_question' => ['required', 'string'],
                'libelle' => ['required', 'string'],
                'ata' => ['required', 'string'],
                'proposition_une' => ['required', 'string'],
                'proposition_deux' => ['required', 'string'],
                'proposition_trois' => ['required', 'string'],
                'reponse' => ['required', 'string'],
                'niveau' => ['required'],
                'niveau_taxinomique_id' => ['required'],
                'valideur' => ['nullable', 'string'],
                'verificateur' => ['nullable', 'string'],
                'date_verif' => ['nullable', 'string'],
                'date_validation' => ['nullable', 'string'],
                'reference_documentaire' => ['nullable', 'string'],
                'statut_id' => ['integer']
                // 'actif' => ['string'],
            ];
        } else {
            return [
                'numero_question' => ['required', 'string'],
                'reference_documentaire' => ['nullable', 'string'],
                'ata' => ['required'],
                'libelle' => ['required', 'string'],
                'reponse' => ['required', 'string'],
                'niveau' => ['required'],
                'niveau_taxinomique_id' => ['required'],
                'valideur' => ['nullable', 'string'],
                'verificateur' => ['nullable', 'string'],
                'date_verif' => ['nullable', 'string'],
                'date_validation' => ['nullable', 'string'],
                'statut_id' => ['integer']
                //'actif' => ['string'],
            ];
        }
    }
}
