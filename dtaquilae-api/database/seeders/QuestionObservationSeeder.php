<?php

namespace Database\Seeders;

use App\Http\Controllers\Api\Evaluation\ObservationQuestionController;
use App\Models\Evaluation\Question;
use Illuminate\Database\Seeder;

class QuestionObservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = Question::all();
        $questions->each(function ($question) {
            ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => 'Création', 'user' => $question->auteur != null ? $question->auteur : "Anonyme", 'created_at' => $question->created_at]);
            if ($question->date_verif)
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => 'Vérification', 'user' => $question->verificateur != null ? $question->verificateur : "Anonyme", 'created_at' => $question->date_verif]);
            if ($question->date_validation)
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => 'Validation', 'user' => $question->valideur != null ? $question->valideur : "Anonyme", 'created_at' => $question->date_validation]);
        });
    }
}
