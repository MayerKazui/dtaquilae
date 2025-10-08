<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Formation\Chapitre;
use Illuminate\Support\Collection;

class ChapitreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Collection::range(1, 4) as $formation) {
            for ($i = 0; $i < 11; $i++) {
                $chapitre = new Chapitre();
                $chapitre->formation_id = $formation;
                $chapitre->titre = fake()->words(2, true);
                $chapitre->save();
            }
        }
    }
}
