firebase.auth().onAuthStateChanged((user)=>{
    if(user){
  console.log(user)
$('.user_avatar').html(`
<div class="avatar">
<img src="${user.photoURL}">
</div>
`)
var router = new Navigo(null, true, '#!');
var app = document.getElementById('app');


router.on({
    "/": function(){
        app.innerHTML = `
        <div class="books">
        <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
        </div>
        `

        const books = document.querySelector('.books');

        db.collection('books').onSnapshot(snap=>{
            books.innerHTML = '';
            snap.forEach(item => {
                books.innerHTML += `
                <div class="book_list_item">
                <div class="opt">
                <div class="options">
               <div class="add_cart">Add to Cart</div> 
               <div class="buy">Buy Now</div> 
                </div></div>
        
                <div class="book_cover"><img src="${item.data().cover}"></div>
                <div class="book_title">${item.data().title}</div>
                <div class="book_author">${item.data().author}</div>
                <div class="book_price">${item.data().price} tk</div>
                </div>
                
                `
            });

            $('.book_list_item').hover(function(){
                $($(this)[0].children[0]).show();
            },
            function(){
                $($(this)[0].children[0]).hide();
            });
        })
        
       
    }, 

    "/book_details/:id": function(params){
         
    },

    "/cart": function(){
        app.innerHTML = `
        <h1>Cart</h1>
        
        `
    },

    "/buy": function(){
        app.innerHTML = `
        <h1>Buy</h1>
        
        `
    },

    "/profile/:id": function(){

    },

    "/add_book": function(){
        app.innerHTML = `
        <h3>Add Book</h3>
        <form id="add_book">
        <div class="input-field">
        <input type="text" name="title" required>
        <label for="title">Book Title</label>
        </div>

        <div class="input-field">
        <input type="text" name="author" required>
        <label for="author">Book Author</label>
        </div>

        <div class="input-field">
        <input type="text" name="cover" required>
        <label for="cover">Book Cover Link</label>
        </div>

        <div class="input-field">
        <input type="number" name="price" required>
        <label for="price">Book Price</label>
        </div>


        <center><button class="btn green">Submit Book</div></center>
        </form>

        `

        const add_book = document.getElementById('add_book');
        
        add_book.addEventListener('submit', e=> {
            e.preventDefault();

            db.collection('books').add({
                title: add_book.title.value,
                author: add_book.author.value,
                cover: add_book.cover.value,
                price: add_book.price.value
            }).then(done=>{
                Swal.fire(
                    'Good job!',
                    'Book Added Successfully!',
                    'success'
                  );
                add_book.reset();
            });

        });
        
    }



}).resolve();

}
});