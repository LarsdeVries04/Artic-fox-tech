import {category} from '../JAVASCRIPT/Category.js';

// Left menudiv mover//
const menudiv = document.querySelector(".menudiv")
const menuopener = document.querySelector(".menuopener")
menuopener.addEventListener("click", ()=>{
    menudiv.classList.toggle("menumover");
    menuopener.classList.toggle("menuopenermover")
});
// Left menudiv mover//

//Add options for the category//
let filtercategory = [];
category.forEach(cat=> {
   filtercategory +=  `<option value="${cat.name}"></option>`
});
document.querySelector(".datalistcategory").innerHTML = filtercategory;
//Add options for the category//


// Makes encripted string for image//
function uuidv4(){
    return([1e7] + 1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,(c)=>
    ( c ^
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15>>(c/4)))    
    ).toString(16)
    )};
// Makes encripted string for image//


//Article ID//
const responses = await fetch("/articleid", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
});
if (responses.ok) {
    const ArticleID = await responses.text(); 
    document.querySelector(".artiddiv").innerHTML =`<label for="Aid">Article id:</label>
    <input type="text" id="Aid" name="Aid" class="Aid" value="${ArticleID}" disabled>`;
} else {
    document.querySelector(".artiddiv").innerHTML =`<label for="Aid">Article id:</label> <div>No Article-ID found</div>`
};
//Article ID//

//Adds new article//
let newFile;
const errormessage = document.querySelector(".errormessagediv");
const Addarticleform = document.querySelector(".Addarticleform");
const succesmessage = document.querySelector(".succesmessagediv");
Addarticleform.addEventListener("submit", async (event) => {
    event.preventDefault();

    // upload image//
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
    }
    // upload image//

    // Sends articledata to mongoose//
const AAF = {
    ArtID: Addarticleform.querySelector("#Aid").value,
    Aname: Addarticleform.querySelector("#Aname").value,
    Aproducttype: Addarticleform.querySelector("#Aproducttype").value,
    Acategory: Addarticleform.querySelector("#Acategory").value,
    Acostprice: Addarticleform.querySelector("#Acostprice").value,
    Asaleprice: Addarticleform.querySelector("#Asaleprice").value,
    Adiscount: Addarticleform.querySelector("#Adiscount").value,
    Astock: Addarticleform.querySelector("#Astock").value,
    Aimage: `${postid}_post.jpeg` ,
    Aproductdiscription: Addarticleform.querySelector("#APD").value,
    Aactive: Addarticleform.querySelector("#Aactive").checked ? "true" : "false",
};
Addarticleform.reset();
try {
    const response = await fetch("/ERPMNA", {
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
    // Sends articledata to mongoose//
//Adds new article//