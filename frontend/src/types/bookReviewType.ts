export type ReviewType = {
  id: string;
  rating: number | null; // here although the response will never have rating as null ReviewType is also used as a type of object for updating the review so when updating there sometimes might not be rating in them so.
  review_body: string | null; // the same reason as above.
  user_id: string;
  book_id: string;
  user: {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    profile_pic_link: string | null;
  };
};
