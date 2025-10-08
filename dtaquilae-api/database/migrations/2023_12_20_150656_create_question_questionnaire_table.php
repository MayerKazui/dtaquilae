<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('question_questionnaire', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('questionnaire_id');
            $table->unsignedBigInteger('question_id');
            $table->timestamps();

            $table->foreign('questionnaire_id')->references('id')->on('questionnaires');
            $table->foreign('question_id')->references('id')->on('questions');

            $table->unique(array('questionnaire_id', 'question_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lien_questions_questionnaires');
    }
};
