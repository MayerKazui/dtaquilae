<?php

namespace App\Http\Controllers;

use App\Models\Evaluation\Test;
use App\Models\Formation\Stage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class CRResultatsController extends Controller
{
    /**
     * Génère un PDF contenant les résultats des stagiaires pour un test donné.
     */
    public function generatePDF(string $stageId, string $testId)
    {
        // Récupérer le stage et les stagiaires associés
        $stage = Stage::with('stagiaires')->findOrFail($stageId);

        // Récupérer le test
        $test = Test::with('questionnaire.questions')->findOrFail($testId);

        // Récupérer tous les tests associés au même questionnaire, même libellé et même date
        $tests = Test::where('questionnaire_id', $test->questionnaire_id)
            ->where('libelle', $test->libelle)
            ->where('date', $test->date)
            ->get();

        // Créer une table associative pour retrouver les tests par stagiaire
        $testsByUser = $tests->keyBy('user_id');

        // Initialiser les résultats des stagiaires
        $stagiaireResultats = [];

        // Parcourir chaque stagiaire associé au stage
        foreach ($stage->stagiaires as $stagiaire) {
            // Vérifier si un test existe pour ce stagiaire
            $stagiaireTest = $testsByUser->get($stagiaire->id);

            if (!$stagiaireTest) {
                continue;
            }

            // Initialiser les résultats pour les questions du stagiaire
            $questions = [];

            // Parcourir les questions du questionnaire
            foreach ($test->questionnaire->questions as $index => $question) {
                // Récupérer la réponse du stagiaire à cette question
                $reponse = $question->reponses()
                    ->where('test_id', $stagiaireTest->id)
                    ->where('user_id', $stagiaire->id)
                    ->first();

                // Convertir la réponse correcte et celle du stagiaire en lettre (A, B ou C)
                $reponseCorrecte = $this->convertToLetter($question, $question->reponse);
                $reponseStagiaire = $reponse
                    ? $this->convertToLetter($question, $reponse->reponse)
                    : 'Non répondu';

                // Ajouter les informations de la question
                $questions[] = [
                    'compteur' => $index + 1,
                    'libelle' => $question->libelle,
                    'proposition_une' => $question->proposition_une,
                    'proposition_deux' => $question->proposition_deux,
                    'proposition_trois' => $question->proposition_trois,
                    'reponse_correcte' => $reponseCorrecte,
                    'reponse_stagiaire' => $reponseStagiaire,
                ];
            }

            // Ajouter les résultats de ce stagiaire
            $stagiaireResultats[] = [
                'stagiaire' => $stagiaire->grade->abrege . ' ' . $stagiaire->prenom . ' ' . $stagiaire->nom,
                'questions' => $questions,
            ];
        }

        // Préparer les données pour la vue
        $data = [
            'test' => $test,
            'stagiaireResultats' => $stagiaireResultats,
        ];

        // Génération du PDF
        $pdf = Pdf::loadView('CrResultats', $data);
        $pdf->setPaper('a4', 'portrait');

        // Encoder le PDF en base64
        $base64EncodePdf = base64_encode($pdf->output());

        // Retourner la réponse JSON avec le PDF encodé en base64
        return response()->json([
            'pdfData' => $base64EncodePdf,
            'contentType' => 'application/pdf',
        ]);
    }

    /**
     * Convertit une réponse en A, B ou C.
     */
    private function convertToLetter($question, $reponse)
    {
        if ($reponse === $question->proposition_une) {
            return 'A';
        } elseif ($reponse === $question->proposition_deux) {
            return 'B';
        } elseif ($reponse === $question->proposition_trois) {
            return 'C';
        }

        return 'Non répondu'; // Par défaut
    }
}
