import {fetchResultsType, favoritesType} from "./types"
import {emptyStar, fillStar} from "./icons"


//FETCH FROM LOCAL STORAGE
const favorites: favoritesType = JSON.parse(localStorage.getItem("favorites")!);
// const test = [{id: 14, favorite: true}];
// localStorage.setItem("favorites", JSON.stringify(test))

// DOCUMENT SELECTORS
const allCharactersList = document.querySelector(".characters-all")!;
const favoritesCharactersList = document.querySelector(
  ".characters-favorites"
)!;

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

//RENDER HTML

function renderHtml(data: fetchResultsType["data"]) {
  // Render all characters list
  renderList(data, allCharactersList);

  // Render only favorite characters list
  const onlyFavoritesFilter = data.filter(
    (element) => element.isFavorite === true
  );
  renderList(onlyFavoritesFilter, favoritesCharactersList);

  // Render top3 character cards
}

//RENDER LIST OF FETCHED ITEMS

function renderList(data: fetchResultsType["data"], htmlElement: Element) {

  const htmlToInject = data
    .map(
      (element) => `
    <li>
    <img src="${element.imageUrl}" alt="${element.name}">
    <span>${element.name}</span>
    <span>${element.films.length}</span>
    ${element.isFavorite ? fillStar : emptyStar}
    </li>`
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
}
