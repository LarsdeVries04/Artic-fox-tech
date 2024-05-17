import {category} from '../JAVASCRIPT/Category.js';
const menudiv = document.querySelector(".menudiv")
const menuopener = document.querySelector(".menuopener")
menuopener.addEventListener("click", ()=>{
    menudiv.classList.toggle("menumover");
    menuopener.classList.toggle("menuopenermover")
});


//Loading article data in form//
async function loadImages() {
    const responsebucket = await fetch('/upload', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (responsebucket.ok) {
        return await responsebucket.json();
    } else {
        throw new Error('Failed to fetch images');
    }
}


async function loadingArticleData(){
    const url = window.location.href;
    const urlParts = url.split("/");
    const urlid = urlParts[urlParts.length - 1];
    const responses = await fetch(`/API/ERP_article/${urlid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (responses.ok) {
        const Article = await responses.json();    
    const images = await loadImages();
    const image = images.find(img => img.id === Article.Aimage);
    const imageUrl = image ? `https://storage.googleapis.com/aftstorage/${image.id}` : '';
    document.querySelector(".imagediv").innerHTML = `<img class="articleimage" src="${imageUrl}" alt="${Article.Aname} image">`
    document.querySelector(".Aid").value = Article.ArtID;
    document.querySelector(".Aname").value = Article.Aname;
    document.querySelector(".Aproducttype").value = Article.Aproducttype;
    document.querySelector(".Acategory").value = Article.Acategory;
    document.querySelector(".Acostprice").value = Article.Acostprice;
    document.querySelector(".Asaleprice").value = Article.Asaleprice;
    document.querySelector(".Adiscount").value = Article.Adiscount;
    document.querySelector(".Astock").value = Article.Astock;
    document.querySelector(".APD").value = Article.Aproductdiscription;
    let filtercategory = [];
category.forEach(cat=> {
   filtercategory +=  `<option value="${cat.name}"></option>`
});
document.querySelector(".datalistcategory").innerHTML = filtercategory;
    } else {
        console.log("error ")
    };
}
loadingArticleData();
//Loading article data in form//

// Makes encripted string for image//
function uuidv4(){
    return([1e7] + 1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,(c)=>
    ( c ^
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15>>(c/4)))    
    ).toString(16)
    )};
// Makes encripted string for image//

//  function displayImage(event) {
//     const image =  URL.createObjectURL(event.target.files[0]);
//     console.log(image);}

// document.addEventListener("DOMContentLoaded", function() {
//     const uploadfileinput = document.querySelector(".Imgfile");
//     uploadfileinput.addEventListener("change", displayImage);
//     displayImage();
//     const imagediv = document.querySelector(".imagediv");
//     imagediv.src = image;
// });


//update article data//
let newFile;
const errormessage = document.querySelector(".errormessagediv");
const succesmessage = document.querySelector(".succesmessagediv");
const updatearticleform = document.querySelector(".updatearticleform");
updatearticleform.addEventListener("submit", async (event)=>{
event.preventDefault();

    // upload image//
    let image;
    let postid = uuidv4();
    let inputvalue = document.querySelector(".Imgfile");
    let file = inputvalue.files[0];
    if(file){
    let blob = file.slice(0, file.size, "image/jpeg");
    newFile = new File([blob], `${postid}_post.jpeg`, {type: "image/jpeg"});
    let formData = new FormData();
    formData.append("imgfile", newFile);
    fetch("/upload",{
    method: "POST",
    body: formData,
    })
    .then(res => res.text())
    .then((x) => console.log(x))
    image = postid;
    }else{
    image = Article.Aimage;
    };
    // upload image//

    // Sends updated articledata to mongoose//
const AAF = {
    ArtID: updatearticleform.querySelector("#Aid").value,
    Aname: updatearticleform.querySelector("#Aname").value,
    Aproducttype: updatearticleform.querySelector("#Aproducttype").value,
    Acategory: updatearticleform.querySelector("#Acategory").value,
    Acostprice: updatearticleform.querySelector("#Acostprice").value,
    Asaleprice: updatearticleform.querySelector("#Asaleprice").value,
    Adiscount: updatearticleform.querySelector("#Adiscount").value,
    Astock: updatearticleform.querySelector("#Astock").value,
    Aimage: `${image}_post.jpeg`,
    Aproductdiscription: updatearticleform.querySelector("#APD").value,
    Aactive: updatearticleform.querySelector("#Aactive").checked ? "true" : "false",
};
try {
    console.log("test try");
    const response = await fetch("/ERP_article/endpoint", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(AAF)
    });
    const responseData = await response.text();
    if (response.ok) {
        succesmessage.textContent = responseData;
        succesmessage.classList.add("succesvisable");
        errormessage.classList.remove("errorvisable");
    } else {
        errormessage.textContent = responseData;
        errormessage.classList.add("errorvisable");
        succesmessage.classList.remove("succesvisable");
    }
} catch (error) {
    errormessage.textContent = "Error adding article";
    errormessage.classList.add("errorvisable");
    succesmessage.classList.remove("succesvisable")
}
});
    // Sends updated articledata to mongoose//
//update article data//