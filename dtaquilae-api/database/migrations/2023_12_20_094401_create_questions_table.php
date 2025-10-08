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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('numero_question')->unique();
            $table->string('ata');
            $table->string('libelle', 750);
            $table->string('proposition_une', 500)->nullable();
            $table->string('proposition_deux', 500)->nullable();
            $table->string('proposition_trois', 500)->nullable();
            $table->string('reponse', 500);
            $table->integer('niveau');
            $table->string('auteur');
            $table->unsignedBigInteger('statut_id')->default(3);
            $table->string('verificateur')->nullable();
            $table->timestamp('date_verif')->nullable();
            $table->string('valideur')->nullable();
            $table->timestamp('date_validation')->nullable();
            $table->unsignedBigInteger('niveau_taxinomique_id');
            $table->boolean('is_used')->default(false);
            $table->unsignedInteger('nb_utilisation')->default(0);
            $table->timestamps();

            $table->foreign('statut_id')->references('id')->on('statuts');
            $table->foreign('niveau_taxinomique_id')->references('id')->on('niveaux_taxinomique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
