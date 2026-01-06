import React, { useState, useEffect } from 'react';
import type { Book, AuthorWithBooks } from '../types/adminPanel';
import { api } from '../apis/adminApi';

// Layout Components
import { Sidebar } from '../components/AdminPanel/layout/sidebar';
import { Modal } from '../components/AdminPanel/layout/modal';

// Dashboard
import { Overview } from '../components/AdminPanel/dashboard/overview';

// Book Components
import { BookList } from '../components/AdminPanel/books/booklist';
import { AddBookForm } from '../components/AdminPanel/books/addBookForm';
import { EditBookForm } from '../components/AdminPanel/books/editBookForm';
import { BookDetail } from '../components/AdminPanel/books/bookdetail';
import { ManageBookAuthorsForm } from '../components/AdminPanel/books/manageBookAuthor';

// Author Components
import { AuthorList } from '../components/AdminPanel/authors/authorlist';
import { AddAuthorForm } from '../components/AdminPanel/authors/addauthorForm';
import { EditAuthorForm } from '../components/AdminPanel/authors/editAuthorform';
import { AuthorDetail } from '../components/AdminPanel/authors/authordetail';

type ModalType = 'addBook' | 'editBook' | 'addAuthor' | 'editAuthor' | 'viewBook' | 'viewAuthor' | 'manageAuthors';

const AdminPanel: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<AuthorWithBooks[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('addBook');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load data
  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBooks();
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
      alert('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const data = await api.getAllAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Error loading authors:', error);
      alert('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    loadAuthors();
  }, []);

  // Success handlers that refresh data and close modal
  const handleBookSuccess = async () => {
    await loadBooks();
    await loadAuthors();
    setModalOpen(false);
  };

  const handleAuthorSuccess = async () => {
    await loadAuthors();
    await loadBooks(); // Refresh books too as they may reference authors
    setModalOpen(false);
  };

  // Book handlers
  const handleDeleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      setLoading(true);
      await api.deleteBook(bookId);
      await loadBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      alert(error.message || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  // Author handlers
  const handleDeleteAuthor = async (authorId: string) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    try {
      setLoading(true);
      await api.deleteAuthor(authorId);
      await loadAuthors();
      await loadBooks(); // Refresh books as they may reference this author
    } catch (error: any) {
      console.error('Error deleting author:', error);
      alert(error.message || 'Failed to delete author');
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'addBook': return 'Add Book';
      case 'editBook': return 'Edit Book';
      case 'viewBook': return 'Book Details';
      case 'addAuthor': return 'Add Author';
      case 'editAuthor': return 'Edit Author';
      case 'manageAuthors': return 'Manage Book Authors';
      case 'viewAuthor': return 'Author Details';
      default: return '';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white px-8 py-6 rounded-lg shadow-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Loading...</span>
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'overview' && <Overview books={books} authors={authors} />}
        
        {activeView === 'books' && (
          <BookList
            books={books}
            onAdd={() => {
              setModalType('addBook');
              setModalOpen(true);
            }}
            onEdit={(book) => {
              setSelectedItem(book);
              setModalType('editBook');
              setModalOpen(true);
            }}
            onDelete={handleDeleteBook}
            onView={(book) => {
              setSelectedItem(book);
              setModalType('viewBook');
              setModalOpen(true);
            }}
            onManageAuthors={(book) => {
              setSelectedItem(book);
              setModalType('manageAuthors');
              setModalOpen(true);
            }}
          />
        )}
        
        {activeView === 'authors' && (
          <AuthorList
            authors={authors}
            onAdd={() => {
              setModalType('addAuthor');
              setModalOpen(true);
            }}
            onEdit={(author) => {
              setSelectedItem(author);
              setModalType('editAuthor');
              setModalOpen(true);
            }}
            onDelete={handleDeleteAuthor}
            onView={(author) => {
              setSelectedItem(author);
              setModalType('viewAuthor');
              setModalOpen(true);
            }}
          />
        )}
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={getModalTitle()}>
        {modalType === 'addBook' && (
          <AddBookForm 
            authors={authors} 
            onSuccess={handleBookSuccess} 
            onCancel={() => setModalOpen(false)} 
          />
        )}
        {modalType === 'editBook' && selectedItem && (
          <EditBookForm 
            book={selectedItem} 
            onSuccess={handleBookSuccess} 
            onCancel={() => setModalOpen(false)} 
          />
        )}
        {modalType === 'viewBook' && selectedItem && (
          <BookDetail 
            book={selectedItem} 
            onClose={() => setModalOpen(false)} 
          />
        )}
        {modalType === 'manageAuthors' && selectedItem && (
          <ManageBookAuthorsForm
            book={selectedItem}
            allAuthors={authors}
            onSuccess={handleBookSuccess}
            onCancel={() => setModalOpen(false)}
          />
        )}
        {modalType === 'addAuthor' && (
          <AddAuthorForm 
            onSuccess={handleAuthorSuccess} 
            onCancel={() => setModalOpen(false)} 
          />
        )}
        {modalType === 'editAuthor' && selectedItem && (
          <EditAuthorForm 
            author={selectedItem} 
            onSuccess={handleAuthorSuccess} 
            onCancel={() => setModalOpen(false)} 
          />
        )}
        {modalType === 'viewAuthor' && selectedItem && (
          <AuthorDetail 
            author={selectedItem} 
            onClose={() => setModalOpen(false)} 
          />
        )}
      </Modal>
    </div>
  );
};

export { AdminPanel };