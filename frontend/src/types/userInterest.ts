export type searchGenre = {
    id : string;
    genre_name : string;
}

export type addGenre = {
    id : string;
    user_id : string;
    genre_id : string;
}

export type userPreferredGenre = {
    id : string;
    user_id : string;
    genre_id : string;
    genre : searchGenre
}
