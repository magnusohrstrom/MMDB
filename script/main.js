//MMDB


/*Im using Module pattern combined with factory pattern. I wanted to seperate
the Constructor and prototypes from the other application functions to get a more
comprehendable code structure. What the object inherits is the function-prototypes
that processes its own information. The returned functions are functions that operate
on the entire list of objects.
*/
//Module
var magnusMovieDatabase = (function() {
  //Private Array of Movie-objects.

  var movieList = [];
  var tempList = [];
  var oldList = [
    {
      title: 'The Exorcist',
      year: 1973,
      genres: ['Horror','Thriller'],
      ratings:[7,8,8,9]
    },
    {
      title: 'Kill Bill vol.2',
      year: 2005,
      genres: ['Action','Thriller','Crime'],
      ratings:[7,8,7,8]
    },
    {
      title: 'Bond',
      year:1957,
      genres: ['Action','Drama','Thriller'],
      ratings: [6,4,8,9]
    },
    {
      title: 'Pulp Fiction',
      year: 1995,
      genres: ['Action','Drama','Thriller'],
      ratings: [7,8,8,9]
    },
    {
      title:'Kill Bill vol.1',
      year:2003,
      genres:['Action','Thriller','Crime'],
      ratings:[8,9,9]
    },
    {
      title:'Django Unchained',
      year:2012,
      genres:['Drama','Western'],
      ratings:[7,8,9]

    },
    {
      title:'Inglourious Basterds',
      year:2009,
      genres:['Action','Drama','War'],
      ratings:[8,7,9]
    },
    {
      title:'Sharknado',
      year:2013,
      genres:['Horror','Sci-fi'],
      ratings:[3,2,2]
    }
  ];

  //Private Factory object./////////////////////////////////////////////
  var Movie = {

    //Constructor prototype.
    create: function(title, year, genres, ratings){
      var newMovie = Object.create(this);
      newMovie.title = title;
      newMovie.year = year;
      if(Array.isArray(genres)){
        newMovie.genres = genres;
        newMovie.ratings = ratings;
      }
      else{
        newMovie.genres  = genres.split(' ');
        newMovie.ratings = ratings.split('');
      }

      return newMovie;
    },

    //Prototypes
    calcThisAverage: function(){
      let arr = this.ratings.reduce(function(prev,obj){
        return prev + obj;
      },0);
      return (arr/this.ratings.length).toFixed(2);
    },
    addRating:function(rating){
      this.ratings.push(rating);
      console.log(this.ratings);
    },
    sayLog:function(){
      console.log(`hej jag är ${this.title}`);
    }
  };


//Returned functions for app./////////////////////////////////////////////////////////////////////////////
  return {
    //returns Movie object with all its properties so that it can be accesed through namespace.
    Movie:Movie,

    //Getting input from form and creating new movie-object, pushing it to array.
    getInputFromForm: function() {
      var titleInput = document.getElementById('title').value;
      var yearInput = document.getElementById('year').value;
      var genresInput = document.getElementById('genres').value.split(' ');
      var ratingsInput = Number(document.getElementById('ratings').value);
      console.log(ratingsInput);

      var createdMovie = magnusMovieDatabase.Movie.create(titleInput, yearInput, genresInput, ratingsInput);
      magnusMovieDatabase.addMovieToDataBase(createdMovie);

      magnusMovieDatabase.listAllMoviesToInterface();
    },

    addMovieToDataBase: function(movie) {
      movieList.push(movie);
    },

    //List movies to interface with passed array.
    listAllMoviesToInterface: (list) => {
      if(list===undefined){list=movieList;}

      var section = document.getElementsByClassName('movie-list')[0];
      var movieHtml = '';
      for(let i = 0 ; i < list.length; i++){
        movieHtml += `<article class="movie-card">
          <div class="movie-text">
            <h3>Title:${list[i].title}</h3>
            <p>Release Year:${list[i].year}</p>
            <p>Genres:${list[i].genres}</p>
            <p>Ratings:${list[i].calcThisAverage()}</p>
          </div>
        </article>`;
      }
      section.innerHTML = movieHtml;
    },
    //Adds prototypes to allready excisting array objects and creating Movie objects.
  addProtoToExistingMovies: function(){
      for(var i = 0; i<oldList.length; i++){
        var title = oldList[i].title;
        var year = oldList[i].year;
        var genres = oldList[i].genres;
        var ratings = oldList[i].ratings;
        var newObj = magnusMovieDatabase.Movie.create(title,year,genres,ratings);
        movieList.push(newObj);
      }
      console.log(movieList);
    },

    //Gets top rated movie and adds it to interface.
    getTopRatedMovie: function(){
      var topList = movieList.reduce(function(prev, obj){
        return prev.ratings > obj.ratings ? prev:obj;
      });
      tempList = [topList];

      magnusMovieDatabase.listAllMoviesToInterface(tempList);
    },
    //Returns worst rated movie and adds it to interface.
    getWorstRatedMovie: function(){
      var worstList = movieList.reduce(function(prev,obj){
        return prev.ratings < obj.ratings ? prev:obj;
      });
      tempList = [worstList];
      magnusMovieDatabase.listAllMoviesToInterface(tempList);
    },
    //Get all movies from a specifik genre.
    getMoviesFromGenre: function(genre){
      var localMovieList = [...movieList];
      var localGenres = [];
      for(var i=0; i<localMovieList.length;i++){
        var genreList = localMovieList[i].genres;
        for(var j = 0; j<genreList.length;j++){
          if(genreList[j]===genre){
            localGenres.push(localMovieList[i]);
          }
        }
      }
      tempList = localGenres;
      console.log(tempList);
      magnusMovieDatabase.listAllMoviesToInterface(tempList);
      /*
var genreList = movieList.map(function(obj){
        return obj.genres.filter(function(obj){
          return obj === 'Action';
        });
      }).map(function(obj){
        return obj.title;
      });
      return genreList;
    }*/

    },
    //Find Movie from argument input.
    findMovie:function(value){
      var findList = movieList.filter(function(elem){
        return elem.title===value || elem.year ===value;
      });
      return findList;
    },
    //Get movie from form values and post list of movies returned to html.
    getMovieFromForm:function(){
      var argument;
      if(document.getElementById('search-title').value===''){
        argument = Number(document.getElementById('year').value);
      }
      else if(document.getElementById('year').value===''){
        argument = document.getElementById('search-title').value;
      }
      magnusMovieDatabase.listAllMoviesToInterface(magnusMovieDatabase.findMovie(argument));
    },

    getRatingFromForm:function(){

    },
    accesMovieList:function(){
      return movieList;
    }

  };
})();
//Runs at init of application.
magnusMovieDatabase.addProtoToExistingMovies();
magnusMovieDatabase.listAllMoviesToInterface();

