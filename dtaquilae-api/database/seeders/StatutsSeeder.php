<?php

namespace Database\Seeders;

use App\Models\Referentiel\Statut;
use Illuminate\Database\Seeder;

class StatutsSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //vigilance -  id 1
        $statut = new Statut;
        $statut->libelle = 'Vigilance';
        $statut->save();
        //validée - id 2
        $statut = new Statut;
        $statut->libelle = 'Validée';
        $statut->save();
        //à vérifier - id 3
        $statut = new Statut;
        $statut->libelle = 'À vérifier';
        $statut->save();
        //à valider - id 4
        $statut = new Statut;
        $statut->libelle = 'À valider';
        $statut->save();
        //archivée - id 5
        $statut = new Statut;
        $statut->libelle = 'Archivée';
        $statut->save();
        //vigilance vérifiée - id 6
        $statut = new Statut;
        $statut->libelle = 'Vigilance vérifiée';
        $statut->save();
        //refusée - id 7
        $statut = new Statut;
        $statut->libelle = 'Refusée';
        $statut->save();
    }
}
