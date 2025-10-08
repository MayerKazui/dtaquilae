<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use App\Models\Referentiel\Grade;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => fake()->firstName(),
            'prenom' => fake()->lastName(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
            'grade_id' => fake()->numberBetween(1, Grade::count()),
            'role_id' => fake()->numberBetween(1, 5),
            'login' => Str::lower(fake()->firstName() . '.' . fake()->lastName()),
            'matricule' => fake()->numberBetween(1000000000, 9999999999)
        ];
    }

}
