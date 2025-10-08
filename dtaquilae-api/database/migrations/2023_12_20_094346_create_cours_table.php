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
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('libelle');
            $table->string('ata');
            $table->string('ref_documentation');
            $table->integer('niveau');
            $table->integer('nb_questions');
            $table->string('test')->nullable();
            $table->unsignedBigInteger('sous_chapitre_id');
            $table->timestamps();

            $table->foreign('sous_chapitre_id')->references('id')->on('chapitres');

            $table->unique(array('libelle','sous_chapitre_id'));

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
