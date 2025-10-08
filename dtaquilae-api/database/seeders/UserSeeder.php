<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->fillUser('stagiaire');
        $this->fillUser('instructeur');
        $this->fillUser('gestionnaire');
        $this->fillUser('administrateur');
        $this->fillUser('cdfre');
    }

    private function fillUser($nom): void
    {
        $user = new User();
        $user->password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
        $user->remember_token = Str::random(10);
        $user->grade_id = 1;
        $user->nom = $nom;
        $user->prenom = $nom;

        switch ($nom) {
            case 'stagiaire':
                $user->role_id = 1;
                break;
            case 'instructeur':
                $user->role_id = 2;
                break;
            case 'gestionnaire':
                $user->role_id = 3;
                break;
            case 'administrateur':
                $user->role_id = 4;
                break;
            case 'cdfre':
                $user->role_id = 5;
                break;
        }
        $user->login = $nom;
        $user->matricule = fake()->numberBetween(1000000000, 9999999999);

        $user->save();
    }
}
