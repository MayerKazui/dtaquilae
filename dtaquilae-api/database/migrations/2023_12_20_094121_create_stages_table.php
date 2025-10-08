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
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('libelle')->unique();
            $table->date('debut');
            $table->date('fin');
            $table->unsignedBigInteger('formation_id');
            $table->unsignedBigInteger('directeur_id');
            $table->unsignedBigInteger('adjoint_id')->nullable();
            $table->timestamps();

            $table->foreign('formation_id')->references('id')->on('formations');
            $table->foreign('directeur_id')->references('id')->on('users');
            $table->foreign('adjoint_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};
