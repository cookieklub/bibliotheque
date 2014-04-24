<?php

class GenresController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$genres = DB::table('genres')->get();

		$response = array(
			'error'=>false,
			'genres'=>$genres
		);
		return Response::json($response);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		$time = time();

		$genre = Input::get('genre', null);

		$data = array(
			'name'=>$genre,
			'value'=>$genre
		);
	    $success = array(
			'error' => false,
			'messages' => 'Nouveau type créé avec succès.',
			'genre' => $data
		);
		$error = array(
			'error'=>true,
			'messages'=>'Une erreur est survenue.'
		);

	    if( $data ) { $result = DB::table('genres')->insert($data); }

        return Response::json(($result) ? $success : $error);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
