document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APP";
  let books = [];

  const isStorageAvailable = () => typeof Storage !== "undefined";

  const saveBooksToStorage = () => {
    if (isStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  };

  const loadBooksFromStorage = () => {
    if (isStorageAvailable()) {
      const storedBooks = localStorage.getItem(STORAGE_KEY);
      if (storedBooks) {
        books = JSON.parse(storedBooks);
      }
    }
  };

  const renderBooks = () => {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      const bookElement = createBookElement(book);

      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  const createBookElement = (book) => {
    const container = document.createElement("div");
    container.setAttribute("data-bookid", book.id);
    container.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.textContent = `Penulis: ${book.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.textContent = `Tahun: ${book.year}`;

    const actions = document.createElement("div");

    const toggleButton = document.createElement("button");
    toggleButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    toggleButton.textContent = book.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    toggleButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.textContent = "Hapus Buku";
    deleteButton.addEventListener("click", () => deleteBook(book.id));

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.textContent = "Edit Buku";
    editButton.addEventListener("click", () => editBook(book.id));

    actions.append(toggleButton, deleteButton, editButton);

    container.append(title, author, year, actions);

    return container;
  };

  const addBook = (title, author, year, isComplete) => {
    const book = {
      id: Date.now().toString(),
      title,
      author,
      year: parseInt(year, 10), 
      isComplete,
    };
    books.push(book);
    saveBooksToStorage();
    renderBooks();
  };

  const deleteBook = (id) => {
    books = books.filter((book) => book.id !== id);
    saveBooksToStorage();
    renderBooks();
  };

  const toggleBookStatus = (id) => {
    const book = books.find((b) => b.id === id);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToStorage();
      renderBooks();
    }
  };

  const editBook = (id) => {
  const book = books.find((b) => b.id === id);
  if (book) {
    document.getElementById("editBookId").value = book.id;
    document.getElementById("editBookTitle").value = book.title;
    document.getElementById("editBookAuthor").value = book.author;
    document.getElementById("editBookYear").value = book.year;
    document.getElementById("editBookModal").classList.remove("hidden");
  }
};

document.getElementById("editBookForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("editBookId").value;
  const book = books.find((b) => b.id == id);

  if (book) {
    book.title = document.getElementById("editBookTitle").value;
    book.author = document.getElementById("editBookAuthor").value;
    book.year = parseInt(document.getElementById("editBookYear").value, 10);

    saveBooksToStorage();
    renderBooks();
  }
  document.getElementById("editBookModal").classList.add("hidden");
});

document.getElementById("closeEditModal").addEventListener("click", () => {
  document.getElementById("editBookModal").classList.add("hidden");
});


  const searchBooks = (query) => {
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  };

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    bookForm.reset();
  });

  searchBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchBookTitle").value;
    searchBooks(query);
  });

  loadBooksFromStorage();
  renderBooks();
});
