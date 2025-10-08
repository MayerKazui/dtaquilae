<?php

namespace Database\Factories\Formation;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cours>
 */
class CoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'libelle' => fake()->words(2, true),
            'ata' => fake()->numberBetween(1,999),
            'sous_chapitre_id' => fake()->numberBetween(133,1452),
        ];
    }
}
