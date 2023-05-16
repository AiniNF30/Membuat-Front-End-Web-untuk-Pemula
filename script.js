const books = [];
const RENDER_EVENT = "render-books";
const SAVE_EVENT = "save-books";
const STORAGE_KEY = "BOOKSHELF_APP";

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

const findBook = (bookId) => {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const findBookIndex = (bookId) => {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return 1;
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage");
    return false;
  }

  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVE_EVENT));
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeBook = (bookObject) => {
  const { id, title, author, year, isCompleted } = bookObject;

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = `${title}`;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis : ${author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun : ${year}`;

  const containerListBook = document.createElement("article");
  containerListBook.classList.add("book_item");
  containerListBook.append(bookTitle, bookAuthor, bookYear);
  containerListBook.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const completeButton = document.createElement("span");
    const imageCompleteButton = document.createElement("img");
    imageCompleteButton.src ='./assets/img/button-complete.png';
    completeButton.classList.add("complete");
    completeButton.innerHTML = `<img src='./assets/img/button-complete.png'/>`;
    completeButton.addEventListener("click", () => {
      moveBookToCompleted(id);


    });

    const deleteButton = document.createElement("span");
    const imageDeleteButton = document.createElement("img");
    imageDeleteButton.src ='./assets/img/button-delete.png';
    deleteButton.classList.add("delete");
    deleteButton.innerHTML=`<img src='./assets/img/button-delete.png'/>`;
    deleteButton.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    const editButton = document.createElement("span");
    const imageEditButton = document.createElement("img");
    imageEditButton.src ='./assets/img/button-edit.png';
    editButton.classList.add("edit");
    editButton.innerHTML = `<img src='./assets/img/button-edit.png'/>`;
    editButton.addEventListener("click", () => {
      editBook(id);
    });

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");
    containerAction.append(completeButton, editButton, deleteButton);
    containerListBook.append(containerAction);
  } else {
    const checkButton = document.createElement("span");
    const imageCheckButton = document.createElement("img");
    imageCheckButton.src ='/assets/img/button-complete.png';
    checkButton.classList.add("complete");
    checkButton.innerHTML = `<img src='./assets/img/button-complete.png'/>`;
    checkButton.addEventListener("click", () => {
      addBookToCompleted(id);
    });
    const deleteButton = document.createElement("span");
    const imageDeleteButton = document.createElement("img");
    imageDeleteButton.src ='./assets/img/button-delete.png';
    deleteButton.classList.add("delete");
    deleteButton.innerHTML=`<img src='./assets/img/button-delete.png'/>`;
    deleteButton.addEventListener("click", () => {
      removeBookFromCompleted(id);
    });

    const editButton = document.createElement("span");
    const imageEditButton = document.createElement("img");
    imageEditButton.src ='./assets/img/button-edit.png';
    editButton.classList.add("edit");
    editButton.innerHTML = `<img src='./assets/img/button-edit.png'/>`;
    editButton.addEventListener("click", () => {
      editBook(id);
    });

    const containerAction = document.createElement("div");
    containerAction.classList.add("action");
    containerAction.append(checkButton, editButton, deleteButton);

    containerListBook.append(containerAction);
  }

  return containerListBook;
};

const addBook = (event) => {
  event.preventDefault();
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  
  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  document.getElementById("inputBookTitle").value ='';
  document.getElementById("inputBookAuthor").value ='';
  document.getElementById("inputBookYear").value ='';
  document.getElementById("inputBookIsComplete").checked= false;
};

const addBookToCompleted = (bookId) => {
  Swal.fire({
    title: "Anda yakin ingin memindahkan buku ini ke rak selesai?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
  }).then((result) => {
    if (result.isConfirmed) {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.isCompleted = true  ;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("Data berhasil dipindahkan ke rak selesai");
    } else {
      Swal.fire("Data tidak dipindahkan ke rak selesai");
    }
  });
};

const editBook = (bookId) => {
  (async () => {
    const { value: formValues } = await Swal.fire({
      title: "Masukkan Data Buku Baru",
      html:
        '<input placeholder="Judul" type="text" id="swal-title">' +
        '<input placeholder="Penulis" type="text" id="swal-author">' +
        '<input placeholder="Tahun" type="number" id="swal-year">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById("swal-title").value,
          document.getElementById("swal-author").value,
          document.getElementById("swal-year").value,
        ];
      },
    });

    const _title = document.getElementById("swal-title").value;
    const _author = document.getElementById("swal-author").value;
    const _year = document.getElementById("swal-year").value;

    if (_title !== "" && _author !== "" && _year !== "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;
      bookTarget.title = _title;
      bookTarget.author = _author;
      bookTarget.year = _year;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title !== "" && _author !== "" && _year === "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.title = _title;
      bookTarget.author = _author;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title !== "" && _author === "" && _year !== "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.title = _title;
      bookTarget.year = _year;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title !== "" && _author === "" && _year === "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.title = _title;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title === "" && _author === "" && _year !== "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.year = _year;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title === "" && _author !== "" && _year === "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.author = _author;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else if (_title === "" && _author !== "" && _year !== "") {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.author = _author;
      bookTarget.year = _year;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      Swal.fire("", "Data Berhasil diubah.", "success");
    } else {
      Swal.fire("", "Tidak ada inputan!", "error");
    }
  })();
};

function removeBookFromCompleted(bookId){
  Swal.fire({
      title: 'Anda yakin ingin menghapus data tersebut?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
          const bookTarget = findBookIndex(bookId);
          if(bookTarget === -1) return;
          books.splice(bookTarget, 1);
  
          document.dispatchEvent(new Event(RENDER_EVENT));
          saveData();
          Swal.fire('Data berhasil dihapus')
      }else{
          Swal.fire('Data tidak dihapus')
      }
    })
}

const moveBookToCompleted = (bookId) => {
  Swal.fire({
    title: "Anda yakin ingin memindahkan ke rak belum selesai?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya",
  }).then((result) => {
    if (result.isConfirmed) {
      const bookTarget = findBook(bookId);
      if (bookTarget == null) return;

      bookTarget.isCompleted = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();

      Swal.fire("Data berhasil dipindahkan ke rak belum selesai");
    } else {
      Swal.fire("Data tidak dipindahkan ke rak belum selesai");
    }
  });
};

const searchBook = (event) => {
  event.preventDefault();

  const bookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const bookList = document.querySelectorAll(".book_item > h3");

  for (book of bookList) {
    if (book.innerText.toLowerCase().indexOf(bookTitle.toLowerCase()) > -1) {
      book.parentElement.style.display = "block";
    } else {
      book.parentElement.style.display = "none";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook(event);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVE_EVENT, () => {
  console.log("Data berhasil disimpan");
});

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    console.log(bookItem.id);
    if (bookItem.isCompleted == false) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

document.getElementById("searchSubmit").addEventListener("click", searchBook);
