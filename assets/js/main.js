const BASE_url = "https://dummyjson.com";
// let clikedProduct = {
//     "urunid": 1
// };
// if (!localStorage.getItem("urunid")) {
//     let clikedProduct = localStorage.setItem("urunid", JSON.stringify(clikedProduct));
// }
// else {
//     clikedProduct = [];
// }
let clikedProduct;
function localStorageExists(){
    if (localStorage.getItem("urunid")) {
        clikedProduct = JSON.parse(localStorage.getItem("urunid"));
    }
    else {
        clikedProduct = {urunid:0};
    }
    return clikedProduct;
}
function saveToLocalStorage(object){
    let clikedProduct = localStorageExists();
    clikedProduct = object;
    localStorage.setItem("urunid", JSON.stringify(clikedProduct));
}

const urunListe = qs(".urunListe");
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
    console.log(response);
    const items = response.products;
    return items;
}


async function showItems(){
    const products = await getItems("products?limit=100");
    for (const product of products) {

        urunListe.innerHTML += `
        <a href="../../index.html" class="urunDiv" data-urunid = "${product.id}">
            <img src="${product.images[0]}" alt="anaResim">
            <div class="urunBilgi">

                <p class="baslik">${product.title}</p>
                <p class="urunAciklama">${product.description}</p>
                <p class="rating">Rating: ${product.rating}</p>
                <div class="fiyat">
                    <del class="eskiFiyat">${(product.price*100/(100-product.discountPercentage)).toFixed()}</del>
                    <p class="yeniFiyat">${product.price}</p>
                </div>
                

            </div>
        
        </a>`;
    }

    const urunDivs = qsAll(".urunDiv");
    for (const urunDiv of urunDivs) {
        urunDiv.addEventListener("click", function(){
            clikedProduct = Number(this.dataset.urunid);
            console.log(clikedProduct);
            saveToLocalStorage({
                "urunid":`${clikedProduct}`
            });
        })
    }
    
}

function init(){
    showItems();
}
init();