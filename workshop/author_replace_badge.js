(function replaceAuthorBadges() {
    document.querySelectorAll('span.commentthread_workshop_authorbadge').forEach(span => {
        span.innerHTML = span.innerHTML
            .replace(/\[создатель\]/gi, '★')
            .replace(/\[Разработчик\]/gi, '★')
            .replace(/\[author\]/gi, '★')
            .replace(/\[developer\]/gi, '★');
    });
})();