(function() {
    function removeSponsorPanels() {
        document.querySelectorAll('.sih-global.sih-sponsor-panel.header').forEach(el => el.remove());
        document.querySelectorAll('div.sih-left-side-features-menu.sih-global').forEach(el => el.remove());
        document.querySelectorAll('div.sih-features-button').forEach(el => el.remove());
        document.querySelectorAll('a#sih-header-notifications.sih-header-notifications').forEach(el => el.remove());
        document.querySelectorAll('a#sih-header-cart.sih-global-menu__icon').forEach(el => el.remove());
        document.querySelectorAll('a.sih-subscribe-donat.sih-global').forEach(el => el.remove());
        document.querySelectorAll('.sih-link submenuitem').forEach(el => el.remove());
    }
    removeSponsorPanels();
    const observer = new MutationObserver(removeSponsorPanels);
    observer.observe(document.body, { childList: true, subtree: true });
})();