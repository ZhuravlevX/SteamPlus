(function observeAndPatchNavContent3Collections() {
    function getUserId() {
        const link = document.querySelector('a[href*="steamcommunity.com/id/"], a[href*="steamcommunity.com/profiles/"]');
        if (link) {
            const m = link.href.match(/steamcommunity\.com\/(id|profiles)\/([^/]+)/);
            if (m) return m[2];
        }
        const locMatch = window.location.href.match(/steamcommunity\.com\/(id|profiles)\/([^/]+)/);
        if (locMatch) return locMatch[2];
        return null;
    }

    function getAppId(navContent) {
        const appLink = navContent.querySelector('a[href*="appid="]');
        if (appLink) {
            const m = appLink.href.match(/appid=(\d+)/);
            if (m) return m[1];
        }
        return null;
    }

    function getLang() {
        const html = document.documentElement;
        if (
            html &&
            html.tagName === "HTML" &&
            html.classList.contains("responsive") &&
            html.classList.contains("DesktopUI")
        ) {
            return html.getAttribute("lang");
        }
        return null;
    }

    function patchTooltip3() {
        const navContent = document.querySelector('div.navContent#tooltip-3');
        if (!navContent) return;
        if (navContent.querySelector('a[data-added-myaddons-link]') && navContent.querySelector('a[data-added-mycollections-link]')) return;
        const userId = getUserId();
        const appid = getAppId(navContent);
        if (!userId || !appid) return;

        const lang = getLang();
        const isRu = lang === "ru";
        const addonsText = isRu ? "Ваши аддоны" : "Your addons";
        const collectionsText = isRu ? "Ваши коллекции" : "Your collections";

        const hr = document.createElement('hr');
        const addonsLink = document.createElement('a');
        addonsLink.href = `https://steamcommunity.com/id/${userId}/myworkshopfiles/?appid=${appid}`;
        addonsLink.textContent = addonsText;
        addonsLink.setAttribute('data-added-myaddons-link', '1');
        addonsLink.style.display = 'block';
        addonsLink.style.margin = '8px 0';
        const collectionsLink = document.createElement('a');
        collectionsLink.href = `https://steamcommunity.com/id/${userId}/myworkshopfiles/?section=collections&appid=${appid}`;
        collectionsLink.textContent = collectionsText;
        collectionsLink.setAttribute('data-added-mycollections-link', '1');
        collectionsLink.style.display = 'block';
        collectionsLink.style.margin = '8px 0';
        navContent.appendChild(hr);
        navContent.appendChild(addonsLink);
        navContent.appendChild(collectionsLink);
    }

    const observer = new MutationObserver(() => {
        patchTooltip3();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    patchTooltip3();
})();