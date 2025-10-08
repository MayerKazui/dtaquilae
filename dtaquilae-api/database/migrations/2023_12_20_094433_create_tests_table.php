<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->unsignedBigInteger('questionnaire_id');
            $table->string('libelle');
            $table->unsignedBigInteger('user_id');
            $table->date('date');
            $table->boolean('is_counter_test')->default('false');
            $table->timestamps();

            $table->foreign('questionnaire_id')->references('id')->on('questionnaires');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unique(array ('questionnaire_id', 'user_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
