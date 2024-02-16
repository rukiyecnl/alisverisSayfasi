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
        <tr data-id=${product.id}>
              <td>${product.title}</td>
              <td><button class="duzenle" data-id=${product.id}>Düzenle</button></td> 
              <td><button class="sil" data-id=${product.id}>Sil</button></td>           
        </tr>

        `;
    }

    // bindEventsAll(".duzenle", "click", editProduct);
    // bindEventsAll(".sil", "click", deleteProduct);
    
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
        "id": createUniqueId(),
        "title": formObj.title
    });
    table.innerHTML += `
    <tr data-id=${response.id}>
        <td>${response.title}</td>
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