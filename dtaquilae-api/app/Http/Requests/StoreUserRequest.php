<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nom' => ['required', 'string'],
            'prenom' => ['required', 'string'],
            'matricule' => ['nullable', 'required_if:numeroAlliance,null', 'string', 'unique:users,matricule', 'max:10', 'min:10'],
            'numeroAlliance' => ['nullable', 'required_if:matricule,null', 'string', 'unique:users,numeroAlliance', 'max:12', 'min:12'],
            'grade_id' => ['required'],
            'role_id' => ['required'],
            'login' => ['required', 'unique:users,login'],
            'password' => ['required']
        ];
    }
    public function messages(): array
    {
        return [
            'matricule.unique' => 'Ce matricule existe déja.',
        ];
    }
}
