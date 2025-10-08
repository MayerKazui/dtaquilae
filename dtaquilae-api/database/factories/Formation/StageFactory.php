<?php

namespace Database\Factories\Formation;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Stage>
 */
class StageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'libelle' => fake()->words(5, true),
            'debut' => Carbon::now(),
            'fin' => Carbon::now(),
            'formation_id' => fake()->numberBetween(1,4),
            'directeur_id' => fake()->numberBetween(1,4),
            'adjoint_id' => fake()->numberBetween(1,4),
        ];
    }
}
