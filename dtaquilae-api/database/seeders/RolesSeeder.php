<?php

namespace Database\Seeders;

use App\Models\Referentiel\Role;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //Stagiaire
        $role = new Role;
        $role->abrege = 'STA';
        $role->libelle = 'Stagiaire';
        $role->save();
        //IEC
        $role = new Role;
        $role->abrege = 'IEC';
        $role->libelle = 'Instructeur Contrôleur Examinateur';
        $role->save();
        //PGS
        $role = new Role;
        $role->abrege = 'PGS';
        $role->libelle = 'Pôle Gestion Stagiaire';
        $role->save();
        //Administrateur
        $role = new Role;
        $role->abrege = 'ADM';
        $role->libelle = 'Administrateur';
        $role->save();
        //Administrateur
        $role = new Role;
        $role->abrege = 'CDFRE';
        $role->libelle = 'Chef de Division de Formation Responsable des Examens';
        $role->save();
    }
}
