/*
Create (új sor, új objektum)
Read (táblázat lista)
Update (sor (objektum) módoisítás)
Delete (sor tötlés)

CRUD műveletek
*/

//state

state = {
    //Adatstruktúra
    products: [
        {
            id: idGen(),
            name: "JBL Fekete Fejhallgató",
            price: 25999,
            quantity: 1000,
            picture: "imidzs/feherJBL.webp",
            isInStock: true
        },
        {
            id: idGen(),
            name: "JBL Fehér Fejhallgató",
            price: 15999,
            quantity: 2000,
            picture: "imidzs/feketeJBL2.jpg",
            isInStock: true
        },
        {
            id: idGen(),
            name: "JVC Fekete Fejhallgató",
            price: 12500,
            quantity: 4000,
            picture: "imidzs/feketeJVC.webp",
            isInStock: false
        },
        {
            id: idGen(),
            name: "JBL Gamer Fejhallgató",
            price: 38900,
            quantity: 1200,
            picture: "imidzs/gamerJBL.webp",
            isInStock: true
        },
        {
            id: idGen(),
            name: "JBL Piros Fejhallgató",
            price: 15000,
            quantity: 0,
            picture: "imidzs/download.jpg",
            isInStock: false
        }
        
        
    ],

    cart: [],

    event: "read", //milyen állapotban van: read, delete, update, create
    currentId: null //Update esetén itt tároljuk a módosítandó product id-jét
}

//#region Segéd függvények
//Űrlap megjelenítése
function formView(){
    document.getElementById("form").classList.remove("d-none")
}

//űrlap elrejtése
function formHide(){
    document.getElementById("form").classList.add("d-none")
}

