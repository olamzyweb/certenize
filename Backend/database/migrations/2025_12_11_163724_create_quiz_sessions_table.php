<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('quiz_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address');
            $table->string('topic');
            $table->json('quiz_json');
            $table->enum('status', ['pending', 'passed', 'failed'])->default('pending');
            $table->integer('score')->default(0);
            $table->string('mint_token')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_sessions');
    }
};
