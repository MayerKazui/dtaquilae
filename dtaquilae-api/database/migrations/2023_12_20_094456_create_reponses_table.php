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
        Schema::create('reponses', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->unsignedBigInteger('question_id');
            $table->unsignedBigInteger('test_id');
            $table->unsignedBigInteger('user_id');
            $table->string('reponse', 500)->nullable();
            $table->boolean('is_good_answer');
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('questions');
            $table->foreign('test_id')->references('id')->on('tests');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unique(array ('question_id', 'test_id', 'user_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reponses');
    }
};
