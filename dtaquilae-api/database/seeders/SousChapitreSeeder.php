<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use App\Models\Formation\Chapitre;

class SousChapitreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Collection::range(1, 132) as $chapitre) {
            for ($i = 0; $i < 11; $i++) {
                $sousChapitre = new Chapitre();
                $sousChapitre->chapitre_sup_id = $chapitre;
                $sousChapitre->titre = fake()->words(3, true);
                $sousChapitre->save();
            }
        }
    }
}