//Id generátor
function idGen(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

//id alapján megkeresi az index-et: id -> index
function searchIndex(id){
    for (let index = 0; index < state.products.length; index++) {
        if (id === state.products[index].id) {
            return index;
        }
    }
}
//#endregion 

//Mégse gomb működtetése
document.getElementById("cancel-product").onclick=function(){
    state.event = "read";
    formHide();
};

//Create: Új áru gomb
document.getElementById("new-product").onclick = function(id){
    state.event = "create";
    //látszódjon az Új áru cím

    document.getElementById("title-new").classList.remove("d-none");
    document.getElementById("title-update").classList.add("d-none");
    formView();
};

//Save: Mentés gomb
document.getElementById("save-product").onclick = function(event){
    event.preventDefault();

    //Hozzájutás az adatokhoz
    let name = document.getElementById("name").value;
    let price = +document.getElementById("price").value;
    let isInStock = document.getElementById("isInStock").checked;

    //validálás
    let errorList = [];
    if (! (name)){
        console.log("namehiba");
        document.getElementById("name-label").classList.add("text-danger");
        errorList.push("Name hiba");
    }else{
        document.getElementById("name-label").classList.remove("text-danger");
    }
    if (! (price)){
        console.log("namehiba");
        document.getElementById("price-label").classList.add("text-danger");
        errorList.push("Price hiba");
    }else{
        document.getElementById("price-label").classList.remove("text-danger");
    }

    if (errorList.length >0) {
        return;
    }

   //alapban generálunk
    let id = idGen();
    if(state.event === "update") {
        //update: az kéne, amire kattintottunk
        id = state.currentId;
    }
  

    let product = {
        id: id,
        name: name,
        price: price,
        isInStock: isInStock
    }

    if (state.event == "create" ) {
        state.products.push(product);
    }
   else if (state.event = "update") {
        let index = searchIndex(id);
        state.products[index] = product;
    }
    
    renderProducts();
    formHide()

    //mezők ürítése
    document.getElementById("name").value = null;
    document.getElementById("price").value = null;
}

//Kosár megmutatása
function cartRender(){
    //kosár ablak megjelenítése
    cardBoxView();
}

//kosár áru mennyiség kiszámolása, és beírása
function renderCartCount(){
    //mennyi áru van a kosárban?
    let count = state.cart.length;
    //Írd ki ezt az értéket a "cart-count"-ba
    document.getElementById("cart-count").innerHTML=count;
}

//Törlés a kosárból
//issue: Törlés a kosárból
function deleteFromCart(id){
    console.log("deleteFromCart(id)");
}

//A fizetés folymata
//issue: ki kell doglozni a fizetés folymatát
function payRender(){
    console.log("payRender()");
    cartBoxHide();
}

//Tovább vásárolok
function continueBy(){
    console.log("continueBy()");
    cartBoxHide();
}

//Kosár eltüntetése
function cartBoxHide(){
    document.getElementById("cart-box").classList.add("d-none");
}

//kosár megjelenítése
function cardBoxView(){
    document.getElementById("cart-box").classList.remove("d-none");

}


    

//Read: product lista
function renderProducts(){
    state.event = "read";
    let prodctsHtml = "";
    
    state.products.forEach(product => {
        prodctsHtml += `
        <div class="col">
            <div class="card ${product.quantity > 0 ? "" : "bg-warning"}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Termék ár: ${product.price} Ft</p>
                    <p class="card-text">Raktáron: ${product.quantity} db</p>
                </div>

                <div class="d-flex flex-row m-2">

                    <!-- Törlés -->
                    <button type="button" 
                        class="btn btn-danger btn-sm"
                        onclick="deleteProduct('${product.id}')"
                    >
                        Törlés
                    </button>

                    <!-- Módosítás -->
                    <button type="button" 
                        class="btn btn-success btn-sm ms-2"
                        onclick="updateProduct('${product.id}')"
                    >
                        Módosít
                    </button>
                </div>

                <div class="d-flex flex-row m-2">
                    <!-- Kosárba rakás -->
                    <button type="button" 
                        class="btn btn-outline-success col-4"
                        onclick="intoCart('${product.id}')"
                    >
                        <i class="bi bi-cart-plus"></i>
                    </button>
                    
                    <!-- Mennyit rakok a kosárba -->
                    <input
                        type="number"
                        class="form-control ms-2"
                        id="${product.id}"
                        value="1"
                    />
                </div>
            </div>
        </div>`;
        
    });
    document.getElementById("product-list").innerHTML = prodctsHtml;
}



//Kosár
//issue: Ugyanazt a terméket többször be lehet tenni
//issue: mennyiség mínuszba
//issue: negatívot megenged
//issue: nem kell az isInsStock: bevitel, és egyéb helyeken
function intoCart(id){
    //Derítsük ki az indexet
    let index = searchIndex(id);
    
    let quantity = +document.getElementById(`${id}`).value

    //Mennyiség korrektció:
    //le kell vonni az eredeti mennyiségből
    state.products[index].quantity = state.products[index].quantity - quantity;

    // let product = {
    //     id: state.products[index].id,
    //     name: state.products[index].name,
    //     price: state.products[index].price,
    //     quantity: quantity,
    //     isInStock: state.products[index].isInStock
    // }
    let product = {...state.products[index]}
    product.quantity = quantity;

    // let product = state.products[index];

    //a kosárba ezzel amennyiséggel kell berakni
    //push a kosárba
    state.cart.push(product);


    //újrarendereljük a termékeket
    renderProducts();
    renderCartCount()

    //logojuk a kosarat
    console.log(state.cart);

}



//Update: Módosít gomb függvénye
function updateProduct(id){
    state.event = "update"
    state.currentId = id;
    //kerüljenek bele az űrlapba a kártya datai
    let index = searchIndex(id);
    //beolvassuk az űrlapba
    let name = state.products[index].name
    let price = state.products[index].price
    let isInStock = state.products[index].isInStock
    document.getElementById("name").value = name;
    document.getElementById("price").value = price;
    document.getElementById("isInStock").checked = isInStock;

    document.getElementById("title-update").classList.remove("d-none");
    document.getElementById("title-new").classList.add("d-none");

    formView();
    console.log(id);
}

//Delete: Töröl gomb függvénye
function deleteProduct(id){
    state.event = "delete";
    let index = searchIndex(id)
    state.products.splice(index,1);
    renderProducts()
}

//Amikor betöltődött az oldal, elindul a: renderProducts függvény
window.onload = renderProducts;