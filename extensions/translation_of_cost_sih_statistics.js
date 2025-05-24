(function() {
    function replaceRuLabels() {
        const html = document.documentElement;
        if (
            html &&
            html.tagName === "HTML" &&
            html.classList.contains("responsive") &&
            html.classList.contains("DesktopUI") &&
            html.getAttribute("lang") === "ru"
        ) {
            document.querySelectorAll('div.accountLabel').forEach(div => {
                const txt = div.textContent.trim();
                if (txt === "Store Purchases:") div.textContent = "Покупки в магазине:";
                if (txt === "Market Transaction:") div.textContent = "Рыночные транзакции:";
                if (txt === "Gift Purchases:") div.textContent = "Траты на подарки:";
                if (txt === "In-Game Purchases:") div.textContent = "Внутриигровые покупки:";
                if (txt === "Total Spent:") div.textContent = "Всего потрачено:";
            });
            document.querySelectorAll('p').forEach(p => {
                if (p.textContent.trim() === "This button allows you to refresh the data on funds spent in the Steam store")
                    p.textContent = "Эта кнопка позволяет обновить данные о средствах, потраченных в магазине Steam";
            });
            const btn = document.getElementById("sih-refresh-btn");
            if (btn && btn.textContent.trim() === "Update store history")
                btn.textContent = "Обновить историю покупок";
            const expenses = document.getElementById("total_expenses");
            if (expenses && expenses.textContent.trim() === "Loading...")
                expenses.textContent = "Загрузка...";
        }
    }

    replaceRuLabels();

    const observer = new MutationObserver(replaceRuLabels);
    observer.observe(document.body, { childList: true, subtree: true });
})();