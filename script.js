firebase.auth().onAuthStateChanged((user)=>{
    if(user){
      var router = new Navigo(null, true, '#!');
var app = document.getElementById('app');

      // router.navigate('/');
$('.user_avatar').html(`
<a href="#!/profile"><div class="avatar">
<img src="${user.photoURL}">
</div></a>
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
        <a href="#!/add_book"><div class="floating_button"><img src="./images/plus.png"></div></a>
        <div class="search-bar">
    <div class="search-icon"><img src="../images/search.png"></div>
    <input autocomplete="off" id="search-book" placeholder="Search Book..." type="text" name="search"/>
    </div>

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
              <div class="b">
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
              </div>
              `
            }

            //searching...
            document.getElementById('search-book').addEventListener('keyup', e=>{
              if(e.key = 'Enter'){
                e.preventDefault();
                let filter = ($('#search-book')[0].value).toUpperCase();
                let allPost = document.querySelectorAll('.book_title');
                for(let i=0; i<allPost.length; i++){
                  tag = allPost[i].innerText.toUpperCase();
                  if(tag.indexOf(filter) > -1) {
                    allPost[i].parentNode.parentNode.style.display = "block";
                  } else{
                    allPost[i].parentNode.parentNode.style.display = "none";
                  }
    
                }
              }
            });

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

    "/cart": function(){
        app.innerHTML = `
        <div class="cart-bar">
        <div class="selected-item">Total Amount</div>
        <div class="total">0</div>
        </div>
         <div class="carts"></div>

         <center><button class="btn green buy-now">Buy Selected Books(<span id="sl-count"></span>)</button></center>


         <h5 class="order-head">Your Orders</h5>
         <div class="myOrder">
         <div class="order-status"></div>
         <div class="orders"></div>
         <div class="order-total"></div>
         </div>
        `

        const carts = document.querySelector('.carts');
        db.collection('users').doc(user.uid).collection('cart').onSnapshot(snap=>{
          let amount = 0;
          carts.innerHTML = '';
          let myCart = [];
          $('.buy-now').hide();            
            
          let selectedBooks = [];
         
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
            selectedBooks.push({
              cover: myCart[i].cover,
              title:  myCart[i].title,
              author: myCart[i].author,
              price: myCart[i].price
            })


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
            carts.innerHTML = `<center>
            <img src="./images/empty_cart.png" height="100px">       
            <h6>No items in your cart...</h6>
            </center>`
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

          $('.buy-now').click(function(){
            Swal.fire({
              title: 'Your bKash Transaction ID',
              html: `
              bKash No. 01571721957
              `,
              input: 'text',
              inputAttributes: {
                autocapitalize: 'off'
              },
              showCancelButton: true,
              confirmButtonText: 'Confirm',
              showLoaderOnConfirm: true,
              preConfirm: (login) => {}
            }).then((result) => {
              
              if (result.isConfirmed) {
                if((result.value).trim() == ""){
                  Swal.fire(
                    'Field Empty!',
                    'Please provide TransX ID!',
                    'error'
                  )
                }else{
                db.collection('sells').doc(user.uid).set({
                  uid: user.uid,
                  user: user.displayName,
                  books: selectedBooks,
                  transX: result.value,
                  isConfirmed: false,
                  amount: amount
                }).then(()=>{
                  Swal.fire({
                    title: 'Order placed!',
                    html: 'We will send you an email.',
                    icon: 'success',
                  });

                  window.location.reload();
                  
                });
              }
              }
            });
          })

          $('.delete').click(function(){
            db.collection('users').doc(user.uid).collection('cart').doc($(this)[0].id).delete().then(()=>{console.log('deleted')});
          });

          db.collection('sells').doc(user.uid).onSnapshot(snap=>{
             let myorder = snap.data();
               if(myorder === undefined){
                 $('.myOrder').html(
                 `<center>
            <img src="./images/empty_order.png" height="100px">       
            <h6>No order...</h6>
            </center>`
                 )
               }else{
             if(myorder.isConfirmed == false){
             $('.order-status').html(`Order Status: <div class="pending">Pending</div>`)
             }else{
              $('.order-status').html(`Order Status: <div class="confirm">Confirmed</div>`)
             }

             const orders = document.querySelector('.orders');
             orders.innerHTML = ``;
             for(let i=0; i<myorder.books.length; i++){
              orders.innerHTML += `
              <div class="list-item">
              <div class="list-img"><img src="${myorder.books[i].cover}"></div>
              <div class="list-details">
              <div class="list-title">${myorder.books[i].title}</div>
              <div class="list-author">${myorder.books[i].author}</div>
              <div class="list-price">${myorder.books[i].price} tk</div>
              </div>
              `
             }

             $('.order-total').html(`<div>Subtotal</div><div class="subtotal">= ${myorder.amount} tk</div>`)
            }
          });


         });

      

       
    },
    "/admin": function(){
      app.innerHTML = `
      <div class="order-list"></div>


      `

      db.collection('selles')
    },
    "/profile": function(){
       app.innerHTML = `
       <div class="profile">

       <div class="avatar_big"><img src="${user.photoURL}"></div>
       <div class="user_name">${user.displayName}</div>
       <div class="email">${user.email}</div>

       <button class="btn red logout">Logout</div>
       </div>
       `

       $('.logout').click(function(){
        firebase.auth().signOut();
        router.navigate('/');
        window.location.reload()
       })
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