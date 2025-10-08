<?php

namespace Database\Factories\Referentiel;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NiveauTaxinomique>
 */
class NiveauTaxinomiqueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'niveau' => fake()->unique()->words(1,true)
        ];
    }
}
