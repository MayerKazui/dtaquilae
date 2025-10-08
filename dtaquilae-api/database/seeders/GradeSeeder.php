<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Armée de terre
         */
        // Militaires du rang
        $this->insertGradeADT('SDT', 'Soldat');
        $this->insertGradeADT('1CL', 'Soldat de première classe');
        $this->insertGradeADT('CPL', 'Caporal');
        $this->insertGradeADT('BRI', 'Brigadier');
        $this->insertGradeADT('CCH', 'Caporal-chef');
        $this->insertGradeADT('BCH', 'Brigadier-chef');
        $this->insertGradeADT('CC1', 'Caporal-chef de première classe');
        $this->insertGradeADT('BC1', 'Brigadier-chef de première classe');

        // Sous-officiers
        $this->insertGradeADT('SGT', 'Sergent');
        $this->insertGradeADT('MDL', 'Maréchal des logis');
        $this->insertGradeADT('SCH', 'Sergent-chef');
        $this->insertGradeADT('MCH', 'Maréchal des logis-chef');
        $this->insertGradeADT('ADJ', 'Adjudant');
        $this->insertGradeADT('ADC', 'Adjudant-chef');
        $this->insertGradeADT('MAJ', 'Major');

        // Officiers
        $this->insertGradeADT('ASP', 'Aspirant');
        $this->insertGradeADT('SLT', 'Sous-lieutenant');
        $this->insertGradeADT('LTN', 'Lieutenant');
        $this->insertGradeADT('CNE', 'Capitaine');
        $this->insertGradeADT('CDT', 'Commandant');
        $this->insertGradeADT('CBA', 'Chef de bataillon');
        $this->insertGradeADT('CEN', 'Chef d\'escadrons');
        $this->insertGradeADT('CES', 'Chef d\'escadron');
        $this->insertGradeADT('LCL', 'Lieutenant-colonel');
        $this->insertGradeADT('COL', 'Colonel');
        $this->insertGradeADT('GBR', 'Général de brigade');
        $this->insertGradeADT('GDI', 'Général de division');
        $this->insertGradeADT('GCA', 'Général de corps d\'armée');
        $this->insertGradeADT('GDA', 'Général d\'armée');

        // Etranger
        $this->insertGradeADT('ETR', 'Etranger');

        //Civil
        $this->insertGradeADT('M.', 'Monsieur');
        $this->insertGradeADT('MME', 'Madame');
        /*
         * Marine nationale
         */
        // Militaires du rang
        //     $this->insertGradeMAR('MO', 'Mousse');
        //     $this->insertGradeMAR('MO1', 'Matelot');
        //     $this->insertGradeMAR('MO2', 'Matelot');
        //     $this->insertGradeMAR('QM2', 'Quartier-maître');
        //     $this->insertGradeMAR('QM1', 'Quartier-maître');

        // Officiers mariniers
        //     $this->insertGradeMAR('SM', 'Second-maître');
        //     $this->insertGradeMAR('MT', 'Maître');
        //     $this->insertGradeMAR('PM', 'Premier maître');
        //     $this->insertGradeMAR('MP', 'Maître principal');
        //     $this->insertGradeMAR('MAJ', 'Major');

        // Officiers
        //     $this->insertGradeMAR('ASP', 'Aspirant');
        //     $this->insertGradeMAR('EV2', 'Enseigne de vaisseau de deuxième classe');
        //     $this->insertGradeMAR('EV1', 'Enseigne de vaisseau de premirèe classe');
        //     $this->insertGradeMAR('LV', 'Lieutanant de vaisseau');
        //     $this->insertGradeMAR('CC', 'Capitaine de corvette');
        //     $this->insertGradeMAR('CF', 'Capitaine de frégate');
        //     $this->insertGradeMAR('CV', 'Capitaine de vaisseau');
        //     $this->insertGradeMAR('CA', 'Contre-amiral');
        //     $this->insertGradeMAR('VA', 'Vice-amiral');
        //     $this->insertGradeMAR('VAE', 'Vice-amiral d\'escadre');
        //     $this->insertGradeMAR('AL', 'Amiral');

        /*
         * Armée de l'air et de l'espace
         */
        // Militaires du rang
        //     $this->insertGradeAAE('AVT', 'Aviateur');
        //     $this->insertGradeAAE('AV1', 'Aviateur de première classe');
        //     $this->insertGradeAAE('CAL', 'Caporal');
        //     $this->insertGradeAAE('CCH', 'Caporal-chef');

        // Sous-officiers
        //     $this->insertGradeAAE('SGT', 'Sergent');
        //     $this->insertGradeAAE('SGC', 'Sergent-chef');
        //     $this->insertGradeAAE('ADJ', 'Adjudant');
        //     $this->insertGradeAAE('ADC', 'Adjudant-chef');
        //     $this->insertGradeAAE('MAJ', 'Major');

        // Officiers
        //     $this->insertGradeAAE('SLT', 'Sous-lieutenant');
        //     $this->insertGradeAAE('LTT', 'Lieutenant');
        //     $this->insertGradeAAE('CNE', 'Capitaine');
        //     $this->insertGradeAAE('CDT', 'Commandant');
        //     $this->insertGradeAAE('LCL', 'Lieutenant-colonel');
        //     $this->insertGradeAAE('COL', 'Colonel');
        //     $this->insertGradeAAE('GBA', 'Général de brigade aérienne');
        //     $this->insertGradeAAE('GDA', 'Général de division aérienne');
        //     $this->insertGradeAAE('GCA', 'Général de corps aérien');
        //     $this->insertGradeAAE('GAA', 'Général d\'armée aérienne');
    }

    private function insertGradeADT($abrege, $libelle)
    {
        DB::table('grades')->insert([
            'abrege' => $abrege,
            'libelle' => $libelle,
        ]);
    }

    // private function insertGradeMAR($abrege, $libelle)
    // {
    //     DB::table('grades')->insert([
    //         'abrege' => $abrege,
    //         'libelle' => $libelle,
    //     ]);
    // }

    // private function insertGradeAAE($abrege, $libelle)
    // {
    //     DB::table('grades')->insert([
    //         'abrege' => $abrege,
    //         'libelle' => $libelle,
    //     ]);
    // }
}
