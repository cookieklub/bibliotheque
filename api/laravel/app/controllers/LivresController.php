<?php

class LivresController extends BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$limit = Input::get('limit', 10);
		$offset = Input::get('offset', 0);
		$search = Input::get('search', null);
		$genre = Input::get('genre', null);
		$read = Input::get('read', null);

		$qry = DB::table('livres');

		if($read != null){
			$read = ($read == 'false') ? false : true;
			$qry->where('read', $read)->select('*');
		}
		if($genre != null){
			$qry->join('genres', 'genres.id', '=', 'livres.genre_id')
				->select('livres.*', 'genres.name as genre_name');
			$qry->where('genre_id', '=', intval($genre))->select('*');
		}
		if($search != null){
			$search_array = explode(' ', $search);
			$qry->where(function($qry) use ($search_array){
		        foreach ($search_array as $word) {
					$qry->where('mots_cles', 'LIKE', '%' . $word . '%')
						->orWhere('titre', 'LIKE', '%' . $word . '%')
						->orWhere('auteur', 'LIKE', '%' . $word . '%')
						->orWhere('edition', 'LIKE', '%' . $word . '%')
						->orWhere('avis', 'LIKE', '%' . $word . '%')
						->orWhere('pedagogie', 'LIKE', '%' . $word . '%')
						->orWhere('resume', 'LIKE', '%' . $word . '%');
				}
		    });
		}
		$count = $qry->count();
		$qry->skip($offset)->take($limit);
		$livres = $qry->get();

		// PRE TREATMENT
		foreach ($livres as $livre) {
			$livre->mots_cles = explode(':explode:', $livre->mots_cles);
			$livre->love = ($livre->love) ? true : false;
			$livre->read = ($livre->read) ? true : false;
		}

		$response = array(
			'error'=>false,
			'books'=>$livres,
			'count'=>$count,
			'tests'=>array(
				'search_input'=>$search,
				'search_array'=>explode(' ', $search),
			)
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

		if(is_array(Input::get('mots_cles'))){
			$mots_cles = implode(':explode:', Input::get('mots_cles', array()));
		}
		else{
			$mots_cles = implode(':explode:', explode(',', Input::get('mots_cles', array())));
		}

		$read = (Input::get('read', 'false') == 'false') ? false : true;
		$love = (Input::get('love', 'false') == 'false') ? false : true;

		$data = array(
	    	'titre' => Input::get('titre', ''),
	    	'auteur' => Input::get('auteur', ''),
	    	'edition' => Input::get('edition', ''),
	    	'annee' => Input::get('annee', ''),
	    	'public' => Input::get('public', ''),
	    	'provenance' => Input::get('provenance', ''),
	    	'site' => Input::get('site', ''),
	    	'genre_id' => Input::get('genre'),
	    	'mots_cles' => $mots_cles,
	    	'resume' => Input::get('resume', ''),
	    	'avis' => Input::get('avis', ''),
	    	'pedagogie' => Input::get('pedagogie', ''),
	    	'biographie' => Input::get('biographie', ''),
	    	'read' => $read,
	    	'love' => $love
	    );  

		if(Input::file('image')){
	    	$file = Input::file('image');
	    	$filename = $file -> getClientOriginalName();
	    	Input::file('image')->move('uploads', $time . '_' . $filename);
	    	$data['illustration'] = $time . '_' . $filename;
	    }

	    $success = array(
			'error' => false,
			'messages' => 'Nouveau livre créé avec succès.',
			'livre' => $data
		);

		$result = DB::table('livres')->insert($data);

        if( $result ) {
            return Response::json($success);
        }
        else {
        	return Response::json(
        		array(
					'error'=>true,
					'messages'=>'Une erreur est survenue.'
				)
			);
        }
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$livre = DB::table('livres')->where('id', $id)->first();

		if( $livre ){
			// PRE TREATMENT
			$livre->mots_cles = explode(':explode:', $livre->mots_cles);
			$livre->love = ($livre->love) ? true : false;
			$livre->read = ($livre->read) ? true : false;

			$response = array(
				'error'=>false,
				'book'=>$livre
			);
		}
		else{
			$response = array(
				'error'=>true,
				'book'=>'an error occured.'
			);
		}
		return Response::json($response);
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		Log::info('debut de la méthode update');

		if(is_array(Input::get('mots_cles'))){
			$mots_cles = implode(':explode:', Input::get('mots_cles', array()));
		}
		else{
			$mots_cles = implode(':explode:', explode(',', Input::get('mots_cles', array())));
		}

		$read = (Input::get('read', 'false') == 'false') ? false : true;
		$love = (Input::get('love', 'false') == 'false') ? false : true;

		$time = time();
		$data = array(
	    	'titre' => Input::get('titre', ''),
	    	'auteur' => Input::get('auteur', ''),
	    	'edition' => Input::get('edition', ''),
	    	'annee' => Input::get('annee', ''),
	    	'public' => Input::get('public', ''),
	    	'provenance' => Input::get('provenance', ''),
	    	'site' => Input::get('site', ''),
	    	'genre_id' => Input::get('genre'),
	    	'mots_cles' => $mots_cles,
	    	'resume' => Input::get('resume', ''),
	    	'avis' => Input::get('avis', ''),
	    	'pedagogie' => Input::get('pedagogie', ''),
	    	'biographie' => Input::get('biographie', ''),
	    	'read' => $read,
	    	'love' => $love
	    );

		if(Input::file('image')){
	    	$file = Input::file('image');
	    	$filename = $file -> getClientOriginalName();
	    	Input::file('image')->move('uploads', $time . '_' . $filename);
	    	$data['illustration'] = $time . '_' . $filename;
	    }

	    $success = array(
			'error' => false,
			'messages' => 'Livre modifié avec succès.',
			'livre' => $data
		);
		$error = array(
			'error'=>true,
			'messages'=>'Une erreur est survenue.',
			'put'=>Input::all()
		);

		$result = DB::table('livres')->where('id', '=', $id)->update($data);

        return Response::json(($result) ? $success : $error);
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$result = DB::table('livres')->where('id', '=', $id)->delete();

		$success = array(
			'error' => false,
			'messages' => 'Livre supprimé avec succès.'
		);
		$error = array(
			'error'=>true,
			'messages'=>'Une erreur est survenue.'
		);

		return Response::json(($result) ? $success : $error);
	}


}
