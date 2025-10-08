<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StoreQuestionRequest extends FormRequest
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
        if ($this->input('type') === 'QCM') {
            return [
                'numero_question' => ['required', 'string', 'unique:questions'],
                'ata' => ['required'],
                'libelle' => ['required', 'string'],
                'proposition_une' => ['required', 'string'],
                'proposition_deux' => ['required', 'string'],
                'proposition_trois' => ['required', 'string'],
                'reponse' => ['required', 'string'],
                'niveau' => ['required'],
                'niveau_taxinomique_id' => ['required'],
                'reference_documentaire' => ['nullable', 'string']
            ];
        } else {
            return [
                'numero_question' => ['required', 'string', 'unique:questions'],
                'reference_documentaire' => ['nullable', 'string'],
                'ata' => ['required'],
                'libelle' => ['required', 'string'],
                'reponse' => ['required', 'string'],
                'niveau' => ['required'],
                'niveau_taxinomique_id' => ['required'],
            ];
        }
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cours_id.required' => 'Le champ cours est obligatoire.',
            'reference.required' => 'Le champ référence est obligatoire.',
            'ata.required' => 'Le champ ata est obligatoire.',
            'reponse.required' => 'Le champ réponse est obligatoire.',
            'libelle.required' => 'Le champ libellé est obligatoire.',
            'niveau_taxinomique_id.required' => 'Le champ niveau taxinomique est obligatoire.',
        ];
    }
}
