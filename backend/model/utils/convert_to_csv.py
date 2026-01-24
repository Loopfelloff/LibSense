from pathlib import Path
import json
import csv

from processText import process_text

BASE_DIR = Path(__file__).parent.parent.parent
DATA_PATH = BASE_DIR / "prisma" / "seed" / "books_final.json"

CSV_DIR = Path(__file__).parent.parent / "artifacts" / "books.csv"


def generate_csv(content):
    books_text = []
    for i in content:
        book_title = process_text(i["book"]["book_title"])
        book_description = process_text(i["book"]["description"])

        authors_list = []
        for author in i["authors"]:
            name_parts = [
                author["author_first_name"],
                author["author_middle_name"],
                author["author_last_name"],
            ]
            full_name = " ".join([part for part in name_parts if part])
            authors_list.append(full_name)

        author_info = process_text(", ".join(authors_list))

        genres_info = process_text(" ".join(i["genres"]))

        all_info = book_title, book_description, author_info, genres_info

        books_text.append(all_info)
    print(books_text[0])
    write_to_csv(books_text)


def write_to_csv(books_text):
    headers = ["Title", "Description", "Author", "Genres"]
    with open(CSV_DIR, "w", newline="") as file:
        writer = csv.writer(file, quoting=csv.QUOTE_ALL)
        writer.writerow(headers)
        writer.writerows(books_text)


try:
    with open(DATA_PATH, "r") as file:
        content = json.load(file)
        generate_csv(content)
except FileNotFoundError:
    print("file not found")
