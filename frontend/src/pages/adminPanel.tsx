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

  // Book handlers
  const handleAddBook = async (bookData: any) => {
    try {
      setLoading(true);
      await api.addBook(bookData);
      await loadBooks();
      await loadAuthors();
      setModalOpen(false);
      alert('Book added successfully');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = async (bookData: any) => {
    try {
      setLoading(true);
      await api.updateBook(selectedItem.id, bookData);
      await loadBooks();
      setModalOpen(false);
      alert('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      setLoading(true);
      await api.deleteBook(bookId);
      await loadBooks();
      alert('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleManageBookAuthors = async (authors: any[]) => {
    try {
      setLoading(true);
      await api.updateBookAuthors(selectedItem.id, authors);
      await loadBooks();
      await loadAuthors();
      setModalOpen(false);
      alert('Book authors updated successfully');
    } catch (error) {
      console.error('Error updating book authors:', error);
      alert('Failed to update book authors');
    } finally {
      setLoading(false);
    }
  };

  // Author handlers
  const handleAddAuthor = async (authorData: any) => {
    try {
      setLoading(true);
      await api.addAuthor(authorData);
      await loadAuthors();
      setModalOpen(false);
      alert('Author added successfully');
    } catch (error) {
      console.error('Error adding author:', error);
      alert('Failed to add author');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAuthor = async (authorData: any) => {
    try {
      setLoading(true);
      await api.updateAuthor(selectedItem.id, authorData);
      await loadAuthors();
      setModalOpen(false);
      alert('Author updated successfully');
    } catch (error) {
      console.error('Error updating author:', error);
      alert('Failed to update author');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (authorId: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    try {
      setLoading(true);
      await api.deleteAuthor(authorId);
      await loadAuthors();
      alert('Author deleted successfully');
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author');
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
    <div className="flex min-h-screen bg-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
            <div className="bg-white p-4 rounded-lg">Loading...</div>
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
          <AddBookForm authors={authors} onSubmit={handleAddBook} onCancel={() => setModalOpen(false)} />
        )}
        {modalType === 'editBook' && selectedItem && (
          <EditBookForm book={selectedItem} onSubmit={handleEditBook} onCancel={() => setModalOpen(false)} />
        )}
        {modalType === 'viewBook' && selectedItem && (
          <BookDetail book={selectedItem} onClose={() => setModalOpen(false)} />
        )}
        {modalType === 'manageAuthors' && selectedItem && (
          <ManageBookAuthorsForm
            book={selectedItem}
            allAuthors={authors}
            onSubmit={handleManageBookAuthors}
            onCancel={() => setModalOpen(false)}
          />
        )}
        {modalType === 'addAuthor' && (
          <AddAuthorForm onSubmit={handleAddAuthor} onCancel={() => setModalOpen(false)} />
        )}
        {modalType === 'editAuthor' && selectedItem && (
          <EditAuthorForm author={selectedItem} onSubmit={handleEditAuthor} onCancel={() => setModalOpen(false)} />
        )}
        {modalType === 'viewAuthor' && selectedItem && (
          <AuthorDetail author={selectedItem} onClose={() => setModalOpen(false)} />
        )}
      </Modal>
    </div>
  );
};

export {AdminPanel}