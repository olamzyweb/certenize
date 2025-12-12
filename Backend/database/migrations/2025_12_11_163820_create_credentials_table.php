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
        Schema::create('credentials', function (Blueprint $table) {
            $table->id();
            $table->string('wallet_address');
            $table->unsignedBigInteger('quiz_session_id');
            $table->string('token_id')->nullable();
            $table->string('transaction_hash')->nullable();
            $table->string('skill');
            $table->integer('score');
            $table->timestamp('minted_at')->nullable();
            $table->timestamps();

            $table->foreign('quiz_session_id')->references('id')->on('quiz_sessions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credentials');
    }
};
