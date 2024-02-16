const BASE_url = "https://dummyjson.com";
const table = qs("table tbody");

function qs(element){
    const htmlElementi = document.querySelector(element);
    return htmlElementi;
}

function qsAll(element){
    const htmlElementi = document.querySelectorAll(element);
    return htmlElementi;
}

async function getItems(endpoint){
    const request = await fetch(`${BASE_url}/${endpoint}`);
    const response = await request.json();
    const items = response.products;
    return items;
}

async function postItems(endpoints, bodyObj){
    const request = await fetch(`${BASE_url}/${endpoints}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj)
    });
    const items = request.json();
    return items;
}
async function putItems(endpoint, bodyObj){
    const request = await fetch(`${BASE_url}/${endpoint}`, {
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyObj)
    });
    const item = await request.json();
    return item;
}

async function deleteItem(endpoint){
    const response = await fetch(`${BASE_url}/${endpoint}`, {
        method: "DELETE",
    })
    const deleteItem = response.json();
    return deleteItem;
}

function bindEventsAll(selector, eventType, cbFunction){
    const elements = qsAll(selector);
    for (const element of elements) {
        element.addEventListener(eventType, cbFunction);
    }
}

function bindEvents(selector, eventType, cbFunction){
    const element = qs(selector);
    element.addEventListener(eventType, cbFunction);
}

async function showItems(){
    const products = await getItems("products?limit=100");
    for (const product of products) {

        table.innerHTML += `
        <tr data-id=${product.id} class="satirlar">
              <td>${product.title}</td>
              <td>${product.brand}</td>
              <td>${product.price}</td>
              <td><button class="duzenle" data-id=${product.id}>Düzenle</button></td> 
              <td><button class="sil" data-id=${product.id}>Sil</button></td>           
        </tr>

        `;
    }

    bindEventsAll(".duzenle", "click", editProduct);
    bindEventsAll(".sil", "click", deleteProduct);
    
}
async function deleteProduct(e){
    const productId = Number(e.target.dataset.id);
    const deleteitem = await deleteItem(`products/${productId}`);
    e.target.parentElement.parentElement.remove();

}
async function editProduct(e){
    const productId = Number(e.target.dataset.id);
    const alan = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
    alan.innerHTML = `<input type="text" name="alan" class="alan">
                      <button class="updateBtn">Güncelle</button>`;
    

    bindUpdateBtn(alan, productId);
    // bindEvents(".updateBtn", "click", bindUpdateBtn);
}
async function bindUpdateBtn(alan, productId){
    const updateBtn = qs(".updateBtn");
    const alanInput = qs(".alan");
    updateBtn.addEventListener("click", async function(e){
        e.preventDefault();
        const updateProduct = await putItems(`products/${productId}`, {
            "title": alanInput.value
         })

        
        alan.innerHTML = updateProduct.title;
    })
}

function addProduct(){
    bindEvents("#addProduct", "submit", handleAddBtn);
}

async function createUniqueId(){
    let id = 1;
    const products = await getItems("products?limit=100");
    for (const product of products) {
        if (product.id === id) {
            id++;
        }
    }
    return id;
}

async function handleAddBtn(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const response = await postItems("products/add", {
        "title": formObj.title,
        "brand": formObj.company,
        "price": formObj.price
    });
    table.innerHTML += `
    <tr data-id=${response.id} class="satirlar">
        <td>${response.title}</td>
        <td>${response.brand}</td>
        <td>${response.price}</td>
        <td><button class="duzenle" data-id=${response.id}>Düzenle</button></td> 
        <td><button class="sil" data-id=${response.id}>Sil</button></td>           
    </tr>`

    e.target.reset();
}



// function editProduct(){

// }

function init(){
    showItems();
    addProduct();
}
init();