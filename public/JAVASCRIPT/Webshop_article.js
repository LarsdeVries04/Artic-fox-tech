const articleboxdiv = document.querySelector(".articleboxdiv")


async function loadartdata() {
    const url = window.location.href;
    const urlParts = url.split("/");
    const urlname = urlParts[urlParts.length - 2];
    const url_id = urlParts[urlParts.length - 1];
    urlid = urlname + "/" + url_id;
const responseartdata = await fetch(`/API/webshop/article/${urlid}`,{
    method: "GET",
    headers: {
        "Content-Type": "application/json"
},
});
if(responseartdata.ok){
    const art = await responseartdata.json();
    document.title = `${art.Aname} | Artic Fox Tech`;
    let timenow = new Date();
    timenow.setDate(timenow.getDate() + 2)
    const options = { weekday: 'long' };
    let dateintwodays = timenow.toLocaleString('en-US', options);
    const imageUrl = `https://storage.googleapis.com/aftstorage/${art.Aimage}`;
    const price = art.Adiscount > 0 ? art.Asaleprice * (1 - art.Adiscount * 0.01) : art.Asaleprice;
    const outofstock = art.Astock < 1 ? '<div class="outofstockdiv">Out of stock</div>' :
    `<div class="instockdiv">In stock</div><div class="deliverytimediv">Ordered before 11:59 PM, delivered ${dateintwodays}</div>`;

    const discountdiv = art.Adiscount > 0 ?
    `<div class="articlepricediv">
        <div class="topdiv">€${price.toFixed(2)}
            <div class="discountdiv">Sale ${art.Adiscount}%</div>
        </div>
        <div class="originalpricediv">Original price: €${art.Asaleprice.toFixed(2)}</div>
    </div>` :
    `<div class="articlepricediv"><span>€</span>${art.Asaleprice.toFixed(2)}</div>`;

    const articlestructure = `
    <div class="topbox">
        <a class="backbutton" href="/webshop">Back</a>
        <div class="articletitlediv">${art.Aname}</div>
    </div>
    <div class="middlebox"> 
        <div class="leftboxdiv">
                <img class="artimage" src="${imageUrl}" alt="">
        </div>
        <div class="rightboxdiv">
        <div class="pricediv">${discountdiv}</div>
            <div class="Articlecategorydiv">Category: ${art.Acategory}</div>
            <div class="articlestockdiv">${outofstock}</div>
            <div class="symboldiv">
                <div class="shoppingcartdiv"><i class="fa-solid fa-cart-shopping"></i></div>
                <div class="likediv"><i class="fa-regular fa-heart"></i></div>
            </div>
        </div>
</div>
<div class="bottombox">
        <div class="productdescriptiondiv"><div class="titledescription">Product description</div>
        <div class="descriptioncontents">${art.Aproductdiscription}</div>
    </div>
    </div>`
    articleboxdiv.innerHTML = articlestructure;
}else {
    console.log("error ")
};};
loadartdata();