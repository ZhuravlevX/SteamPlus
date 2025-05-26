(async function() {
  if (document.readyState === "loading") {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
  }
  const html = document.documentElement;
  const isRu = html && html.getAttribute("lang") === "ru";
  const fileSizeLabel = isRu ? 'Размер файла: ' : 'File size: ';
  const modItems = Array.from(document.querySelectorAll('.collectionItem'));
  const POOL = 18; // Увеличено число потоков для лучшей скорости

  function parseSize(html) {
    const match = html.match(/<div[^>]*class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB|B)<\/div>/i);
    if (!match) return null;
    let val = parseFloat(match[1].replace(',', '.'));
    let unit = match[2];
    let sizeMB = val;
    if (unit === 'GB') sizeMB = val * 1024;
    if (unit === 'KB') sizeMB = val / 1024;
    if (unit === 'B')  sizeMB = val / 1024 / 1024;
    return { sizeMB, raw: match[1], unit };
  }

  function formatSize(sizeMB) {
    if (sizeMB == null) return '?';
    if (sizeMB < 1 / 1024) {
      let bytes = Math.round(sizeMB * 1024 * 1024);
      return `${bytes} B`;
    } else if (sizeMB < 1) {
      return `${(sizeMB * 1024).toFixed(2)} KB`;
    } else if (sizeMB < 1024) {
      return `${sizeMB.toFixed(2)} MB`;
    } else {
      return `${(sizeMB / 1024).toFixed(2)} GB`;
    }
  }

  function getModIdFromUrl(url) {
    const m = url.match(/[?&]id=(\d+)/);
    return m ? m[1] : null;
  }

  function getCache() {
    try {
      return JSON.parse(localStorage.getItem('modFileSizeCache') || '{}');
    } catch {
      return {};
    }
  }
  function setCache(cache) {
    localStorage.setItem('modFileSizeCache', JSON.stringify(cache));
  }

  const cache = getCache();
  const jobs = [];
  let i = 0;

  async function worker() {
    while (i < modItems.length) {
      const idx = i++;
      const item = modItems[idx];
      const link = item.querySelector('.collectionItemDetails a');
      if (!link) continue;
      if (item.querySelector('.mod-size-file-block')) continue;
      const nameBlock = item.querySelector('.workshopItemAuthorName');
      if (!nameBlock) continue;
      const fileSizeDiv = document.createElement('div');
      fileSizeDiv.className = 'mod-size-file-block';
      fileSizeDiv.style.marginTop = '2px';
      const sizeLabel = document.createElement('span');
      sizeLabel.textContent = fileSizeLabel;
      const sizeValue = document.createElement('span');
      sizeValue.textContent = '...';
      fileSizeDiv.appendChild(sizeLabel);
      fileSizeDiv.appendChild(sizeValue);
      nameBlock.parentNode.insertBefore(fileSizeDiv, nameBlock.nextSibling);

      const modId = getModIdFromUrl(link.href);
      let cacheEntry = modId && cache[modId];

      if (cacheEntry) {
        sizeValue.textContent = formatSize(cacheEntry.sizeMB);
        (async () => {
          try {
            const resp = await fetch(link.href);
            if (resp.ok) {
              const modPage = await resp.text();
              const newParsed = parseSize(modPage);
              if (newParsed && (cacheEntry.raw !== newParsed.raw || cacheEntry.unit !== newParsed.unit)) {
                sizeValue.textContent = formatSize(newParsed.sizeMB);
                cache[modId] = newParsed;
                setCache(cache);
              }
            }
          } catch {}
        })();
      } else {
        // Нет кэша, грузим как обычно
        fetch(link.href).then(async resp => {
          if (!resp.ok) return;
          const modPage = await resp.text();
          const result = parseSize(modPage);
          if (result) {
            sizeValue.textContent = formatSize(result.sizeMB);
            if (modId) {
              cache[modId] = result;
              setCache(cache);
            }
          } else {
            sizeValue.textContent = '?';
          }
        }).catch(() => { sizeValue.textContent = '?'; });
      }
    }
  }

  for (let w = 0; w < POOL; ++w) jobs.push(worker());
  await Promise.all(jobs);
})();