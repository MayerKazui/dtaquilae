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
        Schema::create('stage_stagiaire', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stage_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('stage_id')->references('id')->on('stages');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unique(array('stage_id', 'user_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lien_stages_stagiaires');
    }
};
