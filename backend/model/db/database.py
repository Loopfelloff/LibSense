import enum
import os
from dotenv import load_dotenv
from sqlalchemy import (
    Enum,
    UniqueConstraint,
    create_engine,
    Column,
    Float,
    String,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Status(enum.Enum):
    READING = "READING"
    READ = "READ"
    WILLREAD = "WILLREAD"


class Book(Base):
    __tablename__ = "book"

    id = Column(String, primary_key=True, index=True)
    isbn = Column(String, unique=True, nullable=False)
    book_title = Column(String, nullable=False)
    book_cover_image = Column(String)
    description = Column(String)
    avg_book_rating = Column(Float, default=0.0)
    book_rating_count = Column(Float, default=0.0)
    book_vector = relationship("BookVector", back_populates="book", uselist=False)


class User(Base):
    __tablename__ = "user"

    id = Column(String, primary_key=True, index=True)
    user_vector = relationship("UserVector", back_populates="user", uselist=False)


class BookVector(Base):
    __tablename__ = "book_vector"

    id = Column(String, primary_key=True)
    book_id = Column(String, ForeignKey("book.id", ondelete="CASCADE"), unique=True)
    embedding = Column(Vector(384))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    book = relationship("Book", back_populates="book_vector")


class UserVector(Base):
    __tablename__ = "user_vector"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    embedding = Column(Vector(384))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="user_vector")


class BookStatusVal(Base):
    __tablename__ = "book_status_val"

    id = Column(String, primary_key=True)
    status = Column(Enum(Status))
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"))
    book_id = Column(String, ForeignKey("book.id", ondelete="CASCADE"))

    book = relationship("Book")
    user = relationship("User")

    __table_args__ = (UniqueConstraint("book_id", "user_id", name="user_book_status"),)


class Favourite(Base):
    __tablename__ = "favourite"

    id = Column(String, primary_key=True)
    status = Column(Enum(Status))
    user_id = Column(String, ForeignKey("user.id", ondelete="CASCADE"))
    book_id = Column(String, ForeignKey("book.id", ondelete="CASCADE"))

    book = relationship("Book")
    user = relationship("User")

    __table_args__ = (
        UniqueConstraint("book_id", "user_id", name="user_book_favourite"),
    )
