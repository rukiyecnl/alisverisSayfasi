const BASE_url = "https://dummyjson.com";

const dialog = qs(".alisverisOnay");
const urunAlani = qs(".urunAlani");
let clickedProductid;
let localAdet = [];
let adet = 0;

function qs(element){
    const htmlElementi = document.querySelector(element);
    return htmlElementi;
}
function qsAll(element){
    const htmlElementiAll = document.querySelectorAll(element);
    return htmlElementiAll;
}


function localStorageUrunidExists(){
    if (localStorage.getItem("urunid")) {
        clickedProductid = JSON.parse(localStorage.getItem("urunid"));
    }
    else {
        clickedProductid = {urunid:0};
    }
    console.log(clickedProductid);
    return clickedProductid.urunid;
}

if (!localStorage.getItem("adet")) {
    localStorage.setItem("adet", JSON.stringify(localAdet));
}

function localStorageAdetStok(){
    if (localStorage.getItem("adet")) {
        localAdet = JSON.parse(localStorage.getItem("adet"));
    }
    else{
        localAdet = [];
    }
    return localAdet;
}

function saveToLocalAdet(object){
    let sepetLocal = localStorageAdetStok();
    sepetLocal.push(object);
    localStorage.setItem("adet", JSON.stringify(sepetLocal));
}

async function getSpecificItem(endpoint){
    const response = await fetch(`${BASE_url}/${endpoint}`);
    const item = await response.json();
    // const items = response.products;
    return item;
}

function bindEventsAll(selector, eventType, cbFunction){
    const elements = qsAll(selector);
    for (const element of elements) {
        element.addEventListener(eventType, cbFunction)
    }
}

async function showItem(){
    let yeniId = localStorageUrunidExists();
    console.log(typeof yeniId);
    const product = await getSpecificItem(`products/${yeniId}`);
    
        urunAlani.innerHTML = `
        <div class="fotografAlani" data-id="${yeniId}">
            <img class="buyukResim" src="assets/img/buyukResim.png" alt="anaFoto">
            <ul class="urunFotolari">
                
            </ul>
        </div>
        <div class="urunBilgisiAlani">
            <p class="companyName">${product.brand}</p>
            <p class="type">${product.title}</p>
            <p class="desc">${product.description}
            </p>
            <div class="indirim-yuzde">
                <p class="indirimliFiyat">$<span>${product.price}</span></p>
                <p class="yuzde"><span>${product.discountPercentage}</span>%</p>
            </div>

            <del class="indirimsizFiyat">$<span>${(product.price*100/(100-product.discountPercentage)).toFixed()}</span></del>

            <div class="adet-ekleBtn">

                <div class="urunAdet">
                    <a href="#" class="urunAzalt">
                        <img src="assets/img/azalt.png" alt="">
                    </a>
                    <strong class="UrunAdet">${adet}</strong>
                    <a href="#" class="urunEkle">
                        <img src="assets/img/plus.png" alt="">
                    </a>
                </div>

                <button class="addToChartBtn" ><img src="assets/img/sepetBeyaz.png" alt="sepet">Add to cart</button>
            </div>

        </div>`;

        const urunFotolari = qs(".urunFotolari");
        const buyukResim = qs(".buyukResim");
        buyukResim.src = product.thumbnail;
        
        for (const image of product.images) {
            urunFotolari.innerHTML += `<img class="images" src="${image}" alt="foto1">`
        }

        bindEventsAll(".images", "click", chooseBigPhoto)
        adetArttir(product.stock);
        adetAzalt();
        handleAddBtn(yeniId);
        handleDialog();

}
function chooseBigPhoto(){
    const buyukResim = qs(".buyukResim");
    buyukResim.src = this.src;
}

function adetAzalt(){
    const urunAzalt = qs(".urunAzalt");
    const UrunAdet = qs(".UrunAdet");
    urunAzalt.addEventListener("click", function(e){
        e.preventDefault();
        if (adet > 0) {
            adet--;
            UrunAdet.innerHTML = adet;
        }
    })
}

function adetArttir(stock){
    const urunEkle = qs(".urunEkle");
    const UrunAdet = qs(".UrunAdet");
    urunEkle.addEventListener("click", function(e){
        e.preventDefault();
        if (adet < stock) {
           adet++; 
        }
        UrunAdet.innerHTML = adet;
    })
}
function handleAddBtn(yeniId){
    const urunSepetBilgi = qs(".urunSepetBilgi");
    const addToChartBtn = qs(".addToChartBtn");
    addToChartBtn.addEventListener("click", function(e){
        e.preventDefault();
        dialog.showModal();
        urunSepetBilgi.innerHTML += `<li ${yeniId}>X<span>${adet}</span></li>`;
        const obje = yeniId
        
        for (const sepet of localAdet) {
            if (yeniId.urunid == sepet) {
                break;
            }
            else{
                saveToLocalAdet(obje);
            }
        }
    })
}

function handleDialog(){
    const alisverisOnayBtn = qs(".alisverisOnay button");
    alisverisOnayBtn.addEventListener("click", function(e){
        e.preventDefault();
        dialog.close();
    })
}

const sepet = qs(".sepet");
const sidenav = qs(".sidenav");
const container = qs(".container");

function sepetBar(){
   
    sepet.addEventListener("click", function(e){
        e.preventDefault();
        sidenav.style.width = "250px";
        container.style.marginRight = "300px";
    })
}

function sepetBarClose(){
    const closebtn = qs(".closebtn");
    closebtn.addEventListener("click", function(e){
        e.preventDefault();
        sidenav.style.width = "0px";
        container.style.marginRight = "0px";
    })
}


showItem();
sepetBar();
sepetBarClose();
