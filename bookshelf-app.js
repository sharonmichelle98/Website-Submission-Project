const books = [];
const BOOK_EVENT = 'all-book-event';
const SAVED_BOOK_EVENT = 'saved-book-event';
const BOOK_STORAGE = 'BOOK-APPS';

const incompleteBook = document.getElementById('incomplete-bookshelf-list');
const completedBook = document.getElementById('completed-bookshelf-list');

const putStillReadingBackground = document.getElementById('put-still-reading-modal');
const putStillReadingModal = document.getElementById('put-still-reading-content');
const closePutStillReadingModal = document.getElementById('close-put-still-reading-modal');
const putHasFinishedBackground = document.getElementById('put-has-finished-modal');
const putHasFinishedModal = document.getElementById('put-has-finished-content');
const closeputHasFinishedModal = document.getElementById('close-put-has-finished-modal');
const deleteModalBackground = document.getElementById('delete-confirm-modal');
const deleteModal = document.getElementById('delete-confirm-content');
const stillReadingBackground = document.getElementById('still-reading-modal');
const stillReadingModal = document.getElementById('still-reading-content');
const closeStillReadingModal = document.getElementById('close-still-reading-modal');
const hasFinishedBackground = document.getElementById('has-finished-modal');
const hasFinishedModal = document.getElementById('has-finished-content');
const closeHasFinishedModal = document.getElementById('close-has-finished-modal');
const hasDeletedBackground = document.getElementById('has-deleted-modal');
const hasDeletedModal = document.getElementById('has-deleted-content');
const closeHasDeletedModal = document.getElementById('close-has-deleted-modal');
const cancelButton = document.getElementById('cancel-button');
const deleteConfirmButton = document.getElementById('delete-confirm-button');

function generateId () {
    return +new Date();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert('Your browser does not support the local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsedBook = JSON.stringify(books);
        localStorage.setItem(BOOK_STORAGE, parsedBook);
        document.dispatchEvent(new Event(SAVED_BOOK_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOK_STORAGE);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookData of data) {
            books.push(bookData);
        }
    }
    document.dispatchEvent(new Event(BOOK_EVENT));
}

function addBook() {
    const generatedID = generateId();
    const textTitle = document.getElementById('book-title').value;
    const textAuthor = document.getElementById('book-author').value;
    const numberYear = parseInt(document.getElementById('book-year').value);
    const booleanIsComplete = document.getElementById('book-is-complete').checked;
    
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, numberYear, booleanIsComplete);
    const modifiedBook = makeBook(bookObject);
    books.push(bookObject);
  
    if (booleanIsComplete == true) {
        completedBook.append(modifiedBook);
        putHasFinishedModal.classList.remove('hidden');
        putHasFinishedBackground.classList.remove('hidden');
    } else {
        incompleteBook.append(modifiedBook);
        putStillReadingModal.classList.remove('hidden');
        putStillReadingBackground.classList.remove('hidden');
    }       
    document.dispatchEvent(new Event(BOOK_EVENT));
    saveData();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject; 
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author;
    
    const bookYear = document.createElement('p');
    bookYear.innerText = year;

    const bookDataContainer = document.createElement('div');
    bookDataContainer.classList.add('inner');
    bookDataContainer.append(bookTitle, bookAuthor, bookYear);

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-item');
    bookContainer.append(bookDataContainer);
    bookContainer.setAttribute('id', `book-${id}`);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action')

    if (isComplete) {
        const stillReadingButton = document.createElement('button');
        stillReadingButton.innerText = 'Still Reading';
        stillReadingButton.classList.add('still-reading');
        stillReadingButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
            stillReadingModal.classList.remove('hidden');
            stillReadingBackground.classList.remove('hidden');
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete Book';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', function () {
            deleteModal.classList.remove('hidden');
            deleteModalBackground.classList.remove('hidden');            
        });

        actionContainer.append(stillReadingButton, deleteButton);
        bookContainer.append(actionContainer);
    } else {
        const hasFinishedButton = document.createElement('button');
        hasFinishedButton.innerText = 'Has Finished';
        hasFinishedButton.classList.add('has-finished');
        hasFinishedButton.addEventListener('click', function () {
            moveBookToCompleted(id);
            hasFinishedModal.classList.remove('hidden');
            hasFinishedBackground.classList.remove('hidden');
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete Book';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', function () {
            deleteModal.classList.remove('hidden');
            deleteModalBackground.classList.remove('hidden');
        });

        actionContainer.append(hasFinishedButton, deleteButton);
        bookContainer.append(actionContainer);
    }
    return bookContainer;
}

function moveBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(BOOK_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(BOOK_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(BOOK_EVENT));
    saveData();
}

closePutStillReadingModal.addEventListener('click', function () {
    putStillReadingModal.classList.add('hidden');
    putStillReadingBackground.classList.add('hidden');
});

closeputHasFinishedModal.addEventListener('click', function () {
    putHasFinishedModal.classList.add('hidden');
    putHasFinishedBackground.classList.add('hidden');
});

closeStillReadingModal.addEventListener('click', function () {
    stillReadingModal.classList.add('hidden');
    stillReadingBackground.classList.add('hidden');
});

closeHasFinishedModal.addEventListener('click', function () {
    hasFinishedModal.classList.add('hidden');
    hasFinishedBackground.classList.add('hidden');
});

closeHasDeletedModal.addEventListener('click', function () {
    hasDeletedModal.classList.add('hidden');
    hasDeletedBackground.classList.add('hidden');
});

cancelButton.addEventListener('click', function () {
    deleteModal.classList.add('hidden');
    deleteModalBackground.classList.add('hidden');
});

deleteConfirmButton.addEventListener('click', function (uniqueId) {
    for (const uniqueBook of books) {
        if (uniqueBook.id = uniqueId) {
            removeBook(uniqueId);
        }
    }
    deleteModal.classList.add('hidden');
    deleteModalBackground.classList.add('hidden');
    hasDeletedModal.classList.remove('hidden');
    hasDeletedBackground.classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', function () {
    const submitBookForm = document.getElementById('book-form');

    submitBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()); {
       loadDataFromStorage();
    }
});

document.addEventListener(SAVED_BOOK_EVENT, () => {
    console.log(localStorage.getItem(BOOK_STORAGE));
});

document.addEventListener(BOOK_EVENT, function () {    
    incompleteBook.innerHTML = '';
    completedBook.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isComplete) {
            completedBook.append(bookElement);
        } else {
            incompleteBook.append(bookElement);
        }
    }
});



