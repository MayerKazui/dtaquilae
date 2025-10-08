<?php

namespace App\Imports;

use App\Models\Evaluation\Question;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\RemembersRowNumber;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class QuestionImport implements ToModel, WithHeadingRow, WithChunkReading
{

    use RemembersRowNumber;

    /**
     * @param array $row
     *
     * @return Question|null
     */
    public function model(array $row): Question|null
    {
        $return = (is_null($row['reference_de_la_qcm']) || is_null($row['proposition_1'])) ? null : new Question([
            'numero_question' => $row['reference_de_la_qcm'],
            'ata' => $this->getAta($row['reference_de_la_qcm']),
            'libelle' => $row['libelle_de_la_question'],
            'proposition_une' => trim($row['proposition_1']),
            'proposition_deux' => trim($row['proposition_2']),
            'proposition_trois' => trim($row['proposition_3']),
            'reponse' => is_null($row['reponse']) ? '' : trim($row[str_replace(' ', '_', strtolower($row['reponse']))]),
            'niveau' => is_null($row['niveau_de_formation']) ? 2 : $row['niveau_de_formation'],
            'auteur' => $row['auteur'],
            'created_at' => $this->formatDate($row['date_de_redaction']),
            'statut_id' => $this->getStatutId($row['statut']),
            'verificateur' => $row['verificateur'],
            'date_verif' => $this->formatDate($row['date_de_verification']),
            'valideur' => $row['cdfre'],
            'date_validation' => $this->formatDate($row['date_de_validation_cdfre']),
            'niveau_taxinomique_id' => $this->getNiveauTaxinomiqueId($row['niveau_taxinomique']),
            'reference_documentaire' => $row['reference_documentaire'],
        ]);
        return $return;
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    private function formatDate(string|null $date)
    {
        $dateTime = is_null($date) ? Carbon::now() : Date::excelToDatetimeObject($date);
        return $dateTime;
    }


    private function getStatutId(string|null $statut): int
    {
        if (is_null($statut))
            return 1;
        switch (strtolower($statut)) {
            case 'validation':
                return 2;
            default:
                return 1;
        }
    }

    private function getNiveauTaxinomiqueId(string|null $niveauTax): int
    {
        switch (strtolower($niveauTax)) {
            case 'connaissance':
                return 1;
            case 'compréhension':
                return 2;
            case 'mise en oeuvre':
                return 3;
            case 'analyse, synthèse, évaluation':
                return 4;
            default:
                return 1;
        }
    }

    private function getAta(string|null $referenceQuestion): string
    {
        $ata = is_null($referenceQuestion) ? "" : substr($referenceQuestion, -9, -1);
        return $ata;
    }
}
