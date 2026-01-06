import React, { useState, useEffect, useRef } from 'react'
import { Upload, X, BookOpen } from 'lucide-react'
import type { SuggestedAuthor } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface AddBookFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    isbn: '',
    book_title: '',
    description: '',
  })

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [newAuthor, setNewAuthor] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
  })

  const [authorQuery, setAuthorQuery] = useState('')
  const [authorSuggestions, setAuthorSuggestions] = useState<SuggestedAuthor[]>([])
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>([])
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimer = useRef<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setImagePreview(null)
  }


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
  }, [authorQuery])

  const toggleAuthor = (authorId: string) => {
    setSelectedAuthorIds((prev) =>
      prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const authorsArray = [
      ...selectedAuthorIds.map((id) => ({ author_id: id })),
      ...(showNewAuthorForm && newAuthor.first_name.trim() && newAuthor.last_name.trim()
        ? [
          {
            first_name: newAuthor.first_name.trim(),
            middle_name: newAuthor.middle_name.trim() || null,
            last_name: newAuthor.last_name.trim(),
          },
        ]
        : []),
    ]

    if (authorsArray.length === 0) {
      setError('Please select at least one author or add a new author')
      return
    }

    setIsSubmitting(true)

    try {
      await api.addBook({
        isbn: formData.isbn.trim(),
        book_title: formData.book_title.trim(),
        description: formData.description.trim() || undefined,
        authors: authorsArray,
        book_cover_image: coverImage || undefined,
      })

      setFormData({ isbn: '', book_title: '', description: '' })
      setCoverImage(null)
      setImagePreview(null)
      setNewAuthor({ first_name: '', middle_name: '', last_name: '' })
      setSelectedAuthorIds([])
      setShowNewAuthorForm(false)
      setAuthorQuery('')
      setAuthorSuggestions([])

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to add book')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* ISBN */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">ISBN*</label>
        <input
          type="text"
          required
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter ISBN"
          disabled={isSubmitting}
        />
      </div>

      {/* Book Title */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Book Title*</label>
        <input
          type="text"
          required
          value={formData.book_title}
          onChange={(e) => setFormData({ ...formData, book_title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter book title"
          disabled={isSubmitting}
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Cover Image</label>
        {imagePreview ? (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="w-32 h-48 object-cover rounded border" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              disabled={isSubmitting}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition">
              <Upload size={18} />
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
            <span className="text-sm text-gray-500">Optional</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          rows={4}
          placeholder="Enter book description (optional)"
          disabled={isSubmitting}
        />
      </div>

      {/* Author Input + Suggestions */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Select Authors*</label>
        <input
          type="text"
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
          placeholder="Type author name..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-2"
          disabled={isSubmitting}
        />

        {/* Display selected authors count */}
        {selectedAuthorIds.length > 0 && (
          <div className="mb-2 text-sm text-blue-600 font-medium">
            {selectedAuthorIds.length} author{selectedAuthorIds.length > 1 ? 's' : ''} selected
          </div>
        )}

        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 mb-2 bg-white">
          {authorSuggestions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">
              {authorQuery.trim() ? 'No authors found' : 'Start typing to search authors'}
            </p>
          ) : (
            authorSuggestions.map((author) => (
              <div
                key={author.id}
                className="border-b last:border-b-0 py-2 px-2 hover:bg-gray-50 mb-1 rounded"
              >
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAuthorIds.includes(author.id)}
                    onChange={() => toggleAuthor(author.id)}
                    className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">
                      {author.first_name} {author.middle_name && `${author.middle_name} `}{author.last_name}
                    </span>

                    {/* Display recent books */}
                    {author.recentBooks && author.recentBooks.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Recent Books:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {author.recentBooks.map((book, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
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
                              <span className="text-xs text-gray-700 line-clamp-2">{book.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))
          )}
        </div>
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

      {/* Submit / Cancel */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Book...' : 'Add Book'}
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
    </form>
  )
}