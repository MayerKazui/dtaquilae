<?php

namespace App\Imports\sheets;

use App\Models\Formation\Chapitre;
use App\Models\Formation\Cours;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class LSBaseImport implements ToModel, WithHeadingRow
{

    public $formation;
    public $tmpTitreChapitre = null;
    public $tmpTitreSousChapitre = null;
    public $tmpNiveauFormation = null;
    public $tmpTest = null;

    /**
     * @param array $row
     *
     * @return Cours|null
     */
    public function model(array $row): Cours|null
    {
        if (is_null($row['intitule_du_cours']))
            return null;
        $return =
            new Cours([
                'libelle' => $row['intitule_du_cours'],
                'ref_documentation' => $row['ref_doc_de_cours'] == '' ? 'A définir' : $row['ref_doc_de_cours'],
                'nb_questions' => $row['nbre_mini_de_qcmqcd_par_test'] == '' ? 999 : $row['nbre_mini_de_qcmqcd_par_test'],
                'niveau' => $this->getNiveauFormation($row['niveau_de_formation']),
                'ata' => $row['ref_s1000d'],
                'test' => $this->getTest($row['test']),
                'sous_chapitre_id' => $this->getSousChapitreId($row['sous_chapitre'], $row['chapitre']),
                'module' => $row['ls12a_ed_2'] == '' ? 'A définir' : $row['ls12a_ed_2'],
            ]);
        return $return;
    }
    private function getNiveauFormation(int|null $niveauFormation): int
    {
        $this->tmpNiveauFormation = $this->getMergedRowsValue($this->tmpNiveauFormation, $niveauFormation);
        return $this->tmpNiveauFormation;
    }

    private function getSousChapitreId(string|null $titreSousChapitre, string|null $titreChapitre): int
    {
        $this->tmpTitreChapitre = $this->getMergedRowsValue($this->tmpTitreChapitre, $titreChapitre);
        $chapitre = Chapitre::firstOrCreate(['titre' => $this->tmpTitreChapitre, 'formation_id' => $this->formation]);
        $this->tmpTitreSousChapitre = $this->getMergedRowsValue($this->tmpTitreSousChapitre, $titreSousChapitre);
        $sousChapitre = Chapitre::firstOrCreate(['titre' => $this->tmpTitreSousChapitre, 'chapitre_sup_id' => $chapitre->id]);
        return $sousChapitre->id;
    }

    private function getTest(string|null $test): string
    {
        $this->tmpTest = $this->getMergedRowsValue($this->tmpTest, $test);
        return $this->tmpTest;
    }

    private function getMergedRowsValue(mixed $initialValue, mixed $rowValue): mixed
    {
        $value = is_null($rowValue) ? $initialValue : (($initialValue == $rowValue) ? $initialValue : $rowValue);
        return $value;
    }
}
