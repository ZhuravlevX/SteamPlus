(async function() {
    if (document.readyState === "loading") {
      await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
    }
  
    try {
      // Берём последний rightSectionHolder на странице
      const holders = document.querySelectorAll('.rightSectionHolder');
      if (holders.length === 0) {
        console.error('Ошибка: Не найден ни один блок .rightSectionHolder на странице.');
        return;
      }
      const holder = holders[holders.length - 1];
      const leftCol = holder.querySelector('.detailsStatsContainerLeft');
      const rightCol = holder.querySelector('.detailsStatsContainerRight');
      if (!leftCol || !rightCol) {
        console.error('Ошибка: Не найдены .detailsStatsContainerLeft или .detailsStatsContainerRight.');
        return;
      }
  
      // Проверяем, нет ли уже строки "Размер коллекции"
      let already = Array.from(leftCol.querySelectorAll('.detailsStatLeft'))
        .some(div => div.textContent.trim().toLowerCase().includes('размер коллекц'));
      if (!already) {
        const leftDiv = document.createElement('div');
        leftDiv.className = 'detailsStatLeft';
        leftDiv.textContent = 'Размер коллекции';
        leftCol.appendChild(leftDiv);
      }
  
      // Добавляем справа блок для размера (если его ещё нет)
      let rightDiv = Array.from(rightCol.querySelectorAll('.detailsStatRight'))
        .find(div => div.textContent.trim().match(/^(\d+([.,]\d+)?)\s*(GB|MB|KB)$/i));
      if (!rightDiv) {
        rightDiv = document.createElement('div');
        rightDiv.className = 'detailsStatRight';
        rightDiv.textContent = 'Считаем...';
        rightCol.appendChild(rightDiv);
      }
  
      // Собираем все ссылки на моды
      function getModLinks() {
        return Array.from(document.querySelectorAll('.collectionItemDetails a'))
          .map(a => a.href)
          .filter(href => href.includes('/sharedfiles/filedetails/?id='));
      }
  
      // Получение размера одного мода (в мегабайтах), возвращает объект {sizeMB, sizeStr, url}
      async function getModSize(modUrl) {
        try {
          const resp = await fetch(modUrl);
          if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} при загрузке ${modUrl}`);
          }
          const html = await resp.text();
          const match = html.match(/<div[^>]*class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB)<\/div>/i);
          if (match) {
            let val = parseFloat(match[1].replace(',', '.'));
            let unit = match[2];
            let sizeMB, sizeStr;
            if (unit === 'GB') {
              sizeMB = val * 1024;
              sizeStr = `${val.toFixed(2)} GB`;
            } else if (unit === 'KB') {
              sizeMB = val / 1024;
              sizeStr = `${val.toFixed(2)} KB`;
            } else {
              sizeMB = val;
              sizeStr = `${val.toFixed(2)} MB`;
            }
            return { sizeMB, sizeStr, url: modUrl };
          } else {
            throw new Error(`Не найден блок размера на странице: ${modUrl}`);
          }
        } catch (e) {
          console.error(`Ошибка при получении размера для ${modUrl}: ${e.message}`);
          throw e;
        }
      }
  
      // Считаем общий размер коллекции
      const modLinks = getModLinks();
      if (modLinks.length === 0) {
        rightDiv.textContent = '0 MB';
        console.error('Ошибка: В коллекции не найдено ни одной ссылки на мод.');
        return;
      }
  
      let totalSize = 0;
      let processed = 0;
      let errorCount = 0;
  
      for (const link of modLinks) {
        try {
          const { sizeMB, sizeStr, url } = await getModSize(link);
          totalSize += sizeMB;
          console.log(`[Мод] ${sizeStr} – ${url}`);
        } catch (e) {
          errorCount++;
        }
        processed++;
        rightDiv.textContent = `Считаем... ${processed} / ${modLinks.length}`;
      }
  
      // Выводим размер в MB или GB
      if (totalSize < 1024) {
        rightDiv.textContent = `${totalSize.toFixed(2)} MB`;
      } else {
        rightDiv.textContent = `${(totalSize/1024).toFixed(2)} GB`;
      }
      if (errorCount > 0) {
        console.warn(`Не удалось получить размер для ${errorCount} мод(ов) из ${modLinks.length}. Подробности ошибок выше.`);
      }
    } catch (e) {
      console.error('Ошибка при выполнении скрипта подсчёта размера коллекции:', e);
    }
  })();