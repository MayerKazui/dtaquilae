<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    // TODO: Retirer le 'nullable' une fois que la gestion des utilisateurs sera terminée des champs suivants : grade_id, login, matricule
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('password');
            $table->string('matricule', 11)->nullable();
            $table->string('numeroAlliance', 12)->nullable();
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('login', 50)->nullable();
            $table->unsignedBigInteger('role_id');
            $table->unsignedBigInteger('grade_id');
            $table->boolean('actif')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->unique(['matricule']);
            $table->unique(['numeroAlliance']);
            /*
             * Ajout des clés étrangères.
             * Exemple : La clé étrangère "role" fait référence à la colonne "id"
             * de la table "role".
             * /!\ L'ordre de création des tables est importante pour cette étape /!\
             */
            $table->foreign('role_id')->references('id')->on('roles');
            $table->foreign('grade_id')->references('id')->on('grades');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
