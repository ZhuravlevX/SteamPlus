(function() {
    const youtubePath = "M941.3,294.9c-10.3-38.8-40.7-69.4-79.2-79.7-69.9-18.8-350.1-18.8-350.1-18.8,0,0-280.2,0-350.1,18.8-38.6,10.4-68.9,40.9-79.2,79.7-18.7,70.3-18.7,217.1-18.7,217.1,0,0,0,146.7,18.7,217.1,10.3,38.8,40.7,69.4,79.2,79.7,69.9,18.8,350.1,18.8,350.1,18.8,0,0,280.2,0,350.1-18.8,38.6-10.4,68.9-40.9,79.2-79.7,18.7-70.3,18.7-217.1,18.7-217.1,0,0,0-146.7-18.7-217.1ZM420.4,645.2v-266.4l234.2,133.2-234.2,133.2Z";
    const twitterPath = "M595.2,443.5L920.9,65h-77.2l-282.8,328.7L335.1,65H74.6l341.5,497L74.6,959h77.2l298.6-347.1,238.5,347.1h260.5l-354.2-515.5h0ZM489.5,566.4l-34.6-49.5L179.6,123.1h118.5l222.2,317.8,34.6,49.5,288.8,413.1h-118.5l-235.7-337.1h0Z";
    const facebookPath = "M512,66c-246.3,0-446,199.7-446,446s144,384.7,338.3,432.9v-296.6h-92v-136.3h92v-58.7c0-151.8,68.7-222.2,217.7-222.2s77,5.5,97,11.1v123.5c-10.5-1.1-28.8-1.7-51.5-1.7-73.1,0-101.4,27.7-101.4,99.7v48.2h145.7l-25,136.3h-120.7v306.4c220.8-26.7,392-214.7,392-442.7S758.3,66,512,66Z";
    const redditPath = "M18 10.1c0-1-.8-1.8-1.8-1.7-.4 0-.9.2-1.2.5-1.4-.9-3-1.5-4.7-1.5l.8-3.8 2.6.6c0 .7.6 1.2 1.3 1.2.7 0 1.2-.6 1.2-1.3 0-.7-.6-1.2-1.3-1.2-.5 0-.9.3-1.1.7L11 2.9h-.2c-.1 0-.1.1-.1.2l-1 4.3C8 7.4 6.4 7.9 5 8.9c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5c.1.1.3.3.5.3v.5c0 2.7 3.1 4.9 7 4.9s7-2.2 7-4.9v-.5c.6-.3 1-.9 1-1.6zM6 11.4c0-.7.6-1.2 1.2-1.2.7 0 1.2.6 1.2 1.2s-.6 1.2-1.2 1.2c-.7 0-1.2-.5-1.2-1.2zm7 3.3c-.9.6-1.9 1-3 .9-1.1 0-2.1-.3-3-.9-.1-.1-.1-.3 0-.5.1-.1.3-.1.4 0 .7.5 1.6.8 2.5.7.9.1 1.8-.2 2.5-.7.1-.1.3-.1.5 0s.2.3.1.5zm-.3-2.1c-.7 0-1.2-.6-1.2-1.2s.6-1.2 1.2-1.2c.7 0 1.2.6 1.2 1.2.1.7-.5 1.2-1.2 1.2z";
    const sketchfabPath = "m 7.7215115,7.835445 4.3544155,-2.303813 0,4.987339 L 7.7468165,13 7.7215165,7.784809 M 1.9240383,5.531658 6.2531745,7.886082 6.2278445,13 1.8987349,10.518997 1.9240399,5.556964 M 6.9873475,1 1.8987345,3.936711 6.9873475,6.670899 12.101266,3.936711 6.9873475,1";

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
    const isRu = getLang() === "ru";
    const twitterWord = isRu ? "Твиттере" : "Twitter";
    const shareOnX = isRu ? "Поделиться в X" : "Share on X";
    const shareOnTwitter = isRu ? "Поделиться в Твиттере" : "Share on Twitter";
    const polycountTitle = isRu ? "Страница на Polycount" : "On Polycount";

    function createSVGIcon(svgPath, viewBox, width, height, color) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.verticalAlign = "middle";
        svg.style.display = 'inline-block';
        svg.style.fill = color || 'currentColor';
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', svgPath);
        svg.appendChild(path);
        return svg;
    }

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/youtube.png"]').forEach(img => {
        const svg = createSVGIcon(youtubePath, "0 0 960 960", img.width || 20, img.height || 20);
        svg.className = img.className;
        if (img.style.width) svg.style.width = img.style.width;
        if (img.style.height) svg.style.height = img.style.height;
        img.parentNode.replaceChild(svg, img);
    });

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/twitter.gif"]').forEach(img => {
        const svg = createSVGIcon(twitterPath, "0 0 1024 1024", img.width || 20, img.height || 20);
        svg.className = img.className;
        if (img.style.width) svg.style.width = img.style.width;
        if (img.style.height) svg.style.height = img.style.height;
        img.parentNode.replaceChild(svg, img);
    });

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/facebook.gif"]').forEach(img => {
        const svg = createSVGIcon(facebookPath, "0 0 1024 1024", img.width || 20, img.height || 20);
        svg.className = img.className;
        if (img.style.width) svg.style.width = img.style.width;
        if (img.style.height) svg.style.height = img.style.height;
        img.parentNode.replaceChild(svg, img);
    });

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/reddit.gif"]').forEach(img => {
        const svg = createSVGIcon(redditPath, "0 0 20 20", img.width || 20, img.height || 20);
        svg.className = img.className;
        if (img.style.width) svg.style.width = img.style.width;
        if (img.style.height) svg.style.height = img.style.height;
        img.parentNode.replaceChild(svg, img);
    });

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/sketchfab.png"]').forEach(img => {
        const svg = createSVGIcon(sketchfabPath, "0 0 14 14", img.width || 20, img.height || 20);
        svg.className = img.className;
        if (img.style.width) svg.style.width = img.style.width;
        if (img.style.height) svg.style.height = img.style.height;
        img.parentNode.replaceChild(svg, img);
    });

    document.querySelectorAll('img.toolsIcon[src="https://community.cloudflare.steamstatic.com/public/images//social/polycount.png"]').forEach(img => img.remove());
    document.querySelectorAll('div.box').forEach(box => {
        const titleEl = box.querySelector('.title');
        if (titleEl && titleEl.textContent.trim() === polycountTitle) {
            box.remove();
        }
    });

    var form = document.getElementById("KVTagsUpdateForm");
    if (form) {
        form.querySelectorAll(".box").forEach(box => {
            let title = box.querySelector(".title");
            let desc = box.querySelector(".description");
            if (title && title.textContent.includes(twitterWord)) {
                title.textContent = title.textContent.replace(new RegExp(twitterWord, "g"), "X");
            }
            if (desc && desc.textContent.includes(twitterWord)) {
                desc.textContent = desc.textContent.replace(new RegExp(twitterWord, "g"), "X");
            }
        });
    }
    document.querySelectorAll('a.general_btn.panel_btn').forEach(btn => {
        btn.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.includes(twitterWord)) {
                    node.textContent = node.textContent.replace(new RegExp(twitterWord, "g"), "X");
                }
                node.textContent = node.textContent.replace(/([^ ])(Страница)/g, '$1 Страница');
            }
        });
    });

    const twBtn = document.getElementById("SharePopupLink_Twitter");
    if (twBtn) {
        if (twBtn.title && twBtn.title.includes(twitterWord)) {
            twBtn.title = twBtn.title.replace(new RegExp(twitterWord, "g"), "X");
        }
        const span = twBtn.querySelector("span");
        if (span) {
            span.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(twitterWord)) {
                    node.textContent = node.textContent.replace(new RegExp(twitterWord, "g"), "X");
                }
            });
            const img = span.querySelector('img[src*="twitter_large.png"]');
            if (img) {
                const svg = createSVGIcon(twitterPath, "0 0 1024 1024", 32, 32, "#fff");
                svg.className = img.className;
                if (img.style.width) svg.style.width = img.style.width;
                if (img.style.height) svg.style.height = img.style.height;
                img.parentNode.replaceChild(svg, img);
            }
        }
        twBtn.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes(shareOnTwitter)) {
                node.textContent = node.textContent.replace(shareOnTwitter, shareOnX);
            }
        });
    }

    const fbBtn = document.getElementById("SharePopupLink_Facebook");
    if (fbBtn) {
        const span = fbBtn.querySelector("span");
        if (span) {
            const img = span.querySelector('img[src*="facebook_large.png"]');
            if (img) {
                const svg = createSVGIcon(facebookPath, "0 0 1024 1024", 32, 32, "#fff");
                svg.className = img.className;
                if (img.style.width) svg.style.width = img.style.width;
                if (img.style.height) svg.style.height = img.style.height;
                img.parentNode.replaceChild(svg, img);
            }
        }
    }
})();