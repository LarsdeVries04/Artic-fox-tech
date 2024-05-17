const menudiv = document.querySelector(".menudiv")
const menuopener = document.querySelector(".menuopener")
menuopener.addEventListener("click", ()=>{
    menudiv.classList.toggle("menumover");
    menuopener.classList.toggle("menuopenermover")
});