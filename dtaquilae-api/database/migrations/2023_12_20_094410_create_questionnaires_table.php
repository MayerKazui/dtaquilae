<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->string('nom')->unique();
            $table->date('date')->default(DB::raw('CURRENT_DATE'));
            $table->unsignedBigInteger('formation_id');
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->foreign('formation_id')->references('id')->on('formations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questionnaires');
    }
};
