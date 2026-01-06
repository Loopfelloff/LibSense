import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import type { Book } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface EditBookFormProps {
  book: Book
  onSuccess: () => void
  onCancel: () => void
}

export const EditBookForm: React.FC<EditBookFormProps> = ({ book, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    isbn: book.isbn,
    book_title: book.book_title,
    description: book.description || '',
  })

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(book.book_cover_image || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await api.updateBook(book.id, {
        isbn: formData.isbn.trim(),
        book_title: formData.book_title.trim(),
        description: formData.description.trim() || undefined,
        book_cover_image: coverImage || undefined,
      })

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update book')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Book</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

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
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Cover Image</label>
        {imagePreview ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="w-32 h-48 object-cover rounded border shadow-sm" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition w-fit">
              <Upload size={18} />
              <span>Change Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition w-fit">
            <Upload size={18} />
            <span>Choose New Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
            />
          </label>
        )}
        <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
      </div>
      
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
      
      <div className="flex gap-3 pt-4">
        <button 
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Book'}
        </button>
        <button 
          onClick={onCancel} 
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}