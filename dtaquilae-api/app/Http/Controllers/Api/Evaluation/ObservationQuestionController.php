<?php

namespace App\Http\Controllers\Api\Evaluation;

use App\Http\Controllers\Controller;
use App\Models\Evaluation\ObservationQuestion;
use App\Http\Requests\StoreObservationQuestionRequest;
use App\Http\Requests\UpdateObservationQuestionRequest;
use Illuminate\Support\Facades\Auth;


class ObservationQuestionController extends Controller
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
    public function store(StoreObservationQuestionRequest $request)
    {
        $data = $request->validated();
        self::createObservation($data);
        return response('Success', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ObservationQuestion $observationQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateObservationQuestionRequest $request, ObservationQuestion $observationQuestion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ObservationQuestion $observationQuestion)
    {
        //
    }

    public static function createObservation(array $data): void
    {
        if (!array_key_exists('user', $data)) {
            $user = Auth::user();
            $data['user'] = "{$user->grade->abrege} {$user->nom} {$user->prenom}";
        }
        ObservationQuestion::create($data);
    }
}
