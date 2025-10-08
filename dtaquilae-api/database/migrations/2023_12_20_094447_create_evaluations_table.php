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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->collation = 'utf8_general_ci';
            $table->unsignedBigInteger('test_id');
            $table->unsignedBigInteger('user_id');
            $table->date('date');
            $table->float('note');
            $table->timestamps();

            $table->foreign('test_id')->references('id')->on('tests');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unique(array('test_id', 'user_id'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
