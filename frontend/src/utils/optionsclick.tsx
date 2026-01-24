import { postBooksByStatus } from "../apis/bookStatus";
import { postFavorites } from "../apis/favorite";

const handleAddClick = async (bookId: string, options: string) => {
  let response;
  switch (options) {
    case "favorites":
      response = await postFavorites(bookId);
      break;
    case "currently-reading":
      response = await postBooksByStatus(bookId, "reading");
      break;
    case "will-read":
      response = await postBooksByStatus(bookId, "willread");
      break;
    case "already-read":
      response = await postBooksByStatus(bookId, "read");
      break;
  }
  return response;
};

export { handleAddClick };
