import { fetchResultsType, favoritesType } from "./types";
import { renderHtml } from "./view";

//FETCH FROM LOCAL STORAGE
const favorites: favoritesType = JSON.parse(localStorage.getItem("favorites")!);
// const test = [{id: 14, favorite: true}];
// localStorage.setItem("favorites", JSON.stringify(test))

//FETCH DATA FROM API

async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;

  try {
    // Fetch
    const fetchJson = await fetch(url);
    if (!fetchJson.ok)
      throw new Error(`${fetchJson.status}: Something goes wrong`);
    //data transformation
    const data: fetchResultsType = await fetchJson.json();
    const transformedData = dataFavoritesConcat(data);
    console.log(transformedData);

    //render html
    renderHtml(transformedData);

    //add listeners
    addListeners();
  } catch (err) {
    // Error Handle
    console.log(err.message);
  }
}

getData();

//CONCAT FAVORITES WITH FETCHED DATA

function dataFavoritesConcat(data: fetchResultsType) {
  //Filter out results without any film
  const noFilmFilter = data.data.filter(
    (element) => element.films.length !== 0
  );

  //Concat fetched data with favorite
  const resultsFavoriteConcat = noFilmFilter.map((element) => {
    // Match fetched data with favorite
    let isOnFavoriteList: boolean;
    if (favorites) {
      isOnFavoriteList = favorites.some(
        (favoriteElement) => favoriteElement.id === element._id
      );
    } else {
      isOnFavoriteList = false;
    }

    return { ...element, isFavorite: isOnFavoriteList };
  });

  return resultsFavoriteConcat;
}

function addListeners() {
  const favoriteElement = document.querySelectorAll(".favorite-toggle");
  

  favoriteElement?.forEach(element => element.addEventListener("click", (event) => {
    const target = event.target as Element
    const starElement = target.closest(".star");
    if (!starElement) return;
    
    console.log(target.closest("li"));
  }))
}
