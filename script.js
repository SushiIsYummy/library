let myLibrary = [
  {
    'title': 'Harry Potter',
    'author': 'Bob',
    'pages': 289,
    'read': true,
  },
  {
    'title': 'Horse Book',
    'author': 'Unicorn Queen',
    'pages': 123,
    'read': false
  },
  {
    'title': 'King Book',
    'author': 'King Charles',
    'pages': 45,
    'read': false
  },
  {
    'title': 'Radish Book',
    'author': 'Rachel',
    'pages': 827,
    'read': true
  },
  {
    'title': 'Mannequin Book',
    'author': 'George',
    'pages': 1039,
    'read': false
  }
];

let newBookButton = document.querySelector('.new-book-button');
newBookButton.addEventListener('click', () => newBookDialog.showModal());

let newBookDialog = document.querySelector('#new-book-dialog');

let newBookDialogCloseButton = newBookDialog.querySelector('.close-button');
newBookDialogCloseButton.addEventListener('click', () => newBookDialog.close());

// newBookDialog.addEventListener("click", e => {
//   const dialogDimensions = newBookDialog.getBoundingClientRect()
//   if (
//     e.clientX < dialogDimensions.left ||
//     e.clientX > dialogDimensions.right ||
//     e.clientY < dialogDimensions.top ||
//     e.clientY > dialogDimensions.bottom
//   ) {
//     dialog.close()
//   }
// })
    
// Make sure that the modal only closes when the area outside the modal is 
// clicked (mousedown AND mouseup). If I only added a 'click' event listener to
// newBookDialog and checked if the click was outside the dialog box, there would
// be a bug. For example, the commented code above would cause a bug where if I 
// mousedown inside the dialog box and then drag my cursor outside of the dialog box 
// and then mouse up, the dialog box would close which is not what I want.

let isMouseOutsideModal = false;

newBookDialog.addEventListener("mousedown", (event) => {
  const dialogDimensions = newBookDialog.getBoundingClientRect();
  if (
    event.clientX < dialogDimensions.left ||
    event.clientX > dialogDimensions.right ||
    event.clientY < dialogDimensions.top ||
    event.clientY > dialogDimensions.bottom
  ) {
    isMouseOutsideModal = true;
  } else {
    isMouseOutsideModal = false;
  }
});

newBookDialog.addEventListener("mouseup", (event) => {
  const modalArea = newBookDialog.getBoundingClientRect();
  console.log(isMouseOutsideModal);
  if (isMouseOutsideModal && 
    (event.clientX < modalArea.left ||
    event.clientX > modalArea.right ||
    event.clientY < modalArea.top ||
    event.clientY > modalArea.bottom)) {
    newBookDialog.close();
    isMouseOutsideModal = false;
  }
});

let addBookForm = document.querySelector('.add-book-form');
addBookForm.addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();
  newBookDialog.close();

  let form = document.querySelector('.add-book-form');
  let titleElement = form.querySelector('.title');
  let authorElement = form.querySelector('.author');
  let pagesElement = form.querySelector('.pages');
  let readElement = form.querySelector('.read');

  addBookToLibrary(titleElement.value, authorElement.value, 
                   pagesElement.value, readElement.checked);
  let newBook = new Book(titleElement.value, titleElement.value,
                   titleElement.value, titleElement.value);
  myLibrary.push(newBook);
  emptyFormData(titleElement, authorElement, pagesElement, readElement);
}

function emptyFormData(titleElement, authorElement, pagesElement, readElement) {
  titleElement.value = '';
  authorElement.value = '';
  pagesElement.value = '';
  readElement.checked = false;
}

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
  info() {
    return title + ' by ' + author + ', ' + pages + ' pages, ' + read;
  };
} 

// PREMADE BOOK CARD
let bookCardTemplate = document.createElement('div');
let createdTitleElement = document.createElement('p');
createdTitleElement.classList.add('title');
let createdAuthorElement = document.createElement('p');
createdAuthorElement.classList.add('author');
let createdPagesElement = document.createElement('p');
createdPagesElement.classList.add('pages');

let createdReadButton = document.createElement('button');
createdReadButton.classList.add('read-button');

let createdRemoveButton = document.createElement('button');
let createdButtonContent = document.createTextNode('REMOVE');
createdRemoveButton.appendChild(createdButtonContent);
createdRemoveButton.classList.add('remove-button');

let createdButtonsDiv = document.createElement('div');
createdButtonsDiv.classList.add('read-remove-buttons');
createdButtonsDiv.appendChild(createdReadButton);
createdButtonsDiv.appendChild(createdRemoveButton);

bookCardTemplate.classList.add('book-card');
bookCardTemplate.appendChild(createdTitleElement);
bookCardTemplate.appendChild(createdAuthorElement);
bookCardTemplate.appendChild(createdPagesElement);
bookCardTemplate.appendChild(createdButtonsDiv);
// PREMADE BOOK CARD


let bookCards = document.querySelector('.book-cards');

function addBookToLibrary(title, author, pages, read) {
  let index = myLibrary.length;

  let newBookCard = bookCardTemplate.cloneNode(true);
  newBookCard.querySelector('.title').innerText = title;
  newBookCard.querySelector('.author').innerText = 'By: ' + author;
  newBookCard.querySelector('.pages').innerText = pages + ' pages';
  newBookCard.setAttribute('data-index', index);

  if (read) {
    newBookCard.querySelector('.read-button').innerText = 'READ';
    newBookCard.querySelector('.read-button').style.backgroundColor = "#6DF751";
  } else {
    newBookCard.querySelector('.read-button').innerText = 'NOT READ';
    newBookCard.querySelector('.read-button').style.backgroundColor = "#EF5858";
  }

  newBookCard.querySelector('.read-button').addEventListener('click', toggleReadButton);
  newBookCard.querySelector('.remove-button').addEventListener('click', (e) => {
    let bookCardToRemove = e.target.closest('.book-card');
    removeBook(bookCardToRemove.dataset.index);
  })
  bookCards.appendChild(newBookCard);

  return newBookCard;
}

function removeBook(index) {
  let bookCardToRemove = document.querySelector('.book-cards').querySelector(`.book-card[data-index="${index}"]`);
  let allBookCards = document.querySelectorAll('.book-card');
  
  // change index data attribute for book cards
  for (let i = index; i < myLibrary.length; i++) {
    allBookCards[i].setAttribute('data-index', parseInt(allBookCards[i].dataset.index)-1);
  }
  myLibrary.splice(index, 1);

  bookCardToRemove.remove();
}

function displayPremadeBooks() {
  for (let i = 0; i < myLibrary.length; i++) {
    let book = myLibrary[i];
    addBookToLibrary(book.title, book.author, book.pages, book.read)
    .setAttribute('data-index', i);  
  }
}

function toggleReadButton(e) {
  let readButton = e.target;
  if (readButton.innerText === "NOT READ") {
    readButton.innerText = "READ";
    readButton.style.backgroundColor = "#6DF751";
  } else if (readButton.innerText === "READ") {
    readButton.innerText = "NOT READ";
    readButton.style.backgroundColor = "#EF5858";
  }
}

displayPremadeBooks();