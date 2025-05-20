(function observeAndPatchNavContent3Collections() {
    // Универсально получаем id пользователя
    function getUserId() {
        // Сначала ищем ссылку на профиль
        const link = document.querySelector('a[href*="steamcommunity.com/id/"], a[href*="steamcommunity.com/profiles/"]');
        if (link) {
            const m = link.href.match(/steamcommunity\.com\/(id|profiles)\/([^/]+)/);
            if (m) return m[2];
        }
        // Или пробуем взять из URL
        const locMatch = window.location.href.match(/steamcommunity\.com\/(id|profiles)\/([^/]+)/);
        if (locMatch) return locMatch[2];
        return null;
    }

    // Получаем appid (ищем в ссылках внутри tooltip-3)
    function getAppId(navContent) {
        // Пробуем найти ссылку с appid
        const appLink = navContent.querySelector('a[href*="appid="]');
        if (appLink) {
            const m = appLink.href.match(/appid=(\d+)/);
            if (m) return m[1];
        }
        return null;
    }

    // Проверяем и патчим содержимое tooltip-3
    function patchTooltip3() {
        const navContent = document.querySelector('div.navContent#tooltip-3');
        if (!navContent) return;

        // Проверяем, добавляли ли уже свою ссылку
        if (navContent.querySelector('a[data-added-myaddons-link]') && navContent.querySelector('a[data-added-mycollections-link]')) return;

        const userId = getUserId();
        const appid = getAppId(navContent);
        if (!userId || !appid) return;

        // Создаём <hr>, ссылку "Ваши аддоны" и ссылку "Ваши коллекции"
        const hr = document.createElement('hr');

        const addonsLink = document.createElement('a');
        addonsLink.href = `https://steamcommunity.com/id/${userId}/myworkshopfiles/?appid=${appid}`;
        addonsLink.textContent = 'Ваши аддоны';
        addonsLink.setAttribute('data-added-myaddons-link', '1');
        addonsLink.target = '_blank';
        addonsLink.style.display = 'block';
        addonsLink.style.margin = '8px 0';

        const collectionsLink = document.createElement('a');
        collectionsLink.href = `https://steamcommunity.com/id/${userId}/myworkshopfiles/?section=collections&appid=${appid}`;
        collectionsLink.textContent = 'Ваши коллекции';
        collectionsLink.setAttribute('data-added-mycollections-link', '1');
        collectionsLink.target = '_blank';
        collectionsLink.style.display = 'block';
        collectionsLink.style.margin = '8px 0';

        // Добавляем в самый конец navContent
        navContent.appendChild(hr);
        navContent.appendChild(addonsLink);
        navContent.appendChild(collectionsLink);
    }

    // MutationObserver следит за появлением tooltip-3
    const observer = new MutationObserver(() => {
        patchTooltip3();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // На всякий случай, применяем сразу при запуске
    patchTooltip3();
})();