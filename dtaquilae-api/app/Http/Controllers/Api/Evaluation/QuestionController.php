<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Http\Controllers\Api\Evaluation\ObservationQuestionController;
use App\Http\Resources\Evaluation\QuestionDatatableResource;
use App\Http\Resources\Evaluation\QuestionTestSaisieManuelleResource;
use App\Models\Evaluation\Reponse;
use App\Models\Evaluation\Question;
use App\Http\Controllers\Controller;
use App\Models\Evaluation\Test;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\Evaluation\QuestionResource;

class QuestionController extends Controller
{
    /**
     * Affiche les questions.
     */
    public function index()
    {
        return QuestionDatatableResource::collection(
            Question::query()->orderBy('statut_id', 'asc')->get()
        );
    }

    /**
     * Ajoute une nouvelle question.
     */
    public function store(StoreQuestionRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();
        $auteur = $user->nom . ' ' . $user->prenom;
        $data['auteur'] = $auteur;
        $question = Question::create($data);
        ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Création"]);
        return response(['idQuestion' => $question->id], 201);
    }

    /**
     * Affiche une question.
     */
    public function show(Question $question)
    {
        return new QuestionResource($question);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $data = $request->validated();
        if ($data['statut_id'] == 7) {
            $data['actif'] = false;
        }
        $question->update($data);
        switch ($question->statut_id) {
            case 4:
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Vérification"]);
                break;
            case 2:
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Validation"]);
                break;
            case 7:
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Refusée"]);
                break;
            default:
                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Mise à jour"]);
                break;
        }
        return new QuestionResource($question);
    }

    /**
     * Archive une question
     * @param Question $question - La question a atrchiver
     */
    public function destroy(Question $question): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        // Vérifier et mettre à jour les réponses des utilisateurs si nécessaire
        $this->verificationVigilance($question);

        // Mettre à jour le statut de la question
        $question->update(['statut_id' => 5]);
        ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Archivage"]);
        return response("Success", 204);
    }


    /**
     * Vérifie si la question est au statut_id 1 ou 6 et met à jour les réponses des utilisateurs pour le dernier test.
     *
     */
    private function verificationVigilance(Question $question)
    {
        if (str_contains($question->observations->last()->observation, 'Vigilance')) {
            $valueSubstr = 10;
            if (str_contains($question->observations->last()->observation, 'vérifiée'))
                $valueSubstr = 21;
            $testsIds = Test::whereQuestionnaireId(substr($question->observations->last()->observation, $valueSubstr))->pluck('id');
            $reponses = Reponse::whereQuestionId($question->id)->whereIn('test_id', $testsIds)->get();
            foreach ($reponses as $reponse) {
                $reponse->update(['is_good_answer' => true]);
            }
        }
    }

    /**
     * Désachivage d'une question en récupérant le dernier statut connu
     *
     * @param string $id - L'id de la question
     */
    public function desarchiver(string $id): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $question = Question::find($id);
        $question->date_validation !== null ? $question->update(['statut_id' => 2]) : ($question->date_verif !== null ? $question->update(['statut_id' => 4]) : $question->update(['statut_id' => 3]));
        ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Désarchivage"]);
        return response("Success", 204);

    }

    /**
     * Désactivation d'une question
     *
     * @param string $id - L'id de la question
     */
    public function desactiver(string $id): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        Question::find($id)->update(['actif' => false, 'statut_id' => 1]);
        ObservationQuestionController::createObservation(['question_id' => $id, 'observation' => "Vigilance"]);
        return response("Success", 204);
    }

    /**
     * Activation d'une question
     *
     * @param string $id - L'id de la question
     */
    public function active(string $id): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        Question::find($id)->update(['actif' => true, 'statut_id' => 2]);
        ObservationQuestionController::createObservation(['question_id' => $id, 'observation' => "Republication"]);
        return response("Success", 204);
    }

    /**
     * Passe une question au statut "Vigilance vérifiée"
     *
     * @param string $id - L'id de la question
     */
    public function verifierVigilance(string $id): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        $question = Question::find($id);
        $question->update(['statut_id' => 6]);
        $questionnaireId = substr($question->observations->last()->observation, 10);
        ObservationQuestionController::createObservation(['question_id' => $id, 'observation' => "Vigilance vérifiée {$questionnaireId}"]);
        return response("Success", 204);
    }

    /**
     * Passe une question au statut "Refusée"
     *
     * @param string $id - L'id de la question
     */
    public function refuser(string $id): \Illuminate\Http\Response|\Illuminate\Contracts\Routing\ResponseFactory
    {
        Question::find($id)->update(['statut_id' => 7, 'actif' => false]);
        ObservationQuestionController::createObservation(['question_id' => $id, 'observation' => "Refusée"]);
        return response("Success", 204);
    }




    /**
     * Retourne toutes les questions actives ou inactives
     */
    public function questionsActif(bool $isActif)
    {
        $questions = Question::whereActif($isActif)->orderBy('id', 'asc')->get();
        return QuestionResource::collection($questions);
    }

    public function getQuestionsByTest(int $idTest)
    {
        $test = Test::find($idTest);
        $questions = $test->questionnaire->questions()->with('reponses')->get();
        $questionsFiltered = $questions->map(
            function ($question) use (&$test) {
                $question->reponses = $question->reponses->filter(
                    function ($object) use (&$test) {
                        return (($object->user_id == $test->user_id) && ($object->test_id == $test->id));
                    }
                );
                $question->reponses = $question->reponses->map(function ($reponse) use (&$question, &$test) {
                    switch ($reponse->reponse) {
                        case $question->proposition_une:
                            $reponse->reponse = 1;
                            break;
                        case $question->proposition_deux:
                            $reponse->reponse = 2;
                            break;
                        case $question->proposition_trois:
                            $reponse->reponse = 3;
                            break;
                        default:
                            break;
                    }
                    return $reponse;
                });
                $question->test = $test->id;
                $question->stagiaire = $test->stagiaire;
                return $question;
            }
        );
        return QuestionTestSaisieManuelleResource::collection($questionsFiltered);
    }
}
