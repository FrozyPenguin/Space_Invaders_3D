const scrollTopBtn = document.querySelector('#scrollTop');
scrollTopBtn.style.opacity = 0;
scrollTopBtn.style.zIndex = -1;
const content = document.querySelector('section.content');

content.addEventListener('scroll', function(event) {
    if(this.scrollTop > 20) {
        scrollTopBtn.style.opacity = 1;
        scrollTopBtn.style.zIndex = 1;
    }
    else {
        scrollTopBtn.style.opacity = 0;
        scrollTopBtn.style.zIndex = -1;
    }
})

scrollTopBtn.addEventListener('click', (event) => {
    content.scrollTop = 0;
})

/**
 * Sidebar
 */
document.querySelector("#sidebarCollapse").addEventListener('click', function () {
    document.querySelector("#sidebar").classList.toggle('active');
    const hamburger = this.querySelector('#hamburger');
    document.querySelector('#sidebar').classList.contains('active') ? hamburger.classList.add('open') : hamburger.classList.remove('open');
});

// document.querySelectorAll("#sidebar li a[href^='#']").forEach(element => {
//     element.addEventListener('click', function(event) {
//         event.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//             behavior: 'smooth'
//         });
//     })
// })