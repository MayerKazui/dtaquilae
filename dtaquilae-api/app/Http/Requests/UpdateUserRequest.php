<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'role_id' => ['required'],
            'nom' => ['required', 'string'],
            'prenom' => ['required', 'string'],
            'matricule' => [
                'nullable',
                'required_if:numeroAlliance,null',
                'string',
                'unique:users,matricule,' . $this->route('user')->id,
                'max:10',
                'min:10'
            ],
            'numeroAlliance' => [
                'nullable',
                'required_if:matricule,null',
                'string',
                'unique:users,numeroAlliance,' . $this->route('user')->id,
                'max:12',
                'min:12'
            ],
            'grade_id' => ['required'],
            'login' => ['required'],
            'password' => [
                'nullable',
                Password::min(8)
                    ->letters()
                    ->symbols()
                    ->numbers()
            ]
        ];
    }

}
