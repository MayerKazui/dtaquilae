<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Models\Formation\Chapitre;
use App\Models\Formation\Cours;
use App\Models\Referentiel\Formation;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Evaluation\Test;
use App\Models\Formation\Stage;
use App\Models\Evaluation\Reponse;
use App\Models\Referentiel\Statut;
use App\Models\Evaluation\Question;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use App\Http\Resources\Evaluation\TestResource;
use App\Http\Resources\Evaluation\TestSaisieManuelleResource;
use App\Http\Resources\Evaluation\TestConsultStageRowExpandResource;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;


class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TestResource::collection(Test::query()->distinct('libelle')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTestRequest $request)
    {
        $validatedData = $request->validate([
            'libelle' => 'required|string',
            'questionnaire_id' => 'required|string|exists:questionnaires,id',
            'stage_id' => 'required|string|exists:stages,id',
            'is_counter_test' => 'boolean',
            'date' => 'required'
        ]);

        // Récupérer le timestamp au format aaaammjjhh (année, mois, jour, heure)
        $timestamp = now()->format('YmdHi'); // Utilise Carbon pour obtenir le format souhaité

        // Ajouter le timestamp au libelle avec un underscore
        $validatedData['libelle'] = $validatedData['libelle'] . '_' . $timestamp;

        // Récupération des utilisateurs liés au stage
        $stage = Stage::find($validatedData['stage_id']);

        foreach ($stage->stagiaires as $user) {
            $validatedData['user_id'] = $user->id;
            Test::create($validatedData);
        }
        return response("Test créé");
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test)
    {

        $data = $request->validate([
            'date' => 'required|date',
        ]);

        Test::where('questionnaire_id', $test->questionnaire_id)
            ->update(['date' => $data['date']]);

        // Réponse de succès
        return response()->json([
            'message' => 'La date du test a été modifiée avec succès.',
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        // Vérifie si ce test ou les tests similaires ont des réponses
        $relatedTests = Test::where('questionnaire_id', $test->questionnaire_id)
            ->where('libelle', $test->libelle)
            ->pluck('id'); // Récupère les IDs des tests similaires

        // Vérifie s'il y a des réponses associées à ces tests
        $hasResponses = Reponse::whereIn('test_id', $relatedTests)->exists();

        if ($hasResponses) {
            return response()->json([
                'message' => 'Ce test ne peut pas être supprimé car il a déjà des réponses.'
            ], 403); // Retourne un code d'erreur 403 Forbidden
        }

        // Si aucun test similaire n'a de réponses, supprimer tous les tests concernés
        Test::whereIn('id', $relatedTests)->delete();

        return response()->json([
            'message' => 'Le test et les tests similaires ont été supprimés avec succès.'
        ], 200); // Success response
    }

    public function saisieManuelle($idTest)
    {
        return TestSaisieManuelleResource::collection(Test::find($idTest)->questionnaire->tests);
    }
    public function getTestsByUser()
    {
        $user = Auth::user();
        // Récupérer les tests liés à l'utilisateur
        $tests = Test::where('user_id', $user->id)
            ->whereDate('date', Carbon::now())
            ->whereIsFinish(false)
            ->get();

        // Retourner les tests en utilisant une ressource
        return TestResource::collection($tests);
    }

    /**
     * Met à jour la date du test passé en paramètre avec la date du jour.
     *
     * @param int $testId
     * @return \Illuminate\Http\JsonResponse
     */
    public function terminerTest(int $testId)
    {
        // Récupérer le test
        $test = Test::findOrFail($testId);

        // Mettre à jour la date avec la date du jour
        $test->is_finish = true;
        $test->save();

        $this->analyseQuestions($test->questionnaire_id, false);

        return response()->json([
            'message' => 'Le test a été terminé avec succès.',
            'test' => $test
        ], 200);
    }

    /**
     * Lance l'analyse des questions pour un questionnaire
     *
     * @param int $questionnaireId : L'ID du questionnaire à analyser
     * @param bool $forceAnalyse : Force l'analyse d'un questionnaire même si celui-ci n'est pas terminé
     */
    public function analyseQuestions(int $questionnaireId, bool $forceAnalyse): void
    {
        if ($forceAnalyse) {
            $this->ControleReponseTest($questionnaireId);
            return;
        }
        // Vérifier si tous les tests associés au même questionnaire ont une date définie
        if ($this->TousTestsTerminer($questionnaireId))
            $this->ControleReponseTest($questionnaireId);
    }


    /**
     * Valide la conformité d'un test
     *
     * @param int $testId : L'ID du test à analyser
     * @param bool $forceAnalyse : Force l'analyse d'un questionnaire même si celui-ci n'est pas terminé
     */
    public function validationConformite(int $testId)
    {
        $test = Test::whereId($testId)->first();
        Test::where('questionnaire_id', $test->questionnaire_id)->update(['is_conforme' => true]);
    }

    /**
     *verifier que tous les test son terminé
     *@return boolean vrais si il son terminer
     */
    public function TousTestsTerminer(int $questionnaireId): bool
    {
        $tests = Test::where('questionnaire_id', $questionnaireId)->get();
        return $tests->every(function ($test) {
            return $test->is_finish;
        });
    }

    public function storeCounterTest(Request $request)
    {
        $validatedData = $request->validate([
            'libelle' => 'required|string',
            'questionnaire_id' => 'required|string|exists:questionnaires,id',
            'stage_id' => 'required|string|exists:stages,id',
            'is_counter_test' => 'boolean',
            'date' => 'required|date',
            'stagiaires' => 'required|array', // Liste des stagiaires
            'stagiaires.*' => 'exists:users,id', // Chaque stagiaire doit exister
        ]);

        $stagiaires = $validatedData['stagiaires'];

        // Créer un test pour chaque stagiaire
        foreach ($stagiaires as $stagiaireId) {
            Test::create([
                'libelle' => $validatedData['libelle'],
                'questionnaire_id' => $validatedData['questionnaire_id'],
                'stage_id' => $validatedData['stage_id'],
                'user_id' => $stagiaireId,
                'is_counter_test' => $validatedData['is_counter_test'],
                'date' => $validatedData['date'],
            ]);
        }

        return response()->json([
            'message' => 'Contre-test créé avec succès.',
            'stagiaires' => $stagiaires,
        ], 201);
    }


    /**
     * Contrôle les réponses pour tous les tests d'un questionnaire.
     * Si 75% des réponses ne sont pas bonnes pour une question, change le statut de la question en "Vigilance".
     *
     * @param int $questionnaireId
     * @return void
     */
    public function controleReponseTest(int $questionnaireId)
    {
        $userObservation = null;
        $admUser = null;
        if (Auth::user()->role->abrege == "ADM") {
            $admUser = Auth::user();
        } else {
            $admUser = User::whereRoleId(4)->first();
        }
        $userObservation = "{$admUser->grade->abrege} {$admUser->nom} {$admUser->prenom}";


        // Récupérer toutes les questions du questionnaire
        $questions = Question::whereHas('questionnaires', function ($query) use ($questionnaireId) {
            $query->where('questionnaire_id', $questionnaireId);
        })->get();

        // Pour chaque question, vérifier les réponses
        foreach ($questions as $question) {
            $totalResponses = Reponse::where('question_id', $question->id)->count();
            $badResponses = Reponse::where('question_id', $question->id)->where('is_good_answer', false)->count();

            if ($totalResponses > 0 && ($badResponses / $totalResponses) >= 0.75) {
                // Si 75% ou plus des réponses sont mauvaises, changer le statut en "Vigilance"
                $question->statut_id = Statut::where('libelle', 'Vigilance')->first()->id;

                ObservationQuestionController::createObservation(['question_id' => $question->id, 'observation' => "Vigilance {$questionnaireId}", 'user' => $userObservation]);
                $question->save();
            }
        }
    }

    public function getTestsConsultationStage(int $testId)
    {
        return TestConsultStageRowExpandResource::collection(Test::find($testId)->questionnaire->testsAffichageStage);
    }

    /**
     * Récupération et calcule des moyennes par modules pour le test en paramètre.
     *
     * @param int $testId
     * @return\Illuminate\Http\JsonResponse
     */
    public function getModuleAverageByTest(int $testId): \Illuminate\Http\JsonResponse
    {
        // Récupération du test et du nom du questionnaire
        $test = Test::find($testId);
        try {
            // Récupération du nom du test
            $nomTest = $this->getTestNameByQuestionnaireName($test->questionnaire->nom);
            // Récupération de l'id de la formation
            $idFormation = $this->getFormationIdByQuestionnaireName($test->questionnaire->nom);
            // Récupération des cours
            $arrayModules = $this->constructArrayModulesByFormationIdAndTestName($idFormation, $nomTest);
            // Récupération de les moyennes par module
            //  ! TODO : RETIRER LES MODULES QUI NE SONT PAS DANS LE TEST
            $arrayMoyennesModules = $this->calculateModulesAverage($test, $arrayModules);
        } catch (Exception $e) {
            Log::error("TestController::getModuleAverageByTest. Test id : $testId. Error : '{$e->getMessage()}'");
            return response()->json([
                'message' => 'Erreur lors de la récupération du nom du test.',
                'id_test' => $testId,
                'details' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Success',
            'modules' => $arrayMoyennesModules->toArray()
        ], 200);
    }

    /**
     * Retourne la liste des modules pour la formation et le nom du test en paramètres.
     *
     * @param int $idFormation : L'id de la formation
     * @param string $nomTest : Le nom du test
     * @return Collection : La liste des modules pour cette formation et ce test
     */
    private function constructArrayModulesByFormationIdAndTestName(int $idFormation, string $nomTest): Collection
    {
        $arrayModules = null;
        // Récupération de la liste des IDs des chapitres pour cette formation
        $chapitresIds = Chapitre::whereFormationId($idFormation)->get()->pluck('id');
        // Récupération de la liste des IDs des sous-chapitres pour ces chapitres
        $sousChapitresIds = Chapitre::whereIn('chapitre_sup_id', $chapitresIds)->get()->pluck('id');
        // Récupération de la liste des modules pour ce test et ces sous-chapitres
        $arrayModules = Cours::whereIn('sous_chapitre_id', $sousChapitresIds)->whereTest($nomTest)->get()->groupBy('module');

        if ($arrayModules->count() == 0)
            throw new Exception('La liste des modules est vide.');

        return $arrayModules;
    }


    /**
     * Retourne le nom du test en fonction du nom du qestionnaire en paramètre.
     *
     * @param string $questionnaireName : Le nom du questionnaire
     * @return string : le nom du test
     */
    private function getTestNameByQuestionnaireName($questionnaireName): string
    {
        $nomTest = null;
        // Récupération des noms des différents tests existants
        $arrayLibellesTests = Cours::distinct('test')->get()->pluck('test')->map(function ($libelleTest) {
            return str_replace(' ', '_', $libelleTest);
        });

        // Récupération du nom du test pour le test en cours
        $arrayLibellesTests->each(function ($libelleTest) use (&$nomTest, $questionnaireName) {
            if (preg_match("/_" . preg_quote($libelleTest, '/') . "_/", $questionnaireName)) {
                $nomTest = str_replace('_', ' ', $libelleTest);
                return false;
            }
        });

        if (is_null($nomTest))
            throw new Exception('Le nom du test est null.');

        return $nomTest;
    }

    /**
     * Retourne l'id de la formation en fonction du nom du questionnaire en paramètre.
     *
     * @param string $questionnaireName : Le nom du questionnaire
     * @return int : L'id de la formation
     */
    private function getFormationIdByQuestionnaireName($questionnaireName): int
    {
        $idFormation = null;
        // Récupération des noms des formations
        $arrayLibellesFormations = Formation::all()->pluck('libelle')->map(function ($libelleFormation) {
            return str_replace(' ', '_', $libelleFormation);
        });

        // Récupération du nom de la formation concernée par le test en cours
        $arrayLibellesFormations->each(function ($libelleFormation) use (&$idFormation, $questionnaireName) {
            if (str_contains($questionnaireName, $libelleFormation)) {
                $idFormation = Formation::whereLibelle(str_replace('_', ' ', $libelleFormation))->first()->id;
                return false;
            }
        });

        if (is_null($idFormation))
            throw new Exception('L\'id de la formation est null.');

        return $idFormation;
    }

    /**
     *  Retourne la liste DES modules contenant les listes de chaque module avec la moyenne associée et les ids des questions.
     *
     * Le squellette est le suivant :
     *
     * [
     *  '0' => [
     *           'test_id' => $testId,
     *           'module' => $moduleName,
     *           'moyenne' => $calculatedAverage,
     *           'questions_id' => [$idQuestionOne, $idQuestionTwo,...]
     *         ]
     *  '1' => [
     *           'test_id' => $testId,
     *           'module' => $moduleName,
     *           'moyenne' => $calculatedAverage,
     *           'questions_id' => [$idQuestionOne, $idQuestionTwo,...]
     *         ]
     *   ...
     * ]
     *
     *
     * @param Test $test : Le test en cours de traitement
     * @param Collection $arrayModules : La liste des modules (contenant les cours)
     *
     * @return Collection
     */
    private function calculateModulesAverage(Test $test, Collection $arrayModules): Collection
    {
        $arrayMoyennesModules = collect();

        $arrayModule = null;

        // Itération sur la liste des moodules
        $arrayModules->each(function ($arrayCours, string $key) use (&$arrayMoyennesModules, &$arrayModule, $test) {
            $arrayModule = collect(['test_id' => $test->id]);
            $arrayQuestionsIds = collect();
            $nbGoodAnswers = 0;
            $nbAnswers = 0;
            // Itération sur la liste des cours du module
            $arrayCours->each(function ($cours) use (&$nbGoodAnswers, &$nbAnswers, &$arrayQuestionsIds, $test) {
                // Itération sur la liste des réponses du test
                $test->reponses->each(function ($reponse) use (&$nbGoodAnswers, &$nbAnswers, &$arrayQuestionsIds, $cours) {
                    // Si la question concerne le cours en cours de traitement
                    if (str_contains($cours->ata, $reponse->question->ata)) {
                        // Si la réponse est bonne : incrémentation des bonens réponses
                        if ($reponse->is_good_answer)
                            $nbGoodAnswers++;

                        // Ajout de l'id de la question dans la liste des ids des questions
                        $arrayQuestionsIds->push($reponse->question->id);
                        // Incrémentation du nombre de réponse
                        $nbAnswers++;
                    }
                });
            });
            // Ajout du module dans la liste du module
            $arrayModule->put('module', $key);
            // Ajout de la moyenne dans la liste du module
            $moyenneModule = $nbAnswers > 0 ? number_format(round($nbGoodAnswers / ($nbAnswers / 100), 4), 4) : 0;
            $arrayModule->put('reussite', $moyenneModule);
            // Ajout de la liste des ids des questions dans la liste du module
            $arrayModule->put('questions_id', $arrayQuestionsIds);
            if($arrayQuestionsIds->count() > 0)
                // Ajout de la liste du module dans la liste DES modules
                $arrayMoyennesModules->push($arrayModule->toArray());
        });

        return $arrayMoyennesModules;
    }

    /**
 * Récupère tous les tests déjà terminés.
 */
public function testsTerminer()
{
    $today = now()->toDateString(); // Obtient la date du jour

    return TestResource::collection(
        Test::where(function ($query) use ($today) {
                $query->whereDate('date', '<', $today)
                      ->orWhere('is_finish', true);
            })
            ->distinct('libelle')
            ->get()
    );
}

/**
 * Récupère tous les tests à venir.
 */
public function testsAVenir()
{
    $today = now()->toDateString(); // Obtient la date du jour

    return TestResource::collection(
        Test::whereDate('date', '>', $today)
            ->where('is_finish', false) // On ne prend que les tests non terminés
            ->distinct('libelle')
            ->get()
    );
}

/**
 * Récupère tous les tests en cours.
 */
public function testsEnCours()
{
    $today = now()->toDateString(); // Obtient la date du jour

    return TestResource::collection(
        Test::whereDate('date', '=', $today)
            ->where('is_finish', false) // On ne prend que les tests non terminés
            ->distinct('libelle')
            ->get()
    );
}
}
