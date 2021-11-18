$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-btn', deleteBook);
  $('#bookShelf').on('click', '.markRead-btn', handleMarkRead);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}

// Create function to remove book on delete button
function deleteBook() {
  const bookIdToDelete = $(this).data('id');
  $.ajax({
    type: 'DELETE',
    url: `/books/${bookIdToDelete}`
  }).then((response) => {
    console.log(response);
    // call function to update DOM with books
    refreshBooks();
  });
} // end deleteBook

// Create function to mark book as read on Mark as Read

function handleMarkRead() {
  const bookIdToMark = $(this).data('id');
  const currentReadStatus = $(this).data('read-status');
  // console.log(bookIdToMark);
  // console.log(currentReadStatus);
  $.ajax({
    type: 'PUT',
    url: `/books/${bookIdToMark}`,
    data: {currentReadStatus: currentReadStatus}
  }).then((res) => {;
    refreshBooks();
  }).catch((error) => {
    console.error(error);
  })
} // end handleMarkRead


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="markRead-btn" data-id="${book.id}" data-read-status="${book.isRead}">Mark as Read</button></td>
        <td><button class="delete-btn" data-id="${book.id}">X</button></td>
      </tr>
    `);
  }
}
