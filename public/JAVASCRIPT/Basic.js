window.onscroll = function scrollFunction() {
    const upbutton1 = document.querySelector('.upbutton');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        upbutton1.classList.add('scrollup');
    } else {
        upbutton1.classList.remove('scrollup');
    }
};
document.querySelector('.upbutton').addEventListener('click', () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;  // For Chrome, Firefox, IE and Opera
})
