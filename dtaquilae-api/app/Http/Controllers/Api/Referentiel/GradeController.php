<?php

namespace App\Http\Controllers\Api\Referentiel;

use App\Http\Controllers\Controller;
use App\Models\Referentiel\Grade;
use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use App\Http\Resources\GradeResource;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grades = Grade::all();
        return GradeResource::collection($grades);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGradeRequest $request)
    {
        $data = $request->validated();
        $grade = Grade::create($data);
        return response(new GradeResource($grade), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        return new GradeResource($grade);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeRequest $request, Grade $grade)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        //
    }
}
