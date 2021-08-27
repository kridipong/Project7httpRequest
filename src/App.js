import React, { useState,useCallback,useEffect } from "react";
import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [changeMovie, setChangeMovie] = useState(false);

  // const fetchMovieHandler = () => {
  //   fetch("https://swapi.dev/api/films/")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((data) => {
  // const transformedMovies = data.results.map((movieData) => {
  //   return {
  //     id: movieData.episode_id,
  //     title: movieData.title,
  //     openingText: movieData.opening_crawl,
  //     releaseDate: movieData.release_date,
  //   };
  // });

//since we add fetchMovieHandler pointer into dependency of useEffect, it would create infiniteloop
//since it would render the new function again then the useEffect will trigger fetchMovieHandler again
// then it would go to infinite loop, so we useCallback, and add no dependency so it would call the first
// time the page render

  async function addMovieHandler (movie) {
    

    const response = await fetch('https://myreactapp-14003-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',{
      method: 'POST',
      body:JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data= await response.json();
    console.log(data);
    setChangeMovie((prev)=> !prev);

  }




  const fetchMovieHandler= useCallback(async()=> {
    setIsLoading(true);
    setHasError(null);
    try {
      const response = await fetch("https://myreactapp-14003-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
      console.log(response.status);

      if (response.status !== 200) { //status is number not text so return the number not string

        throw new Error("something is totally wrong: "+response.status);
      }
      const data = await response.json();
      console.log(data);

      //since we get databack from firebase as list objects so we have to load all the {object}
      // into array of object

      const transformedMovies = [];

      for (const key in data){
        transformedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,
        })

      }



      // const transformedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // }); this is for normal api 

      setMovies(transformedMovies);
      console.log(transformedMovies);
      setIsLoading(false);
    } catch (error) {
      setHasError(error.message);
      setIsLoading(false);
    }
  },[]
  )

  useEffect(()=>{
    fetchMovieHandler();
  },[fetchMovieHandler,changeMovie]); //if there is state changed , there should be fetch new data but in this case there isn't anything



  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}> </AddMovie>
          </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {!hasError&&!isLoading && movies.length === 0 && <p>Found no movies.</p>}
        {isLoading && <p>Loading...</p>}
        {hasError && !isLoading && <p>{hasError}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
