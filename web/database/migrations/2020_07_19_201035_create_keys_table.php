<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKeysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('keys', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('secret');
            $table->text('description')->nullable();
            $table->bigInteger('channel_id')->unsigned()->nullable();
            $table->string('last_ip_address')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->unsignedBigInteger('message_count')->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('keys');
    }
}
