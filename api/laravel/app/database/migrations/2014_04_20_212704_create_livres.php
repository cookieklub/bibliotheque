<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLivres extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('livres', function(Blueprint $table)
		{
			$table->increments('id');
			$table->timestamps();
			$table->string('titre', 100);
	        $table->string('auteur', 100);
	        $table->string('edition', 100);
	        $table->string('annee', 100);
	        $table->string('public', 100);
	        $table->string('provenance', 100);
	        $table->string('site', 100);
	        $table->string('genre_id', 100);
	        $table->text('mots_cles');
	        $table->text('resume');
	        $table->text('avis');
	        $table->text('pedagogie');
	        $table->text('biographie');
	        $table->text('read');
	        $table->text('love');
	        $table->text('illustration');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('livres');
	}

}
