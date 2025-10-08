<?php

namespace Database\Factories\Evaluation;

use Illuminate\Support\Carbon;
use App\Models\Formation\Cours;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return $this->generate();
    }

    public function generate(): array
    {
        $propositions = [fake()->words(4, true), fake()->words(3, true), fake()->words(2, true)];
        $reponse = $propositions[fake()->numberBetween(0, 2)];
        $arrayAtaCours = explode("\n", Cours::find(fake()->numberBetween(1, 90))->ata);
        $ata = $arrayAtaCours[0];

        return [
            'numero_question' => fake()->unique()->regexify('[A-Z][a-z0-9]{18}'),
            'libelle' => fake()->words(5, true),
            'proposition_une' => $propositions[0],
            'proposition_deux' => $propositions[1],
            'proposition_trois' => $propositions[2],
            'reponse' => $reponse,
            'niveau' => (fake()->numberBetween(0, 1) == 1) ? 1 : 3,
            'auteur' => fake()->words(7, true),
            'statut_id' => 2,
            'verificateur' => fake()->words(7, true),
            'date_verif' => Carbon::now(),
            'valideur' => fake()->words(7, true),
            'date_validation' => Carbon::now(),
            'niveau_taxinomique_id' => fake()->numberBetween(1, 4),
            'ata' => $ata
        ];
    }
}
