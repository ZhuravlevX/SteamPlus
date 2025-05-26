(async function() {
  if (document.readyState === "loading") {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
  }
  try {
    const html = document.documentElement;
    const isRu = html && html.getAttribute("lang") === "ru";
    const labelCollectionSize = isRu ? "Размер коллекции" : "Collection size";
    const labelCounting = isRu ? "Считаем..." : "Counting...";
    const holders = document.querySelectorAll('.rightSectionHolder');
    if (!holders.length) return;
    const holder = holders[holders.length - 1];
    const leftCol = holder.querySelector('.detailsStatsContainerLeft');
    const rightCol = holder.querySelector('.detailsStatsContainerRight');
    if (!leftCol || !rightCol) return;
    if (![...leftCol.querySelectorAll('.detailsStatLeft')].some(div =>
        div.textContent.trim().toLowerCase().includes(isRu ? 'размер коллекц' : 'collection size'))) {
      const leftDiv = document.createElement('div');
      leftDiv.className = 'detailsStatLeft';
      leftDiv.textContent = labelCollectionSize;
      leftCol.appendChild(leftDiv);
    }
    let rightDiv = rightCol.querySelector('.detailsStatRight[data-collection-size]');
    if (!rightDiv) {
      rightDiv = document.createElement('div');
      rightDiv.className = 'detailsStatRight';
      rightDiv.setAttribute('data-collection-size', '1');
      rightDiv.textContent = labelCounting;
      rightCol.appendChild(rightDiv);
    }
    const modLinks = Array.from(document.querySelectorAll('.collectionItemDetails a'))
        .map(a => a.href)
        .filter(href => href.includes('/sharedfiles/filedetails/?id='));
    if (!modLinks.length) {
      rightDiv.textContent = '0 MB';
      return;
    }
    const POOL = 32;
    let totalSize = 0;
    let processed = 0;
    function parseSize(html) {
      const match = html.match(/<div[^>]+class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB|B)<\/div>/i);
      if (!match) return 0;
      let val = parseFloat(match[1].replace(',', '.'));
      let unit = match[2];
      if (unit === 'GB') return val * 1024;
      if (unit === 'MB') return val;
      if (unit === 'KB') return val / 1024;
      if (unit === 'B')  return val / 1024 / 1024;
      return 0;
    }
    async function fetchModSize(url) {
      try {
        const resp = await fetch(url, {cache: "force-cache"}); // агрессивное кеширование, если поддерживается
        if (!resp.ok) return 0;
        const html = await resp.text();
        return parseSize(html);
      } catch {
        return 0;
      }
    }
    async function processPool(links, poolSize, onProgress) {
      let i = 0, sum = 0;
      const results = new Array(links.length);
      async function worker() {
        while (i < links.length) {
          const idx = i++;
          results[idx] = fetchModSize(links[idx]).then(size => {
            sum += size;
            onProgress(idx + 1, links.length, sum);
          });
        }
      }
      const workers = Array.from({length: poolSize}, worker);
      await Promise.all(workers);
      await Promise.all(results);
      return sum;
    }
    rightDiv.textContent = `${labelCounting} 0 / ${modLinks.length}`;
    const sum = await processPool(modLinks, POOL, (done, total, sum) => {
      if (done % 5 === 0 || done === total) rightDiv.textContent = `${labelCounting} ${done} / ${total}`;
    });
    if (sum * 1024 < 1) {
      rightDiv.textContent = `${sum.toFixed(6)} MB`;
    } else if (sum < 1024) {
      rightDiv.textContent = `${sum.toFixed(2)} MB`;
    } else {
      rightDiv.textContent = `${(sum / 1024).toFixed(2)} GB`;
    }
  } catch (e) {}
})();