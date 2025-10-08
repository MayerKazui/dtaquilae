<?php

use App\Http\Controllers\Api\Common\FileController;
use App\Http\Controllers\Api\Evaluation\RessourceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Common\SearchBar;
use App\Http\Controllers\CRResultatsController;
use App\Http\Controllers\Api\Evaluation\TestController;
use App\Http\Controllers\Api\Formation\CoursController;
use App\Http\Controllers\Api\Formation\StageController;
use App\Http\Controllers\Api\Referentiel\RoleController;
use App\Http\Controllers\Api\Referentiel\GradeController;
use App\Http\Controllers\Api\Evaluation\ReponseController;
use App\Http\Controllers\Api\Formation\ChapitreController;
use App\Http\Controllers\Api\Evaluation\QuestionController;
use App\Http\Controllers\Api\Referentiel\FormationController;
use App\Http\Controllers\Api\Evaluation\QuestionnaireController;
use App\Http\Controllers\Api\Referentiel\NiveauTaxinomiqueController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::prefix('/ressources')->group(function () {
    Route::get('/urls/{idQuestion}', [RessourceController::class, 'getUrls']);
    Route::get('/download', [RessourceController::class, 'download'])->name('download');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/searchBar', [SearchBar::class, 'getItems']);

    // ! Les routes "customs" doivent être placées avant les "apiResources"
    Route::prefix('/users')->group(function () {
        Route::get('/export', [UserController::class, 'export'])->middleware('access.control:user.consult');
        Route::get('/actif/{type}', [UserController::class, 'usersActif'])->middleware('access.control:user.consult');
        Route::put('/activer/{id}', [UserController::class, 'active'])->middleware('access.control:user.update');
        Route::get('/construct-login/{firstName}/{lastName}/{id?}', [UserController::class, 'implementeLogin'])->middleware('access.control:user.create');
    });

    Route::prefix('/stages')->group(function () {
        Route::get('/stagiaire/{debut}/{fin}', [StageController::class, 'stagiairesSansStageEntreDates'])->middleware('access.control:stage.create,stage.update,stage.consult');
        Route::get('/directeur/{debut}/{fin}/{id}', [StageController::class, 'directeurSansStageEntreDates'])->middleware('access.control:stage.create,stage.update,stage.consult');
        Route::get('/directeur/{debut}/{fin}', [StageController::class, 'directeurSansStageEntreDates'])->middleware('access.control:stage.create,stage.update,stage.consult');
        Route::get('/adjoint/{debut}/{fin}/{id}', [StageController::class, 'adjointSansStageEntreDates'])->middleware('access.control:stage.create,stage.update,stage.consult');
        Route::get('/adjoint/{debut}/{fin}', [StageController::class, 'adjointSansStageEntreDates'])->middleware('access.control:stage.create,stage.update,stage.consult');
        Route::get('/encours', [StageController::class, 'stagesEnCours'])->middleware('access.control:stage.search');
        Route::get('/avenir', [StageController::class, 'stagesAVenir'])->middleware('access.control:stage.search');
        Route::get('/terminer', [StageController::class, 'stagesTerminer'])->middleware('access.control:stage.search');
    });

    Route::get('/chapitres/{chapitre}/sous-chapitres', [ChapitreController::class, 'getSousChapitres'])->middleware('access.control:question.create,question.update');

    Route::prefix('/cours')->group(function () {
        Route::get('/{sous_chapitre}', [CoursController::class, 'getSousChapitres'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('/atas/getAll', [CoursController::class, 'getAtas']);
    });

    Route::prefix('/questionnaires')->group(function () {
        Route::get('/formation/{formation_id}', [QuestionnaireController::class, 'getNomTestParFormation'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('/test/{formation_id}/{test?}/{modules?}', [QuestionnaireController::class, 'getConstructionQuestionnaire'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('/stagiaire/{debut}/{fin}', [QuestionnaireController::class, 'stagiairesSansStageEntreDates'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('/questionnairePDF/{id}', [QuestionnaireController::class, 'generatePDF'])->middleware('access.control:questionnaire.search');
        Route::get('/sansTest/{stageId}/{hasContreTest}', [QuestionnaireController::class, 'getQuestionnairesByStage'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('/testStagiaire/{testId}', [QuestionnaireController::class, 'getQuestionnaireByTest']);
        Route::get('/module/{formation_id}', [QuestionnaireController::class, 'getModulesParFormation'])->middleware('access.control:questionnaire.create,questionnaire.update');
        Route::get('enCours', [QuestionnaireController::class, 'getQuestionnairesEnCours'])->middleware('access.control:questionnaire.consult');
        Route::get('archiver', [QuestionnaireController::class, 'getQuestionnairesArchiver'])->middleware('access.control:questionnaire.consult');

        //  Route::get('/sansTest', [QuestionnaireController::class, 'getdQuestionnairesSansTest']);
    });

    Route::prefix('/questions')->group(function () {
        Route::get('/actif/{type}', [QuestionController::class, 'questionsActif'])->middleware('access.control:question.consult,question.create,question.search');
        Route::put('/activer/{id}', [QuestionController::class, 'active']);
        Route::put('/desactiver/{id}', [QuestionController::class, 'desactiver']);
        Route::put('/desarchiver/{id}', [QuestionController::class, 'desarchiver']);
        Route::post('/verifierVigilance/{id}', [QuestionController::class, 'verifierVigilance']);
        Route::put('/refuser/{id}', [QuestionController::class, 'refuser']);
        Route::get('/test/saisieManuelle/{idTest}', [QuestionController::class, 'getQuestionsByTest']);
    });

    Route::prefix('/stages')->group(function () {
        Route::get('/CRResultat/{stageId}/test/{testId}', [CRResultatsController::class, 'generatePDF']);
    });

    Route::prefix('/tests')->group(function () {
        Route::get('/saisieManuelle/{id}', [TestController::class, 'saisieManuelle'])->middleware('access.control:test.edit');
        Route::get('/getTests', [TestController::class, 'getTestsByUser']);
        Route::post('/terminerTest/{id}', [TestController::class, 'terminerTest']);
        Route::get('/stageConsultation/{id}', [TestController::class, 'getTestsConsultationStage']);
        Route::put('/analyse/{questionnaireId}/{forceAnalyse}', [TestController::class, 'analyseQuestions']);
        Route::put('/conforme/{questionnaireId}', [TestController::class, 'validationConformite'])->middleware('access.control:test.conforme');
        Route::post('/storeCounterTest', [TestController::class, 'storeCounterTest']);
        Route::get('/calculer-moyenne-modules/{testId}', [TestController::class, 'getModuleAverageByTest']);
        Route::get('/status/encours', [TestController::class, 'testsEnCours'])->middleware('access.control:stage.search');
        Route::get('/status/avenir', [TestController::class, 'testsAVenir'])->middleware('access.control:stage.search');
        Route::get('/status/terminer', [TestController::class, 'testsTerminer'])->middleware('access.control:stage.search');
    });

    Route::prefix('/ressources')->group(function () {
        Route::delete('/delete/{imageName}', [RessourceController::class, 'delete']);
    });

    Route::prefix('/reponses')->group(function () {
        Route::get('/stage/{idTest}/{questionsId}', [ReponseController::class, 'getByTestAndQuestionsId']);
        Route::post('/saisieManuelle', [ReponseController::class, 'storeReponseSaisieManuelle']);
    });


    // * Les prochaines routes APIs seront placées à la suite
    Route::apiResources([
        'users' => UserController::class,
        'questions' => QuestionController::class,
        'chapitres' => ChapitreController::class,
        'grades' => GradeController::class,
        'roles' => RoleController::class,
        'niveauTax' => NiveauTaxinomiqueController::class,
        'cours' => CoursController::class,
        'stages' => StageController::class,
        'questionnaires' => QuestionnaireController::class,
        'formation' => FormationController::class,
        'tests' => TestController::class,
        'reponse' => ReponseController::class,
        'ressources' => RessourceController::class
    ]);
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);


