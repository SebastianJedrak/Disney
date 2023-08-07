export type fetchResultsType = {
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
  
  export type favoritesType = {
    id: number;
    favorite: boolean;
  }[];