//Adding eventlistener to button for adding movieobject.
var button = document.getElementById('go');
var all = document.getElementById('all-movies');
var horrorButton = document.getElementById('horror');
var actionButton = document.getElementById('action');
var topratedButton = document.getElementById('top');
var worstRatedButton = document.getElementById('worst');
var searchButton = document.getElementById('search');

button.addEventListener('click',magnusMovieDatabase.getInputFromForm);
all.addEventListener('click', function(){magnusMovieDatabase.listAllMoviesToInterface();});
horrorButton.addEventListener('click',function(){magnusMovieDatabase.getMoviesFromGenre('Horror');});
actionButton.addEventListener('click',function(){magnusMovieDatabase.getMoviesFromGenre('Action');});
topratedButton.addEventListener('click',function(){magnusMovieDatabase.getTopRatedMovie();});
worstRatedButton.addEventListener('click',function(){magnusMovieDatabase.getWorstRatedMovie();});
searchButton = document.addEventListener('click',function(){magnusMovieDatabase.getMovieFromForm();});

magnusMovieDatabase.findMovie(1995);
//magnusMovieDatabase.addProtoToExistingMovies();
//var halo = magnusMovieDatabase.Movie.create('Halo',2668,'kalle',5);

//console.log(halo);

//halo.rateMovie(7);

//console.log(halo.calcThisAverage());

//console.log(magnusMovieDatabase.getTopRatedMovie());
//console.log(magnusMovieDatabase.listAllMovies());
//console.log(magnusMovieDatabase.Movie.avarageRating());
//console.log(magnusMovieDatabase.getMoviesFromGenre('Action'));



//console.log(array);
