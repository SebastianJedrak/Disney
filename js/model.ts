import { fetchResultsType, favoritesType } from "./types";

//FETCH FROM LOCAL STORAGE
if (!JSON.parse(localStorage.getItem("favorites")!))
  localStorage.setItem("favorites", "[]");

export let favorites: favoritesType = JSON.parse(
  localStorage.getItem("favorites")!
);

//FETCH DATA FROM API
export async function getData() {
  const url = `https://api.disneyapi.dev/character?pageSize=100`;
  const options = {
    method: "GET",
    mode: "cors" as RequestMode,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Fetch
  const fetchJson = await fetch(url, options);
  if (!fetchJson.ok)
    throw new Error(`${fetchJson.status}: Something goes wrong`);

  //Data transformation
  const data: fetchResultsType = await fetchJson.json();
  return dataFavoritesConcat(data);
}

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
