<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Models\Evaluation\Test;
use App\Models\Formation\Cours;
use App\Models\Formation\Stage;
use App\Models\Referentiel\Formation;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Evaluation\Reponse;
use App\Models\Formation\Chapitre;
use App\Models\Evaluation\Question;
use App\Helpers\AccessControlHelper;
use App\Http\Controllers\Controller;
use App\Models\Evaluation\Questionnaire;
use App\Http\Resources\Formation\CoursResource;
use App\Http\Requests\StoreQuestionnaireRequest;
use App\Http\Requests\UpdateQuestionnaireRequest;
use App\Http\Resources\QuestionnaireStagiaireResource;
use App\Http\Resources\Evaluation\QuestionnaireResource;
use App\Http\Resources\Evaluation\QuestionnaireDatatableResource;
use App\Http\Resources\Evaluation\QuestionnaireConsultationResource;

class QuestionnaireController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        AccessControlHelper::check('questionnaire.search')->authorize();
        return QuestionnaireDatatableResource::collection(
            Questionnaire::query()->orderBy('id', 'asc')->get()
        );
    }

    public function store(StoreQuestionnaireRequest $request)
    {
        AccessControlHelper::check('questionnaire.create')->authorize();
        $validatedData = $request->validated();
        $selectedTest = $validatedData['selectedTest'];
        $selectedModules = $validatedData['selectedModules'];
        $selectedFormation = $validatedData['selectedFormation'];
        $date = now()->format('dmYHis');
        $formationName = str_replace(' ', '_', $selectedFormation);
        if ($selectedTest != null) {
            $testName = str_replace(' ', '_', $selectedTest);
            $nomQuestionnaire = $formationName . "_" . $testName . "_" . $date;
        } else {
            $formation = Formation::whereLibelle($selectedFormation)->first();
            $chapitresIds = Chapitre::whereFormationId($formation->id)->get()->pluck('id');
            $sousChapitresIds = Chapitre::whereIn('chapitre_sup_id', $chapitresIds)->get()->pluck('id');
            $nomTest = str_replace(' ', '_', Cours::whereIn('sous_chapitre_id', $sousChapitresIds)->whereIn('module', $selectedModules)->first()->test);
            // Cas avec des modules
            $nomQuestionnaire = $formationName . "_ContreTest_" . $nomTest . "_" . $date;
        }

        $questionnaire = new Questionnaire([
            'nom' => $nomQuestionnaire,
            'formation_id' => $validatedData['selectedFormationId'],
            'date' => now()->format('d/m/Y'),
            'is_active' => false,
        ]);
        $questionnaire->save();

        foreach ($validatedData['coursParSousChapitre'] as $sousChapitreKey => $coursList) {
            foreach ($coursList as $cours) {
                $nb_questions_ref = $cours['nb_questions_ref'];
                $niveau = $cours['niveau'];
                $atas = $cours['ata'];

                // Appel de la fonction pour attacher les questions au questionnaire pour les questions de base
                $this->ajoutQuestions($niveau, $nb_questions_ref, $atas, $questionnaire);
                // Appel de la fonction pour attacher les questions au questionnaire pour les questions bonus
                if (isset($validatedData['selectedOptions'][$cours['id']])) {
                    $selectedOption = $validatedData['selectedOptions'][$cours['id']];
                    $nbQuestionsToAdd = $cours['nb_questions'] - $cours['nb_questions_ref'];
                    // Vérifier si des questions supplémentaires doivent être ajoutées
                    if ($nbQuestionsToAdd > 0) {
                        switch ($selectedOption) {
                            case 'random':
                                $nbQuestionNiveauUn = 0;
                                $nbQuestionNiveauTrois = 0;
                                $randomNumberQuestionToAdd = random_int(1, $nbQuestionsToAdd);
                                $questionNiveauUnFirst = (bool) random_int(0, 1);
                                if ($questionNiveauUnFirst) {
                                    $nbQuestionNiveauUn = $randomNumberQuestionToAdd <= $cours['questionsNiveauUn'] ? random_int(1, $randomNumberQuestionToAdd) : $cours['questionsNiveauUn'];
                                    $this->ajoutQuestions(1, $nbQuestionNiveauUn, $atas, $questionnaire);
                                    $nbQuestionNiveauTrois = $nbQuestionsToAdd - $nbQuestionNiveauUn;
                                    if ($nbQuestionNiveauTrois > 0)
                                        $this->ajoutQuestions(3, $nbQuestionNiveauTrois, $atas, $questionnaire);
                                } else {
                                    $nbQuestionNiveauTrois = $randomNumberQuestionToAdd <= $cours['questionsNiveauTrois'] ? random_int(1, $randomNumberQuestionToAdd) : $cours['questionsNiveauTrois'];
                                    $this->ajoutQuestions(3, $nbQuestionNiveauTrois, $atas, $questionnaire);
                                    $nbQuestionNiveauUn = $nbQuestionsToAdd - $nbQuestionNiveauTrois;
                                    if ($nbQuestionNiveauUn > 0)
                                        $this->ajoutQuestions(1, $nbQuestionNiveauUn, $atas, $questionnaire);
                                }
                                break;
                            case '1':
                                $this->ajoutQuestions(1, $nbQuestionsToAdd, $atas, $questionnaire);
                                break;
                            case '3':
                                $this->ajoutQuestions(3, $nbQuestionsToAdd, $atas, $questionnaire);
                                break;
                        }
                    }
                }
            }
        }

        return response(["idQuestionnaire" => $questionnaire->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Questionnaire $questionnaire)
    {
        AccessControlHelper::check('questionnaire.consult')->authorize();
        $questionnaire->supprimable = $this->isSupprimable($questionnaire->id);

        $ressourceController = new RessourceController();

        foreach ($questionnaire->questions as $question) {
            $question->images = $ressourceController->getUrls($question->id); // Ajouter les URLs des images
            $ata = substr($question->numero_question, -9, -1);
            $arraySousChapitreIds = collect();
            Chapitre::whereFormationId($questionnaire->formation_id)->get()->map(function ($chapitre) use (&$arraySousChapitreIds) {
                $arraySousChapitreIds->push($chapitre->sousChapitres()->pluck('id'));
            });
            $arraySousChapitreIds = $arraySousChapitreIds->flatten();
            $question->libelle_cours = Cours::where('ata', 'like', "%$ata%")->whereIn('sous_chapitre_id', $arraySousChapitreIds)->pluck('libelle')->first();
        }

        return new QuestionnaireConsultationResource($questionnaire);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionnaireRequest $request, Questionnaire $questionnaire)
    {
        AccessControlHelper::check('questionnaire.update')->authorize();
    }

    // /**
    //  * Remove the specified resource from storage.
    //  */
    // public function destroy(Questionnaire $questionnaire)
    // {
    //     AccessControlHelper::check('questionnaire.delete')->authorize();

    //     foreach ($questionnaire->questions()->get() as $question) {
    //         // Inverser la valeur de $question->is_used
    //         $question->is_used = !$question->is_used;
    //         $question->save();
    //     }
    //     $questionnaire->questions()->detach();
    //     $questionnaire->delete();
    // }

    public function destroy(Questionnaire $questionnaire)
    {
        AccessControlHelper::check('questionnaire.delete')->authorize();

        foreach ($questionnaire->questions()->get() as $question) {
            // Inverser la valeur de $question->is_used
            $question->is_used = !$question->is_used;

            // Décrémenter nb_utilisation si sa valeur est supérieure à 0
            if ($question->nb_utilisation > 0) {
                $question->decrement('nb_utilisation');
            }

            $question->save();
        }

        // Détacher les relations entre le questionnaire et les questions
        $questionnaire->questions()->detach();

        // Supprimer le questionnaire
        $questionnaire->delete();
    }

    public function getNomTestParFormation($formation_id)
    {
        $chapitres = Chapitre::whereFormation_id($formation_id)->get();
        $testsUniques = [];
        foreach ($chapitres as $chapitre) {
            $sousChapitres = $chapitre->sousChapitres()->get();
            $tests = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))->distinct('test')->pluck('test');
            $testsUniques = array_merge($testsUniques, $tests->toArray());
        }
        return $testsUniques;
    }

    // public function getConstructionQuestionnaire($formation_id, $test, $modules)
    // {
    //     $chapitres = Chapitre::whereFormation_id($formation_id)->get();
    //     $sousChapitres = [];
    //     foreach ($chapitres as $chapitre) {
    //         $sousChapitres = $chapitre->sousChapitres()->get();
    //         $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))
    //             ->whereTest($test)
    //             ->with('sousChapitre')
    //             ->get();
    //         foreach ($cours as $coursIteration) {
    //             $listeQuestions = collect();
    //             foreach (explode("\n", $coursIteration->ata) as $ata) {
    //                 $listeQuestions->push(Question::where("ata", "like", "%$ata%")->where('statut_id', 2)->get());
    //             }
    //             $coursIteration->questionsNiveauUn = $listeQuestions->flatten()->where('niveau', 1)->count();
    //             $coursIteration->questionsNiveauTrois = $listeQuestions->flatten()->where('niveau', 3)->count();
    //         }
    //         if (!$cours->isEmpty()) {
    //             break;
    //         }
    //     }
    //     return CoursResource::collection($cours);
    // }


    //     public function getConstructionQuestionnaire($formation_id, $test = null, $modules = null)
    // {
    //     // Récupération des chapitres associés à la formation
    //     $chapitres = Chapitre::whereFormation_id($formation_id)->get();
    //     $cours = collect(); // Collection pour stocker les cours

    //     // Vérifier si on filtre par test ou par modules
    //     if ($test) {
    //         // Logique actuelle : récupération basée sur le test
    //         foreach ($chapitres as $chapitre) {
    //             $sousChapitres = $chapitre->sousChapitres()->get();
    //             $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))
    //                 ->whereTest($test)
    //                 ->with('sousChapitre')
    //                 ->get();

    //             foreach ($cours as $coursIteration) {
    //                 $listeQuestions = collect();
    //                 foreach (explode("\n", $coursIteration->ata) as $ata) {
    //                     $listeQuestions->push(
    //                         Question::where("ata", "like", "%$ata%")->where('statut_id', 2)->get()
    //                     );
    //                 }
    //                 $coursIteration->questionsNiveauUn = $listeQuestions->flatten()->where('niveau', 1)->count();
    //                 $coursIteration->questionsNiveauTrois = $listeQuestions->flatten()->where('niveau', 3)->count();
    //             }

    //             if (!$cours->isEmpty()) {
    //                 break; // Si des cours ont été trouvés, on arrête la boucle
    //             }
    //         }
    //     } elseif ($modules) {
    //         // Nouvelle logique : récupération basée sur les modules
    //         $moduleValues = explode(',', $modules); // Convertir la chaîne de modules en tableau
    //         foreach ($chapitres as $chapitre) {
    //             $sousChapitres = $chapitre->sousChapitres()->get();
    //             $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))
    //                 ->whereIn('module', $moduleValues) // Filtrer par les modules
    //                 ->with('sousChapitre')
    //                 ->get();

    //             foreach ($cours as $coursIteration) {
    //                 $listeQuestions = collect();
    //                 foreach (explode("\n", $coursIteration->ata) as $ata) {
    //                     $listeQuestions->push(
    //                         Question::where("ata", "like", "%$ata%")->where('statut_id', 2)->get()
    //                     );
    //                 }
    //                 $coursIteration->questionsNiveauUn = $listeQuestions->flatten()->where('niveau', 1)->count();
    //                 $coursIteration->questionsNiveauTrois = $listeQuestions->flatten()->where('niveau', 3)->count();
    //             }

    //             if (!$cours->isEmpty()) {
    //                 break; // Si des cours ont été trouvés, on arrête la boucle
    //             }
    //         }
    //     }

    //     // Retourner la liste des cours sous forme de ressource
    //     return CoursResource::collection($cours);
    // }

    public function getConstructionQuestionnaire($formation_id, $test = null, $modules = null)
    {

        // Récupération des chapitres associés à la formation
        $chapitres = Chapitre::whereFormation_id($formation_id)->get();

        $cours = collect(); // Collection pour stocker les cours
        if ($test != 'null') {
            foreach ($chapitres as $chapitre) {
                $sousChapitres = $chapitre->sousChapitres()->get();

                $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))
                    ->whereTest($test)
                    ->with('sousChapitre')
                    ->get();

                $this->getQuestions($cours);

                if (!$cours->isEmpty()) {
                    break;
                }
            }
        } elseif ($modules) {
            $moduleValues = explode(',', $modules);

            foreach ($chapitres as $chapitre) {
                $sousChapitres = $chapitre->sousChapitres()->get();

                $cours = Cours::whereIn('sous_chapitre_id', $sousChapitres->pluck('id'))
                    ->whereIn('module', $moduleValues)
                    ->with('sousChapitre')
                    ->get();

                $this->getQuestions($cours);

                if (!$cours->isEmpty()) {
                    break;
                }
            }
        }

        return CoursResource::collection($cours);
    }

    //methode pour recuperation des module de la formation pour la creation d'un contre test
    public function getModulesParFormation($formation_id)
    {
        // Charger les chapitres avec leurs sous-chapitres et cours en une seule requête
        $chapitres = Chapitre::where('formation_id', $formation_id)
            ->with(['sousChapitres.cours'])
            ->get();

        // Collecter tous les modules uniques à partir des cours
        $modules = $chapitres->flatMap(function ($chapitre) {
            return $chapitre->sousChapitres->flatMap(function ($sousChapitre) {
                return $sousChapitre->cours->pluck('module'); // Extraire uniquement le module
            });
        })->unique()->values(); // Supprimer les doublons et réindexer la collection

        // Retourner la liste des modules uniques
        return response()->json($modules);
    }

    public function generatePDF(string $id)
    {
        // Récupérer le questionnaire avec les questions associées
        $questionnaire = Questionnaire::with('questions')->findOrFail($id);

        $compteur = 1;

        foreach ($questionnaire->questions as $question) {
            $question->compteur = $compteur++;
        }
        $dureeQuestionnaire = $this->calculateDureeQuestionnaire($questionnaire);
        // Conversion de la durée du test
        $heures = floor($dureeQuestionnaire / 3600);
        $minutes = floor(($dureeQuestionnaire % 3600) / 60);
        $secondes = $dureeQuestionnaire % 60;

        if ($heures > 0) {
            $duree_formatee = sprintf("%d:%02d:%02d", $heures, $minutes, $secondes);
        } else {
            $duree_formatee = sprintf("%02d:%02d", $minutes, $secondes);
        }
        // Compilation des données pour la vue
        $data = [
            'questionnaire' => $questionnaire,
            'questions' => $questionnaire->questions,
            'duree_test'=> $duree_formatee,
        ];

        // partie pdf
        $pdf = Pdf::loadView('QuestionnairePDF', $data);

        // Définir le papier en mode paysage (landscape)
        $pdf->setPaper('a4', 'portrait');

        $pdf->render();
        $base64EncodePdf = base64_encode($pdf->output());
        $response = [
            'pdfData' => $base64EncodePdf,
            'contentType' => 'application/pdf'
        ];
        return response()->json($response);
    }
    private function getQuestions($cours)
    {
        foreach ($cours as $coursIteration) {
            $listeQuestions = collect();
            foreach (explode("\n", $coursIteration->ata) as $ata) {
                $listeQuestions->push(Question::where("ata", "like", "%$ata%")->where('statut_id', 2)->get());
            }
            $coursIteration->questionsNiveauUn = $listeQuestions->flatten()->where('niveau', 1)->count();
            $coursIteration->questionsNiveauTrois = $listeQuestions->flatten()->where('niveau', 3)->count();
        }
        return $cours;
    }

    private function isSupprimable($questionnaireId)
    {
        $tests = Test::whereQuestionnaireId($questionnaireId)->get();
        if ($tests->isEmpty()) {
            return true;
        } else {
            return false;
        }
    }
    private function ajoutQuestions($niveau, $nb_questions_ref, $atas, $questionnaire)
    {
        // Sélectionner les questions non utilisées
        $questionsNonUtilisees = collect();
        $arrayAtas = explode("\n", $atas);
        foreach ($arrayAtas as $ata) {
            $questionsNonUtilisees->push(
                Question::where('ata', 'like', "%$ata%")
                    ->whereNiveau($niveau)
                    ->whereStatutId(2)
                    ->whereIsUsed(false)
                    ->get()
            );
        }
        $questionsNonUtilisees = $questionsNonUtilisees->flatten();
        $questionsAUtiliser = collect();

        if ($questionsNonUtilisees->count() >= $nb_questions_ref) {
            // Si suffisamment de questions non utilisées sont disponibles
            $questionsAUtiliser = $questionsNonUtilisees->random($nb_questions_ref);
        } else {
            // Si pas assez de questions non utilisées, réutiliser certaines questions
            $questionsAUtiliser = $questionsNonUtilisees;

            $nbQuestionsManquantes = $nb_questions_ref - $questionsNonUtilisees->count();
            $questionsReutilisees = collect();

            foreach ($arrayAtas as $ata) {
                $questionsReutilisees->push(
                    Question::where('ata', 'like', "%$ata%")
                        ->whereNiveau($niveau)
                        ->whereStatutId(2)
                        ->whereIsUsed(true)
                        ->inRandomOrder()
                        ->limit($nbQuestionsManquantes)
                        ->get()
                );
            }

            $questionsReutilisees = $questionsReutilisees->flatten();
            foreach ($questionsReutilisees as $question) {
                $question->is_used = false;
                $question->save();
            }

            $questionsAUtiliser = $questionsAUtiliser->merge($questionsReutilisees)->random($nb_questions_ref);
        }

        // Associer les questions sélectionnées au questionnaire et mettre à jour is_used et nb_utilisation
        foreach ($questionsAUtiliser as $question) {
            $questionnaire->questions()->attach($question->id);
            $question->increment('nb_utilisation'); // Incrémente le compteur d'utilisation
            $question->is_used = true; // Met à jour le statut d'utilisation
            $question->save();
        }
    }
    /**
     * questionnaine qui ne sont pas lier a un test
     */
    public function getdQuestionnairesSansTest()
    {

        $unusedQuestionnaires = Questionnaire::doesntHave('tests')->get();

        return QuestionnaireResource::collection($unusedQuestionnaires);
    }

    /**
     *
     */
    // public function getQuestionnairesByStage($stageId)
    // {
    //     // Retourner les questionnaires sous forme de ressource
    //     return QuestionnaireResource::collection(Questionnaire::whereFormationId(Stage::find($stageId)->formation->id)
    //         ->whereDoesntHave('tests')->get());
    // }
    public function getQuestionnairesByStage($stageId, $hasContreTest)
    {
        // Récupérer l'ID de la formation associée au stage
        $formationId = Stage::find($stageId)->formation->id;

        // Construire la requête de base
        $query = Questionnaire::whereFormationId($formationId)
            ->whereDoesntHave('tests'); // Exclure ceux ayant des tests

        // Appliquer le filtre basé sur le booléen $hasContreTest
        if ($hasContreTest == "true") {
            $query->where('nom', 'LIKE', '%_ContreTest_%'); // Rechercher uniquement les questionnaires contenant "_ContreTest_"
        } else {
            $query->where('nom', 'NOT LIKE', '%_ContreTest_%'); // Rechercher ceux qui ne contiennent pas "_ContreTest_"
        }

        // Retourner les questionnaires sous forme de ressource
        return QuestionnaireResource::collection($query->get());
    }

    /**
     *
     */
    public function getQuestionnaireByTest(int $testId)
    {
        // Récupérer le test
        $test = Test::findOrFail($testId);

        // Récupérer le questionnaire lié à ce test
        $questionnaire = $test->questionnaire;
        $questionnaire->nomTest = $test->libelle;

        // Calculer la durée du questionnaire
        $dureequestionnaire = $this->calculateDureeQuestionnaire($questionnaire);

        // Récupérer les réponses du stagiaire pour ce test
        $reponsesStagiaire = Reponse::where('test_id', $testId)
            ->where('user_id', $test->user_id)
            ->get()
            ->keyBy('question_id');

        // Ajouter les réponses du stagiaire aux questions
        $questionnaire->questions->each(function ($question) use ($reponsesStagiaire) {
            $question->reponseStagiaire = $reponsesStagiaire->get($question->id);
        });

        // Mélanger les questions aléatoirement
        $shuffledQuestions = $questionnaire->questions->shuffle();

        // Remplacer les questions du questionnaire par celles mélangées
        $questionnaire->setRelation('questions', $shuffledQuestions);

        // Retourner le questionnaire avec la durée, l'ID du test et l'ID du stagiaire en utilisant une ressource
        return (new QuestionnaireStagiaireResource($questionnaire))->additional([
            'dureequestionnaire' => $dureequestionnaire,
            'userId' => $test->user_id
        ]);
    }


    /**
     * Calcule la durée totale du questionnaire.
     *
     * @return string La durée totale en secondes
     */
    public function calculateDureeQuestionnaire(Questionnaire $questionnaire)
{
    $totalSeconds = 0;

    foreach ($questionnaire->questions as $question) {
        if ($question->proposition_une) {
            if ($question->niveau == 1) {
                $totalSeconds += 75;
            } elseif ($question->niveau == 3) {
                $totalSeconds += 120;
            } else {
                $totalSeconds += 75;
            }
        } else {
            // Question ouverte - ajouter 20 minutes (1200 secondes)
            $totalSeconds += 1200;
        }
    }

    return $totalSeconds;
}
/**
 * Récupère les questionnaires en cours.
 * Par exemple, ceux qui n'ont pas de test terminé.
 */
public function getQuestionnairesEnCours()
{
    // Adaptation à votre logique métier
    $questionnaires = Questionnaire::with('tests')
        ->whereDoesntHave('tests', function ($query) {
            $query->where('is_finish', true);
        })
        ->orderBy('date', 'asc')
        ->get();

    return QuestionnaireResource::collection($questionnaires);
}

/**
 * Récupère les questionnaires archivés.
 * Un questionnaire est archivé s'il possède au moins un test terminé.
 */
public function getQuestionnairesArchiver()
{
    $questionnaires = Questionnaire::with('tests')
        ->whereHas('tests', function ($query) {
            $query->where('is_finish', true);
        })
        ->orderBy('date', 'desc')
        ->get();

    return QuestionnaireResource::collection($questionnaires);
}

}
