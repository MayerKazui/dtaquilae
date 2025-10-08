<?php

namespace Database\Seeders;

use App\Imports\QuestionImport;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Excel::import(new QuestionImport, database_path('seeders/questions/Fichier BdD @quilaé.xlsm'));
    }
}
