export type bookAuthorType = {
    id : string;
    author_first_name : string;
    author_middle_name : string | null;
    author_last_name : string
}

export type bookWrittenBy = {
    id : string;
    book_author_id : string;
    book_id : string,
    book_author : bookAuthorType
}

export type bookEntireDataType = {
    id : string;
    isbn : string;
    book_title : string;
    book_cover_image : string;
    description : string;
    book_written_by : bookWrittenBy[]
}



