const menudiv = document.querySelector(".menudiv")
const menuopener = document.querySelector(".menuopener")
menuopener.addEventListener("click", ()=>{
    menudiv.classList.toggle("menumover");
    menuopener.classList.toggle("menuopenermover")
});

const linkdiv = document.querySelector(".linkdiv")

async function getarticledata(){
const response = await fetch("/ERPAM", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
});
if(response.ok){
const responseData = await response.json();
console.log(responseData)
let totalarticles = [];
if(responseData.length < 1){
totalarticles = "<div class='noarticlesdiv'>There are no articles that meet the criteria</div>"
}else{
responseData.forEach(article => {
     totalarticles += `<div class="articlediv"><div class="aid">${article.ArtID}</div><div class="articlename">${article.Aname}</div><div class="acategory">${article.Acategory}</div><div class="astock">${article.Astock}</div> <a class="ahrefa" href="/ERP_article/${article.ArtID}"><i class="fa-solid fa-pen-to-square"></i></a></div>`;
});}
 linkdiv.innerHTML = totalarticles;
}};
getarticledata()





