<?php

namespace Database\Seeders;

use App\Imports\LSImport;
use Illuminate\Database\Seeder;
use Maatwebsite\Excel\Facades\Excel;

class LSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Excel::import(new LSImport, database_path('seeders/LS/LS12.xlsm'), null, null, ['mergeCells' => false]);
    }
}
