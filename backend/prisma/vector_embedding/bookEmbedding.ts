const getAllBooks = async () => {
  const bookText = `
Title: ${book.book_title}
Description: ${book.description}
Genres: ${genres.join(", ")}
Authors: ${authors.map((a) => `${a.author_first_name} ${a.author_last_name}`).join(", ")}
`;
};
