// filter on category, price, in stock, sale
// update cart and favorites number

const webshopdiv = document.querySelector(".webshopdiv");

async function loadImages() {
    const response = await fetch('/upload', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to fetch images');
    }
}

async function loadWebshop() {
    try {
        const images = await loadImages();
        const response = await fetch("/Webshop", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.ok) {
            const responseData = await response.json();

            let timenow = new Date();
            timenow.setDate(timenow.getDate() + 2)
            const options = { weekday: 'long' };
            let dateintwodays = timenow.toLocaleString('en-US', options);

            const webshoparticles = responseData.map(art => {
                const image = images.find(img => img.id === art.Aimage);
                const imageUrl = image ? `https://storage.googleapis.com/aftstorage/${image.id}` : '';

                const outofstock = art.Astock < 1 ? '<div class="outofstockdiv">Out of stock</div>' :
                    `<div class="instockdiv">In stock</div><div class="deliverytimediv">Ordered before 11:59 PM, delivered ${dateintwodays}</div>`;
                const price = art.Adiscount > 0 ? art.Asaleprice * (1 - art.Adiscount * 0.01) : art.Asaleprice;
                const discountdiv = art.Adiscount > 0 ?
                    `<div class="articlepricediv">
                        <div class="topdiv">€${price.toFixed(2)}
                            <div class="discountdiv">Sale ${art.Adiscount}%</div>
                        </div>
                        <div class="originalpricediv">Original price: €${art.Asaleprice.toFixed(2)}</div>
                    </div>` :
                    `<div class="articlepricediv"><span>€</span>${art.Asaleprice.toFixed(2)}</div>`;
                    
                return `<div class="articlediv">
                            <div class="leftboxdiv"><a href="/webshop/article/${art.Aname}/${art._id}"><img class="articleimage" src="${imageUrl}" alt="${art.Aname} image"></a></div>
                            <div class="middleboxdiv">
                                <div class="Articlenamediv"><a href="/webshop/article/${art.Aname}/${art._id}">${art.Aname}</a></div>
                                <div class="Articlecategorydiv"><span>category:</span><span> ${art.Acategory}</span></div>
                                <div class="articlestockdiv">${outofstock}</div>
                            </div>
                            <div class="rightboxdiv">
                                ${discountdiv}
                                <div class="symboldiv">
                                    <div class="shoppingcartdiv"><i class="fa-solid fa-cart-shopping"></i></div>
                                    <div class="likediv"><i class="fa-regular fa-heart"></i></div>
                                </div>
                            </div>
                        </div>`;
            }).join('');
            webshopdiv.innerHTML = webshoparticles;
        } else {
            throw new Error('Failed to fetch webshop data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

loadWebshop();