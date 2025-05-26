(function() {
    var isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
        (window.innerWidth && window.innerWidth <= 768);
    if (!isMobile) return;

    document.querySelectorAll('.favorite_badge_description').forEach(el => {
        el.remove();
    });
})();