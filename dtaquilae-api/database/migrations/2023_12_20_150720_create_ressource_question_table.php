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
        Schema::create('question_ressource', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('ressource_id');
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('questions');
            $table->foreign('ressource_id')->references('id')->on('ressources');

            $table->unique(array ('question_id', 'ressource_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_ressource');
    }
};
