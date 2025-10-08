<?php

namespace Database\Seeders;

use App\Models\Evaluation\Question;
use App\Models\User;
use Database\Seeders\LSSeeder;
use Database\Seeders\QuestionObservationSeeder;
use Database\Seeders\QuestionSeeder;
use Illuminate\Database\Seeder;
use Database\Seeders\GradeSeeder;
use Database\Seeders\RolesSeeder;
use Database\Seeders\StatutsSeeder;
use Database\Seeders\NiveauxTaxinomiqueSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Référentiel
        $this->call(RolesSeeder::class);
        $this->call(StatutsSeeder::class);
        $this->call(GradeSeeder::class);
        $this->call(FormationSeeder::class);
        // User
        User::factory(40)->create();
        $this->call(UserSeeder::class);
        // Evaluation
        $this->call(NiveauxTaxinomiqueSeeder::class);
        $this->call(LSSeeder::class);
        //$this->call(QuestionSeeder::class);
        Question::factory(1500)->create();
        //$this->call(QuestionObservationSeeder::class);
    }
}
