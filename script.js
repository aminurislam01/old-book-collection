firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      var router = new Navigo(null, true, '#!');
var app = document.getElementById('app');

      // router.navigate('/');
$('.user_avatar').html(`
<div class="avatar">
<img src="${user.photoURL}">
</div>
`)

//getting cart
let allCart = [];
db.collection('users').doc(user.uid).collection('cart').onSnapshot(snap=>{
  allCart = [];
  snap.forEach(item=>{
       allCart.push({
        id: item.id,
        cover: item.data().cover,
        title: item.data().title,
        author: item.data().author,
        price: item.data().price
       });
   });
   $('.cart-data').html(`<div class="cart-count">${allCart.length}</div>`);
 });

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
            let count = 0;
            let booksArr = [];
            snap.forEach(item => {
              count++;
              booksArr.push({
                cover: item.data().cover,
                title: item.data().title,
                author: item.data().author,
                price: item.data().price,
                isSelected: false
              });
            });

            books.innerHTML = '';
            for(let i=0; i<booksArr.length; i++){
              books.innerHTML += `
              <div class="book_list_item">
              <div class="opt">
              <div class="options">
             <div id="${i}" class="add_cart">Add to Cart</div> 
              </div></div>
              <div class="book_cover"><img src="${booksArr[i].cover}"></div>
              <div class="book_title">${booksArr[i].title}</div>
              <div class="book_author">${booksArr[i].author}</div>
              <div class="book_price">${booksArr[i].price} tk</div>
              </div>
              `
            }

            $('.book_list_item').hover(function(){
                $($(this)[0].children[0]).show();
            },
            function(){
                $($(this)[0].children[0]).hide();
            });

            $('.add_cart').click(function(){
              db.collection('users').doc(user.uid).collection('cart').add(booksArr[parseInt($(this)[0].id)]).then(res=>{Swal.fire(
                'Added!',
                'Book Added to Cart Successfully!',
                'success'
              )});
            })
        
          })
    }, 

    "/book_details/:id": function(params){
         
    },

    "/cart": function(){
        app.innerHTML = `
        <div class="cart-bar">
        <div class="selected-item">Total Amount</div>
        <div class="total">0</div>
        </div>
         <div class="carts"></div>

         <center><button class="btn green buy-now">Buy Selected Books(<span id="sl-count"></span>)</button></center>
        `

        const carts = document.querySelector('.carts');
       
        db.collection('users').doc(user.uid).collection('cart').onSnapshot(snap=>{

          let amount = 0;
          carts.innerHTML = '';
          let myCart = [];
          $('.buy-now').hide();
         
          snap.forEach(item=>{
               myCart.push({
                id: item.id,
                cover: item.data().cover,
                title: item.data().title,
                author: item.data().author,
                price: item.data().price,
                isSelected: item.data().isSelected
               });
           });
           let c = 0;
           for(let i=0; i<myCart.length; i++){
             if(myCart[i].isSelected === true){
               amount += parseInt(myCart[i].price);
               c++;
               $('.buy-now').show();
              carts.innerHTML += `
            <div id="${myCart[i].id}|${myCart[i].price}|${i}" class="list-item">
            
            <div class="delete" id="${myCart[i].id}"><img src="./images/close.png"></div>
            
            <div class="list-img">
            <div><img src="${myCart[i].cover}"></div>
            <div class="selected"><img src="./images/select.png"></div>
            </div>

            <div class="list-details">
            <div class="list-title">${myCart[i].title}</div>
            <div class="list-author">${myCart[i].author}</div>
            <div class="list-price">${myCart[i].price} tk</div>
            </div>
            `
             }else{
               carts.innerHTML += `
               <div id="${myCart[i].id}|${myCart[i].price}|${i}" class="list-item">
               <div class="delete" id="${myCart[i].id}"><img src="./images/close.png"></div>
               <div class="list-img"><img src="${myCart[i].cover}"></div>
               <div class="list-details">
               <div class="list-title">${myCart[i].title}</div>
               <div class="list-author">${myCart[i].author}</div>
               <div class="list-price">${myCart[i].price} tk</div>
               </div>
               `
             }
            
          }

          if(myCart.length === 0){
            carts.innerHTML = `<h3>No items in your cart...</h3>`
          }

          $('.total').html(`${amount} tk`);
          $('#sl-count').text(c);

          $('.list-item').click(function(){
            let id = ($(this)[0].id).split('|');
            let itemId = id[0];
            let price = parseInt(id[1]);
            let index = parseInt(id[2]);
            
            
            db.collection('users').doc(user.uid).collection('cart').doc(itemId).update({
               isSelected: !myCart[index].isSelected
            });
            
            
          })

          $('.delete').click(function(){
            db.collection('users').doc(user.uid).collection('cart').doc($(this)[0].id).delete().then(()=>{console.log('deleted')});
          });


         });

      

       
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