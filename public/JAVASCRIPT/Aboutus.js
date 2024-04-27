window.onscroll = function scrollFunction() {
    const upbutton1 = document.querySelector('.upbutton');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        upbutton1.classList.add('scrollup');
    } else {
        upbutton1.classList.remove('scrollup');
    }
};