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
        Schema::create('chapitres', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('titre');
            $table->unsignedBigInteger('formation_id')->nullable();
            $table->unsignedBigInteger('chapitre_sup_id')->nullable();
            $table->timestamps();

            $table->foreign('formation_id')->references('id')->on('formations');
            $table->foreign('chapitre_sup_id')->references('id')->on('chapitres');

            $table->unique(array('titre','formation_id'));

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chapitres');
    }
};
