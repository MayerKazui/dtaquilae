<?php

namespace Database\Seeders;

use App\Models\Referentiel\Formation;
use Illuminate\Database\Seeder;

class FormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createFormation('QT Be ARM 342');
        $this->createFormation('QT Be1.3 342');
        $this->createFormation('QT Be2 342');
        $this->createFormation('QT CE 342');
    }

    private function createFormation($libelle): void
    {
        $formation = new Formation();
        $formation->libelle = $libelle;
        $formation->save();
    }
}
