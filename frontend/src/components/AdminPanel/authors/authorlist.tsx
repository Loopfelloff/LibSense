import React, { useState, useEffect, useRef } from 'react'
import { Plus, Eye, Edit, Trash2, Search, User } from 'lucide-react'
import type { AuthorWithBooks } from '../../../types/adminPanel'
import { api } from '../../../apis/adminApi'

interface AuthorListProps {
  onAdd: () => void
  onEdit: (author: AuthorWithBooks) => void
  onDelete: (id: string) => void
  onView: (author: AuthorWithBooks) => void
}

export const AuthorList: React.FC<AuthorListProps> = ({ 
  onAdd, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const [authors, setAuthors] = useState<AuthorWithBooks[]>([])
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastAuthorRef = useRef<HTMLDivElement | null>(null)

  // Fetch authors function
  const fetchAuthors = async (pageNum: number) => {
    setLoading(true)
    try {
      const data = await api.getAllAuthors(pageNum, 10)
      
      if (data.success) {
        if (pageNum === 1) {
          setAuthors(data.authors)
        } else {
          // Filter out duplicates before adding
          setAuthors(prev => {
            const existingIds = new Set(prev.map((a: AuthorWithBooks) => a.id))
            const newAuthors = data.authors.filter((a: AuthorWithBooks) => !existingIds.has(a.id))
            return [...prev, ...newAuthors]
          })
        }
        setHasMore(data.pagination.hasMore)
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    fetchAuthors(1)
  }, [])

  // Intersection observer for lazy loading
  useEffect(() => {
    if (loading) return
    if (!hasMore) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })

    if (lastAuthorRef.current) {
      observer.current.observe(lastAuthorRef.current)
    }

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [loading, hasMore])

  // Fetch new page
  useEffect(() => {
    if (page > 1) {
      fetchAuthors(page)
    }
  }, [page])
  
  const filteredAuthors = authors.filter((author) => {
    const searchLower = search.toLowerCase().trim()
    if (!searchLower) return true
    
    const firstName = author.first_name.toLowerCase()
    const middleName = (author.middle_name || '').toLowerCase()
    const lastName = author.last_name.toLowerCase()
    const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim()
    
    return fullName.includes(searchLower)
  })

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      await onDelete(id)
      setAuthors(prev => prev.filter(author => author.id !== id))
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Authors</h1>
        <button 
          onClick={onAdd} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus size={20} />
          Add Author
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search authors by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-4">
        {filteredAuthors.length > 0 ? (
          filteredAuthors.map((author, index) => (
            <div 
              key={author.id}
              ref={index === filteredAuthors.length - 1 ? lastAuthorRef : null}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-start bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <User size={18} className="text-gray-500 flex-shrink-0" />
                  <div className="font-semibold text-lg text-gray-900">
                    {author.first_name}
                    {author.middle_name && ` ${author.middle_name}`}
                    {' '}{author.last_name}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Books:</span> {author.books?.length || 0}
                </div>

                {author.books && author.books.length > 0 && (
                  <div className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {author.books.slice(0, 3).map((b) => b.book_title).join(', ')}
                    {author.books.length > 3 && (
                      <span className="font-medium text-blue-600">
                        {' '}+{author.books.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0 ml-4">
                <button 
                  onClick={() => onView(author)} 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" 
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => onEdit(author)} 
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" 
                  title="Edit Author"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(author.id)} 
                  className={`p-2 rounded transition ${
                    deleteConfirm === author.id 
                      ? 'bg-red-600 text-white' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                  title={deleteConfirm === author.id ? 'Click again to confirm' : 'Delete Author'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            {search ? (
              <>
                <Search size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg">No authors found matching "{search}"</p>
              </>
            ) : (
              <>
                <Plus size={48} className="mx-auto mb-3 text-gray-400" />
                <p className="text-lg">No authors available</p>
                <button 
                  onClick={onAdd} 
                  className="mt-4 text-blue-600 hover:underline font-medium"
                >
                  Add your first author
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {filteredAuthors.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          Showing {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}