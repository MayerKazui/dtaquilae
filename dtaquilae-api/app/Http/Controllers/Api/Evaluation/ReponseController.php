<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Http\Resources\Evaluation\ReponseConsultStageResource;
use App\Models\Evaluation\Reponse;
use App\Models\Evaluation\Question;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReponseRequest;
use App\Http\Requests\UpdateReponseRequest;
use App\Models\Evaluation\Test;
use Exception;
use Log;

class ReponseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReponseRequest $request)
    {
        // Récupérer les données validées
        $validatedData = $request->validate([
            'reponses' => 'required|array',
            'test' => 'required|array',
        ]);

        $reponses = $validatedData['reponses'];
        $testId = $validatedData['test']['id'];
        $userId = $validatedData['test']['stagiaire'];

        foreach ($reponses as $questionId => $reponseValue) {

            $question = Question::findOrFail($questionId);
            switch ($reponseValue) {
                case 1:
                    $reponseValue = $question->proposition_une;
                    break;
                case 2:
                    $reponseValue = $question->proposition_deux;
                    break;
                case 3:
                    $reponseValue = $question->proposition_trois;
                    break;
                default:
                    break;
            }

            $isGoodAnswer = $question->reponse === $reponseValue;

            // Vérifier si une réponse existe déjà
            $existingReponse = Reponse::where('question_id', $questionId)
                ->where('test_id', $testId)
                ->where('user_id', $userId)
                ->first();


            if ($existingReponse) {
                // Mettre à jour la réponse existante
                $existingReponse->reponse = $reponseValue;
                $existingReponse->is_good_answer = $isGoodAnswer;
                $existingReponse->save();
            } else {
                // Créer une nouvelle réponse
                $rep = new Reponse;
                $rep->question_id = $questionId;
                $rep->test_id = $testId;
                $rep->user_id = $userId;
                $rep->reponse = $reponseValue;
                $rep->is_good_answer = $isGoodAnswer;
                $rep->save();
            }
        }

        return response()->json([
            'message' => 'Les réponses ont été mises à jour avec succès.'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reponse $reponse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReponseRequest $request, Reponse $reponse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reponse $reponse)
    {
        //
    }

    public function getByTestAndQuestionsId(int $idTest, string $questionId)
    {
        return ReponseConsultStageResource::collection(Reponse::whereTestId($idTest)->whereIn('question_id', explode(',', $questionId))->get());
    }

    public function storeReponseSaisieManuelle(StoreReponseRequest $request)
    {
        $data = $request->validate([
            '*.reponse' => 'required',
            '*.test_id' => 'required',
            '*.user_id' => 'required',
            '*.question_id' => 'required',
            '*.proposition_une' => 'present',
            '*.proposition_deux' => 'present',
            '*.proposition_trois' => 'present',
            '*.reponse_question' => 'present'
        ]);
        $reponses = collect($data);
        $reponsesToInsert = $reponses->map(function ($reponse) {
            if ($reponse['proposition_une']) {
                switch ($reponse['reponse'][0]['reponse']) {
                    case 1:
                        $reponse['reponse'][0]['reponse'] = $reponse['proposition_une'];
                        break;
                    case 2:
                        $reponse['reponse'][0]['reponse'] = $reponse['proposition_deux'];
                        break;
                    case 3:
                        $reponse['reponse'][0]['reponse'] = $reponse['proposition_trois'];
                        break;
                }
                $reponse['reponse'][0]['is_good_answer'] = $reponse['reponse'][0]['reponse'] == $reponse['reponse_question'] ? true : false;
            }
            $reponse['reponse'][0]['test_id'] = $reponse['test_id'];
            $reponse['reponse'][0]['question_id'] = $reponse['question_id'];
            $reponse['reponse'][0]['user_id'] = $reponse['user_id'];
            unset ($reponse['reponse'][0]['id']);
            return $reponse['reponse'][0];
        });
        Reponse::upsert($reponsesToInsert->toArray(), ['user_id', 'test_id', 'question_id'], ['reponse', 'is_good_answer']);
        $test = Test::find($reponses[0]['test_id']);
        $test->is_finish = true;
        $test->save();
        return response("Succès", 200);
    }
}
