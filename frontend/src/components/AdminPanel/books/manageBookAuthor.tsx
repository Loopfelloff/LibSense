import React, { useState } from 'react'
import type { Book, AuthorWithBooks } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface ManageBookAuthorsFormProps {
  book: Book
  allAuthors: AuthorWithBooks[]
  onSuccess: () => void
  onCancel: () => void
}

export const ManageBookAuthorsForm: React.FC<ManageBookAuthorsFormProps> = ({ 
  book, 
  allAuthors, 
  onSuccess, 
  onCancel 
}) => {
  const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
    book.authors?.map((a) => a.id) || []
  )
  const [newAuthor, setNewAuthor] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
  })
  const [showNewAuthorForm, setShowNewAuthorForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const toggleAuthor = (authorId: string) => {
    setSelectedAuthorIds((prev) => 
      prev.includes(authorId) 
        ? prev.filter((id) => id !== authorId) 
        : [...prev, authorId]
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
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

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Select Authors</label>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded p-2 mb-2 bg-white">
          {allAuthors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No authors available</p>
          ) : (
            allAuthors.map((author) => (
              <label 
                key={author.id} 
                className="flex items-center gap-2 py-2 hover:bg-gray-50 px-2 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAuthorIds.includes(author.id)}
                  onChange={() => toggleAuthor(author.id)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  disabled={isSubmitting}
                />
                <span className="text-sm">
                  {author.first_name}
                  {author.middle_name && ` ${author.middle_name}`}
                  {' '}{author.last_name}
                </span>
              </label>
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

      <div className="flex gap-3 pt-4">
        <button 
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating Authors...' : 'Update Authors'}
        </button>
        <button 
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {selectedAuthorIds.length > 0 && (
        <div className="text-xs text-gray-500 text-center pt-2">
          {selectedAuthorIds.length} author{selectedAuthorIds.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}