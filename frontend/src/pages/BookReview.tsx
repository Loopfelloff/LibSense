import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Dashboard-Components/Navbar';
import Sidebar from '../components/Dashboard-Components/Sidebar';
import { UserContext } from '../context/UserContext';
import type { bookEntireDataType , bookWrittenBy} from '../types/bookEntireData';
import { getFullBookInfo } from '../apis/fullBookInfo';
import { addBookReview } from '../apis/addReview';
import { getBookReview } from '../apis/getReview';
import { deleteBookReview } from '../apis/deleteReview';
import type { ReviewType } from '../types/bookReviewType';
import type { updateReviewPayload } from '../types/updateReviewPayload';
import type { addReviewPayload } from '../types/addReviewPayload';
import { updateBookReview } from '../apis/updateReview';

// Mock reviews data

export function BookReview() {
  const { bookId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isBookDetailLoading , setIsBookDetailLoading] = useState<boolean>(false)
  const [isReviewDeleting , setIsReviewDeleting] = useState<boolean>(false)
  const [isReviewAdding , setIsReviewAdding] = useState<boolean>(false)
  const [isReviewUpdating , setIsReviewUpdating] = useState<boolean>(false)
  const [isReviewLoading , setIsReviewLoading] = useState<boolean>(false)
  const [bookData, setBookData] = useState<bookEntireDataType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editReviewBody, setEditReviewBody] = useState<string>('');
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(0);
  const [newReviewBody, setNewReviewBody] = useState<string>('');
  const authContext = useContext(UserContext);
  const navigation = useNavigate();

  useEffect(() => {
    if (!authContext?.loggedIn) navigation('/login');
    console.log('from authContext' , authContext)
    getFullBookInfo(String(bookId), setIsBookDetailLoading)
    .then(resolve =>{
      console.log(resolve)
      setBookData(resolve)
    })
    .catch(err =>{
      console.log(err)
    })
    getBookReview(String(bookId), setIsReviewLoading)
    .then(resolve =>{
	console.log(resolve)
	setReviews(resolve)
    })
  }, []);

  const getAuthorNames = () => {
    if (!bookData?.book_written_by) return '';
    return bookData.book_written_by.map((author: bookWrittenBy) => {
      const { author_first_name, author_middle_name, author_last_name } = author.book_author;
      return [author_first_name, author_middle_name, author_last_name]
        .filter(Boolean)
        .join(' ');
    }).join(', ');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const userHasReview = () => {
    if (!authContext?.id) return false;
    return reviews.some((r: ReviewType) => r.user_id === authContext.id);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {

      await deleteBookReview(reviewId , setIsReviewDeleting) 
      
      setReviews(reviews.filter((r: ReviewType) => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    console.log("while sending the data we have got this one ", editReviewBody)
    if(isReviewUpdating) return
    if (!editRating && !editReviewBody.trim()) {
      alert('Please provide either a rating or review text');
      return;
    }

    try {
      const updateData: updateReviewPayload = {
	  reviewId : reviewId,
	  rating : (editRating) ? editRating : null, 
	  reviewBody : (editReviewBody.trim() !== "") ? editReviewBody : null, 
      };
      console.log('this is from udpateData' , updateData)

      const response = await updateBookReview(updateData , setIsReviewUpdating)

      console.log("success from updating", response)

      setReviews(reviews.map((r: ReviewType) => 
        r.id === reviewId 
          ? { ...r, ...{
	      rating : response.rating,
	      review_body : response.review_body,
	  } }
          : r
      ));

      setEditingReviewId(null);
      setEditRating(0);
      setEditReviewBody('');
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleAddReview = async () => {
    if(isReviewAdding) return
    if (!newRating || !newReviewBody.trim()) {
      alert('Please provide both rating and review text');
      return;
    }

    if (userHasReview()) {
      alert('You have already reviewed this book');
      return;
    }

    try {
      const reviewData : addReviewPayload = {
        rating: newRating,
        reviewBody: newReviewBody,
        bookId: bookId,
      };

      console.log('Creating review:', reviewData);

      const response = await addBookReview(reviewData , setIsReviewAdding)


      const newReview: ReviewType = {
        id: response.id,
        rating: newRating,
        review_body: newReviewBody,
        user_id: authContext?.id || '',
        book_id: bookId || '',
        user: {
          id: authContext?.id || '',
          first_name: authContext?.firstName || '',
          middle_name: authContext?.middleName || '',
          last_name: authContext?.lastName || '',
          email: authContext?.email || '',
          profile_pic_link: authContext?.profilePicLink || null 
        }
      };

      setReviews([...reviews, newReview]);
      setIsAddingReview(false);
      setNewRating(0);
      setNewReviewBody('');
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const startEdit = (review: ReviewType) => {
    setEditingReviewId(review.id);
    if(review.rating !== null) setEditRating(review.rating);
    if(review.review_body !== null)setEditReviewBody(review.review_body);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditReviewBody('');
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="pt-[53px] flex">
        <Sidebar isOpen={sidebarOpen} selectValue="topRated" onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:pl-56">
          <div className="p-4 w-7xl">
            <section>
              {isBookDetailLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book details...</p>
                  </div>
                </div>
              ) : bookData ? (
                <div className="max-w-5xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Book Cover */}
                    <div className="md:col-span-1">
                      <div className="bg-gray-200 aspect-[2/3] rounded-lg flex items-center justify-center">
                        {bookData.book_cover_image === "something for now" ? (
                          <div className="text-center p-6">
                            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-gray-500 mt-2">No cover image</p>
                          </div>
                        ) : (
                          <img src={bookData.book_cover_image} alt={bookData.book_title} className="w-full h-full object-cover rounded-lg" />
                        )}
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:col-span-2">
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{bookData.book_title}</h1>
                      
                      <p className="text-lg text-gray-600 mb-4">
                        by {getAuthorNames()}
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          ISBN: {bookData.isbn}
                        </span>
                      </div>

                      <div className="prose max-w-none">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">About this book</h2>
                        <p className="text-gray-700 leading-relaxed">{bookData.description}</p>
                      </div>

                      {/* Authors Section */}
                      <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                          {bookData.book_written_by.length > 1 ? 'Authors' : 'Author'}
                        </h2>
                        <div className="space-y-3">
                          {bookData.book_written_by.map((author: bookWrittenBy) => (
                            <div key={author.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {author.book_author.author_first_name[0]}
                                {author.book_author.author_last_name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {author.book_author.author_first_name}{' '}
                                  {author.book_author.author_middle_name && `${author.book_author.author_middle_name} `}
                                  {author.book_author.author_last_name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mt-12 border-t pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl font-bold text-gray-900">
                        Reviews ({reviews.length})
                      </h2>
                      {!userHasReview() && !isAddingReview && (
                        <button
                          onClick={() => setIsAddingReview(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>

                    {/* Add New Review Form */}
                    {isAddingReview && (
                      <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                          {renderStars(newRating, true, setNewRating)}
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review *</label>
                          <textarea
                            value={newReviewBody}
                            onChange={(e) => setNewReviewBody(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Share your thoughts about this book..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleAddReview}
                            className={(!isReviewAdding)? "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium" : "px-4 py-2 bg-gray-300 text-white rounded-lg  transition-colors duration-150 font-medium cursor-not-allowed"}
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={() => {
                              setIsAddingReview(false);
                              setNewRating(0);
                              setNewReviewBody('');
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {((reviews.length) > 0 && !isReviewLoading) ? (
                        reviews.map((review: ReviewType) => (
                          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-150">
                            <div className="flex items-start gap-4">
                              {/* Profile Picture */}
                              <div className="flex-shrink-0">
                                {review.user.profile_pic_link ? (
                                  <img
                                    src={review.user.profile_pic_link}
                                    alt={`${review.user.first_name} ${review.user.last_name}`}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                    {getInitials(review.user.first_name, review.user.last_name)}
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                {editingReviewId === review.id ? (
                                  // Edit Mode
                                  <div>
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                      {renderStars(editRating, true, setEditRating)}
                                    </div>

                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                                      <textarea
                                        value={editReviewBody}
                                        onChange={(e) => setEditReviewBody(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                    </div>

                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => handleUpdateReview(review.id)}
                                        className={(!isReviewUpdating) ? "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm font-medium" : "px-4 py-2 bg-gray-300 text-white rounded-lg  transition-colors duration-150 text-sm font-medium"}
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-150 text-sm font-medium"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  // Display Mode
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold text-gray-900">
                                          {review.user.first_name}{' '}
                                          {review.user.middle_name && `${review.user.middle_name} `}
                                          {review.user.last_name}
                                        </h4>
                                        <div className="mt-1">
                                          {renderStars(Number(review.rating))}
                                        </div>
                                      </div>

                                      {authContext?.id === review.user_id && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => startEdit(review)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                            title="Edit review"
                                          >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className={(!isReviewDeleting) ? "p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150" : "p-2 text-gray-300 rounded-lg transition-colors duration-150"}
                                            title="Delete review"
                                          >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <p className="text-gray-700 leading-relaxed mt-3">
                                      {review.review_body}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <p className="text-gray-600 text-lg">No reviews yet</p>
                          <p className="text-gray-500 mt-1">Be the first to review this book!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Book not found</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
