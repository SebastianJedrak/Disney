// TYPES

type fetchResultsType = {
  info: {
    count: number;
    totalPages: number;
    previousPage: null | number;
    nextPage: null | number;
  };
  data: {
    _id: number;
    films: string[];
    shortFilms: string[];
    tvShows: string[];
    videoGames: string[];
    parkAttractions: string[];
    allies: string[];
    enemies: string[];
    sourceUrl: string;
    name: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    __v: number;
    isFavorite?: boolean;
  }[];
};

type favoritesType = {
  id: number;
  favorite: boolean;
}[];

//ICONS
const emptyStar = '<svg fill="yellow" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m323-205 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178ZM233-80l65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Zm247-355Z"/></svg>';

const fillStar = '<svg fill="yellow" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m233-80 65-281L80-550l288-25 112-265 112 265 288 25-218 189 65 281-247-149L233-80Z"/></svg>'

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
    ${fillStar}
    </li>`
    )
    .join(" ");

  htmlElement.insertAdjacentHTML("afterbegin", htmlToInject);
}
