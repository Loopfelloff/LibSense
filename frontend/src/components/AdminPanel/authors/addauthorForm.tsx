import React, { useState, useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { SuggestedAuthor } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface AddAuthorFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export const AddAuthorForm: React.FC<AddAuthorFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    author_first_name: '',
    author_middle_name: '',
    author_last_name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingAuthors, setExistingAuthors] = useState<SuggestedAuthor[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  const debounceTimer = useRef<number | null>(null)

  // Debounced search for existing authors
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    const firstName = formData.author_first_name.trim()
    const lastName = formData.author_last_name.trim()

    // Only search if both first and last name have at least 2 characters
    if (firstName.length < 2 && lastName.length < 2) {
      setExistingAuthors([])
      return
    }

    // Build search query
    const searchQuery = [firstName, lastName].filter(Boolean).join(' ')

    if (!searchQuery) {
      setExistingAuthors([])
      return
    }

    setIsSearching(true)

    debounceTimer.current = window.setTimeout(async () => {
      try {
        const data = await api.fetchSuggestedAuthors(searchQuery)
        const authors = data.authors.map((a: any) => ({
          id: a.id,
          first_name: a.firstName,
          middle_name: null,
          last_name: a.lastName,
          recentBooks: a.recentBooks || [],
        }))
        
        // Filter for close matches (case-insensitive)
        const closeMatches = authors.filter((author: SuggestedAuthor) => {
          const firstNameMatch = firstName && 
            author.first_name.toLowerCase().includes(firstName.toLowerCase())
          const lastNameMatch = lastName && 
            author.last_name.toLowerCase().includes(lastName.toLowerCase())
          
          return firstNameMatch || lastNameMatch
        })

        setExistingAuthors(closeMatches)
      } catch (err: any) {
        console.error('Error searching authors:', err.message)
        setExistingAuthors([])
      } finally {
        setIsSearching(false)
      }
    }, 800) // 800ms debounce

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [formData.author_first_name, formData.author_last_name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Check for exact duplicates
    const exactMatch = existingAuthors.find(
      (author) =>
        author.first_name.toLowerCase() === formData.author_first_name.trim().toLowerCase() &&
        author.last_name.toLowerCase() === formData.author_last_name.trim().toLowerCase()
    )

    if (exactMatch) {
      setError(
        `Author "${exactMatch.first_name} ${exactMatch.last_name}" already exists in the database.`
      )
      return
    }

    setIsSubmitting(true)

    try {
      await api.addAuthor({
        author_first_name: formData.author_first_name.trim(),
        author_middle_name: formData.author_middle_name.trim() || null,
        author_last_name: formData.author_last_name.trim(),
      })

      // Reset form on success
      setFormData({
        author_first_name: '',
        author_middle_name: '',
        author_last_name: '',
      })

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to add author')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">First Name*</label>
        <input
          type="text"
          required
          value={formData.author_first_name}
          onChange={(e) => setFormData({ ...formData, author_first_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter first name"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Middle Name</label>
        <input
          type="text"
          value={formData.author_middle_name}
          onChange={(e) => setFormData({ ...formData, author_middle_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter middle name (optional)"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Last Name*</label>
        <input
          type="text"
          required
          value={formData.author_last_name}
          onChange={(e) => setFormData({ ...formData, author_last_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter last name"
          disabled={isSubmitting}
        />
      </div>

      {/* Existing Authors Warning */}
      {isSearching && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Checking for existing authors...</span>
        </div>
      )}

      {!isSearching && existingAuthors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                Similar author{existingAuthors.length > 1 ? 's' : ''} found:
              </p>
              <div className="space-y-2">
                {existingAuthors.map((author) => (
                  <div
                    key={author.id}
                    className="bg-white border border-yellow-300 rounded p-3"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {author.first_name} {author.last_name}
                    </p>
                    {author.recentBooks && author.recentBooks.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Recent books:</p>
                        <div className="flex flex-wrap gap-1">
                          {author.recentBooks.map((book, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {book.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Please verify this is a different author before adding.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isSearching && 
       existingAuthors.length === 0 && 
       formData.author_first_name.trim().length >= 2 && 
       formData.author_last_name.trim().length >= 2 && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle size={20} className="flex-shrink-0" />
          <span className="text-sm">No existing authors found with this name.</span>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting || isSearching}
        >
          {isSubmitting ? 'Adding Author...' : 'Add Author'}
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