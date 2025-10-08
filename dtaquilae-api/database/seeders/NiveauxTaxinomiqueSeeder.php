<?php

namespace Database\Seeders;

use App\Models\Referentiel\NiveauTaxinomique;
use Illuminate\Database\Seeder;

class NiveauxTaxinomiqueSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //connaissance
        $niveau = new NiveauTaxinomique;
        $niveau->niveau = 'Connaissance';
        $niveau->save();
        //compréhension
        $niveau = new NiveauTaxinomique;
        $niveau->niveau = 'Compréhension';
        $niveau->save();
        //Mise en oeuvre
        $niveau = new NiveauTaxinomique;
        $niveau->niveau = 'Mise en œuvre';
        $niveau->save();
        //Analyse, Synthese, Evaluation
        $niveau = new NiveauTaxinomique;
        $niveau->niveau = 'Analyse, Synthèse, Évaluation';
        $niveau->save();
    }
}
