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
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('experiment_id')->constrained()->cascadeOnDelete();
            $table->string('mode')->default('practical');       // simulation / practical
            $table->string('status')->default('in_progress');   // in_progress / completed
            $table->unsignedTinyInteger('score_practice')->nullable();   // bobot 30%
            $table->unsignedTinyInteger('score_accuracy')->nullable();   // bobot 25%
            $table->unsignedTinyInteger('score_quiz')->nullable();       // bobot 30%
            $table->unsignedTinyInteger('score_conclusion')->nullable(); // bobot 15%
            $table->unsignedTinyInteger('final_score')->nullable();
            $table->text('conclusion')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attempts');
    }
};
