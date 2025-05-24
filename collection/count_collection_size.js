(async function() {
  if (document.readyState === "loading") {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
  }

  try {
    const holders = document.querySelectorAll('.rightSectionHolder');
    if (holders.length === 0) {
      return;
    }
    const holder = holders[holders.length - 1];
    const leftCol = holder.querySelector('.detailsStatsContainerLeft');
    const rightCol = holder.querySelector('.detailsStatsContainerRight');
    if (!leftCol || !rightCol) {
      return;
    }

    let already = Array.from(leftCol.querySelectorAll('.detailsStatLeft'))
        .some(div => div.textContent.trim().toLowerCase().includes('размер коллекц'));
    if (!already) {
      const leftDiv = document.createElement('div');
      leftDiv.className = 'detailsStatLeft';
      leftDiv.textContent = 'Размер коллекции';
      leftCol.appendChild(leftDiv);
    }

    let rightDiv = Array.from(rightCol.querySelectorAll('.detailsStatRight'))
        .find(div => div.textContent.trim().match(/^(\d+([.,]\d+)?)\s*(GB|MB|KB)$/i));
    if (!rightDiv) {
      rightDiv = document.createElement('div');
      rightDiv.className = 'detailsStatRight';
      rightDiv.textContent = 'Считаем...';
      rightCol.appendChild(rightDiv);
    }

    function getModLinks() {
      return Array.from(document.querySelectorAll('.collectionItemDetails a'))
          .map(a => a.href)
          .filter(href => href.includes('/sharedfiles/filedetails/?id='));
    }

    async function getModSize(modUrl) {
      try {
        const resp = await fetch(modUrl);
        if (!resp.ok) {
          return null;
        }
        const html = await resp.text();
        const match = html.match(/<div[^>]*class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB|B)<\/div>/i);
        if (match) {
          let val = parseFloat(match[1].replace(',', '.'));
          let unit = match[2];
          let sizeMB;
          if (unit === 'GB') {
            sizeMB = val * 1024;
          } else if (unit === 'MB') {
            sizeMB = val;
          } else if (unit === 'KB') {
            sizeMB = val / 1024;
          } else if (unit === 'B') {
            sizeMB = val / 1024 / 1024;
          }
          return { sizeMB, url: modUrl };
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    }

    const modLinks = getModLinks();
    if (modLinks.length === 0) {
      rightDiv.textContent = '0 MB';
      return;
    }

    let totalSize = 0;
    let processed = 0;
    let errorCount = 0;

    for (const link of modLinks) {
      try {
        const result = await getModSize(link);
        if (result) {
          const { sizeMB } = result;
          totalSize += sizeMB;
        } else {
          errorCount++;
        }
      } catch (e) {
        errorCount++;
      }
      processed++;
      rightDiv.textContent = `Считаем... ${processed} / ${modLinks.length}`;
    }

    if (totalSize * 1024 < 1) {
      rightDiv.textContent = `${totalSize.toFixed(6)} MB`;
    } else if (totalSize < 1024) {
      rightDiv.textContent = `${totalSize.toFixed(2)} MB`;
    } else {
      rightDiv.textContent = `${(totalSize/1024).toFixed(2)} GB`;
    }
  } catch (e) {
  }
})();