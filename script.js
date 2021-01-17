// Radio Text and Showing ADD BOOK Button when author has inputs
let author = document.getElementById('author');
let radioBtn = document.getElementById('radioBtn');
let submitBtn = document.getElementById('submitBtn');

radioBtn.innerHTML = `
                        <div class="row">
                        <legend class="col-form-label col-sm-2 pt-0">Genre</legend>
                        <div class="col-sm-10">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="type" id="course" value="Course Book" checked>
                            <label class="form-check-label" for="course">
                        Course Book
                        </label>
                        </div>
                        <div class="form-check">
                                <input class="form-check-input" type="radio" name="type" id="fiction" value="Fiction">
                                <label class="form-check-label" for="fiction">
                        Fiction
                        </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="type" id="nonFiction" value="Non-Fiction" >
                                <label class="form-check-label" for="nonFiction">
                        Non-Fiction
                        </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="type" id="history" value="History/Literature">
                                <label class="form-check-label" for="history">
                        History and Literature
                        </label>
                            </div>
                            </div>
                        </div>
                    </div>
    `

author.addEventListener('input', showSubmitBtn);

function showSubmitBtn() {
    submitBtn.innerHTML = `
                            <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary">Add Book</button>
                            </div>
    `
}

// Book Constructor
function Book(name, author, genre) {
    this.name = name;
    this.author = author;
    this.genre = genre;
}

// Display Constructor
function Display() {}

// Prototype : Showing Old Books that are added
Display.prototype.showOld = function() {
    let books = localStorage.getItem('books');
    if (books == null) {
        booksObj = [];
    } else {
        booksObj = JSON.parse(books);
    }

    booksObj.forEach(function(books, index) {
        let tableBody = document.getElementById('tableBody');
        let bodyHtml = `
                        <tr class="bookList">
                            <th scope="row">${index+1}</th> 
                            <td class="nameBook">${books.Name}</td>
                            <td>${books.Author}</td>
                            <td>${books.Genre}</td>
                            <td><button type="button" id="${index}" onclick="deleteBook(this.id)" class="btn btn-danger">Delete</button></td>                            
                        </tr>
        `
        tableBody.innerHTML += bodyHtml;
    })
}

// Calling Show Old Prototype
let display1 = new Display();
display1.showOld();

// Prototype : Validate the details before adding the book
Display.prototype.validate = function(book) {
    if (book.name.length > 3 && book.author.length > 3) {
        return true;
    } else {
        return false;
    }
}

// Prototype : Adding Book in the UI
Display.prototype.add = function(book) {
    let tableBody = document.getElementById('tableBody');
    let bodyHtml = `
                    <tr class="bookList">
                        <th scope="row">${booksObj.length + 1}</th>
                        <td class="nameBook">${book.name}</td>
                        <td>${book.author}</td>
                        <td>${book.genre}</td>
                        <td></td>
                    </tr>
    `
    tableBody.innerHTML += bodyHtml;
}

// Prototype : Clear form after book has been added successfully
Display.prototype.clear = function() {
    libraryForm.reset();
}

// Prototype : Show Message - Success/Failure based on validation 
Display.prototype.show = function(message, text) {
    let status;
    if (message == "success") {
        status = "Success...";
    } else {
        status = "Error !!!"
    }
    let alert = document.getElementById('alert');
    alert.innerHTML = `
                            <div class="alert alert-${message} alert-dismissible fade show" role="alert">
                                <strong>${status}</strong> ${text}
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                            </div>
    `;
    setTimeout(() => {
        alert.innerHTML = '';
    }, 3000);

}


let libraryForm = document.getElementById('libraryForm');
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
        location.reload();
    }, 3500);

    let name = document.getElementById('bookName').value;
    let author = document.getElementById('author').value;
    let genre;

    // For Genre: Course, Fiction, Non-Fiction, history
    let course = document.getElementById('course');
    let fiction = document.getElementById('fiction');
    let nonFiction = document.getElementById('nonFiction');
    let history = document.getElementById('history');

    if (course.checked) {
        genre = course.value;
    } else if (fiction.checked) {
        genre = fiction.value;
    } else if (nonFiction.checked) {
        genre = nonFiction.value;
    } else if (history.checked) {
        genre = history.value;
    }

    let book = new Book(name, author, genre);
    console.log(book);

    let display = new Display();

    if (display.validate(book)) {
        display.add(book);
        display.clear();
        display.show('success', 'Congratulations, Your book has been added.');
    } else {
        display.show('danger', 'Sorry, Your data is incorrect. Please try again.');
    }


    // LocalStorage

    let books = localStorage.getItem('books');
    if (books == null) {
        booksObj = [];
    } else {
        booksObj = JSON.parse(books);
    }

    let myObj = {
        Name: name,
        Author: author,
        Genre: genre,
    }

    booksObj.push(myObj);
    localStorage.setItem('books', JSON.stringify(booksObj));
    console.log(booksObj);

}

// Delete books when delete button clicked
function deleteBook(index) {

    let display2 = new Display();
    display2.delete(index);
}

Display.prototype.delete = function(index) {
    let books = localStorage.getItem('books');
    if (books == null) {
        booksObj = [];
    } else {
        booksObj = JSON.parse(books);
    }

    booksObj.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(booksObj));

    display1.showOld();
    location.reload();
}

// Search Button Working
let search = document.getElementById('search');
search.addEventListener('input', searchBook);

function searchBook(element) {
    let inputVal = search.value.toLowerCase();
    let bookList = document.getElementsByClassName('bookList');
    let tableHeadingContent = document.getElementById('tableHeadingContent');

    if (inputVal == "") {
        location.reload();
    }
    Array.from(bookList).forEach(function(element) {
        let bookValue = element.getElementsByClassName('nameBook')[0].innerText;
        let bookValueLower = bookValue.toLowerCase();
        if (bookValueLower.includes(inputVal)) {
            element.style.display = "block";
            tableHeadingContent.innerHTML = "";
        } else {
            element.style.display = "none";
        }
    })

}