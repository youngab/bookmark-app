//Book class: Represent a Book
class Book {
    constructor(title,author,isbn){
        this.title = title,
        this.author = author,
        this.isbn = isbn 
    }
}

//UI class: Handle UI Task
class UI {
    static displayBooks(){
        const books = Store.getBooks();
       
       books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert (message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);

        //message timeout
        setTimeout(()=> document.querySelector('.alert').remove(),2000);
    }

    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

//Store class: Handle Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];            
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add Book
document.getElementById('book-form').addEventListener('submit', (e)=> {
    //prevent Default
    e.preventDefault();

    //Getting Form Values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //validate
    if (title ==='' || author ==='' || isbn ===''){
        UI.showAlert('All Fields Are Required', 'danger')
    }else{
        //instantiate book
        const book = new Book (title,author,isbn);

        //add book to UI
        UI.addBookToList(book);

        //add book to storage
        Store.addBook(book)

        //show message
        UI.showAlert('Book Added succesfully','success');

        //clear feilds
        UI.clearFields();
    }
});

//Event: Remove Book
document.getElementById('book-list').addEventListener('click', (e)=>{
    //remove book from ui
    UI.deleteBook(e.target);

    //remove from store
    Store.removeBook (e.target.parentElement.previousElementSibling.textContent);

    //show message
    UI.showAlert('Book Deleted succesfully','success');
});