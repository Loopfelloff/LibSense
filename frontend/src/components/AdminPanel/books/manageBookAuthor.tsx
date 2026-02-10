import React, { useState, useEffect, useRef } from 'react'
import { X, BookOpen } from 'lucide-react'
import type { Book, SuggestedAuthor } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface ManageBookAuthorsFormProps {
  book: Book
  onSuccess: () => void
  onCancel: () => void
}

export const ManageBookAuthorsForm: React.FC<ManageBookAuthorsFormProps> = ({ 
  book, 
  onSuccess, 
  onCancel 
}) => {
  // Map book.authors (which has author_first_name) to our internal format (first_name)
  const initialAuthors = (book.authors || []).map(author => ({
    id: author.id,
    first_name: author.author_first_name,
    middle_name: author.author_middle_name,
    last_name: author.author_last_name
  }))

  // Current authors (from the book)
  const [currentAuthors, setCurrentAuthors] = useState<Array<{
    id: string
    first_name: string
    middle_name: string | null
    last_name: string
  }>>(initialAuthors)

  // Selected author IDs (initialized with current authors)
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
    initialAuthors.map((a) => a.id)
  )

  // Search functionality
  const [authorQuery, setAuthorQuery] = useState('')
  const [authorSuggestions, setAuthorSuggestions] = useState<SuggestedAuthor[]>([])
  const debounceTimer = useRef<number | null>(null)

  // New author form
  const [newAuthor, setNewAuthor] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
  })
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false)

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced author search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!authorQuery.trim()) {
      setAuthorSuggestions([])
      return
    }

    debounceTimer.current = window.setTimeout(async () => {
      try {
        const data = await api.fetchSuggestedAuthors(authorQuery)

        const authors = data.authors.map((a: any) => ({
          id: a.id,
          first_name: a.firstName,
          middle_name: null,
          last_name: a.lastName,
          recentBooks: a.recentBooks || [],
        }))
        setAuthorSuggestions(authors)

      } catch (err: any) {
        console.error('Error fetching authors:', err.message)
        setAuthorSuggestions([])
      }
    }, 1000)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [authorQuery])

  // Toggle author selection
  const toggleAuthor = (authorId: string, authorData?: SuggestedAuthor) => {
    if (selectedAuthorIds.includes(authorId)) {
      // Remove author
      setSelectedAuthorIds((prev) => prev.filter((id) => id !== authorId))
      setCurrentAuthors((prev) => prev.filter((a) => a.id !== authorId))
    } else {
      // Add author
      setSelectedAuthorIds((prev) => [...prev, authorId])
      
      // Add to current authors list if we have the data
      if (authorData) {
        setCurrentAuthors((prev) => [...prev, {
          id: authorData.id,
          first_name: authorData.first_name,
          middle_name: authorData.middle_name,
          last_name: authorData.last_name
        }])
      }
    }
  }

  // Remove author from current list
  const removeCurrentAuthor = (authorId: string) => {
    setSelectedAuthorIds((prev) => prev.filter((id) => id !== authorId))
    setCurrentAuthors((prev) => prev.filter((a) => a.id !== authorId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Build authors array matching backend structure
    const authorsArray = [
      ...selectedAuthorIds.map((id) => ({ author_id: id })),
      ...(showNewAuthorForm && newAuthor.first_name.trim() && newAuthor.last_name.trim()
        ? [{ 
            first_name: newAuthor.first_name.trim(), 
            middle_name: newAuthor.middle_name.trim() || null, 
            last_name: newAuthor.last_name.trim() 
          }]
        : []),
    ]

    if (authorsArray.length === 0) {
      setError('Please select at least one author or add a new author')
      return
    }

    setIsSubmitting(true)

    try {
      await api.updateBookAuthors(book.id, authorsArray)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update book authors')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Manage Authors</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Book:</span> {book.book_title}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Select existing authors or add new ones for this book
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Current Authors Section */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Current Authors ({currentAuthors.length})
        </label>
        
        {currentAuthors.length > 0 ? (
          <div className="space-y-2 mb-4">
            {currentAuthors.map((author) => (
              <div
                key={author.id}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAuthorIds.includes(author.id)}
                    onChange={() => removeCurrentAuthor(author.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {author.first_name}
                    {author.middle_name && ` ${author.middle_name}`}
                    {' '}{author.last_name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCurrentAuthor(author.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                  disabled={isSubmitting}
                  title="Remove author"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border border-gray-200 mb-4">
            No authors currently assigned to this book
          </div>
        )}
      </div>

      {/* Search Authors Section */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Search & Add Authors
        </label>
        <input
          type="text"
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
          placeholder="Type author name to search..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
          disabled={isSubmitting}
        />

        {/* Author Suggestions */}
        {authorQuery.trim() && (
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 mb-2 bg-white">
            {authorSuggestions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No authors found. Try a different search or add a new author.
              </p>
            ) : (
              authorSuggestions.map((author) => {
                const isAlreadySelected = selectedAuthorIds.includes(author.id)
                
                return (
                  <div
                    key={author.id}
                    className={`border-b last:border-b-0 py-2 px-2 mb-1 rounded transition ${
                      isAlreadySelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAlreadySelected}
                        onChange={() => toggleAuthor(author.id, author)}
                        className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        disabled={isSubmitting}
                      />
                      <div className="flex-1">
                        <span className={`text-sm font-medium block ${isAlreadySelected ? 'text-blue-700' : ''}`}>
                          {author.first_name} {author.middle_name && `${author.middle_name} `}{author.last_name}
                          {isAlreadySelected && (
                            <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </span>

                        {/* Display recent books */}
                        {author.recentBooks && author.recentBooks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500 font-medium">Recent Books:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {author.recentBooks.map((bookItem, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                                  {bookItem.coverImage ? (
                                    <img
                                      src={bookItem.coverImage}
                                      alt={bookItem.title}
                                      className="w-8 h-12 object-cover rounded flex-shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                        const parent = e.currentTarget.parentElement
                                        if (parent && !parent.querySelector('.fallback-icon')) {
                                          const icon = document.createElement('div')
                                          icon.className = 'fallback-icon w-8 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0'
                                          icon.innerHTML = '<svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'
                                          parent.insertBefore(icon, parent.firstChild)
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-8 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                      <BookOpen size={16} className="text-gray-400" />
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-700 line-clamp-2">{bookItem.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                )
              })
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowNewAuthorForm(!showNewAuthorForm)}
          className="text-sm text-blue-600 hover:underline font-medium"
          disabled={isSubmitting}
        >
          {showNewAuthorForm ? '- Hide new author form' : '+ Add new author'}
        </button>
      </div>

      {/* New Author Form */}
      {showNewAuthorForm && (
        <div className="border border-gray-300 rounded p-4 space-y-3 bg-gray-50">
          <h4 className="font-medium text-sm text-gray-800">New Author Details</h4>
          <div>
            <label className="block text-sm mb-1 text-gray-700">First Name*</label>
            <input
              type="text"
              value={newAuthor.first_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, first_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              placeholder="First name"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700">Middle Name</label>
            <input
              type="text"
              value={newAuthor.middle_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, middle_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              placeholder="Middle name (optional)"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700">Last Name*</label>
            <input
              type="text"
              value={newAuthor.last_name}
              onChange={(e) => setNewAuthor({ ...newAuthor, last_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              placeholder="Last name"
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating Authors...' : 'Update Authors'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 text-center pt-2 border-t">
        {selectedAuthorIds.length > 0 ? (
          <>
            {selectedAuthorIds.length} author{selectedAuthorIds.length !== 1 ? 's' : ''} will be assigned to this book
          </>
        ) : (
          <span className="text-red-600">⚠️ No authors selected - book must have at least one author</span>
        )}
      </div>
    </form>
  )
}