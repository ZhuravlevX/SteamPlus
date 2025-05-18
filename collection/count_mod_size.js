(async function() {
    if (document.readyState === "loading") {
      await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
    }
  
    // Для каждого блока мода в коллекции
    const modItems = document.querySelectorAll('.collectionItem');
    for (const item of modItems) {
      // Ищем ссылку на страницу мода
      const link = item.querySelector('.collectionItemDetails a');
      if (!link) continue;
  
      // Проверяем, не был ли уже добавлен блок размера файла
      if (item.querySelector('.mod-size-file-block')) continue;
  
      // Ищем оригинальные блоки
      const nameBlock = item.querySelector('.workshopItemAuthorName');
      if (!nameBlock) continue;
  
      // Создаём отдельный блок для "Размер файла"
      const fileSizeDiv = document.createElement('div');
      fileSizeDiv.className = 'mod-size-file-block';
      fileSizeDiv.style.marginTop = '2px';
  
      // Добавляем "Размер файла" без ссылки и без жирного
      const sizeLabel = document.createElement('span');
      sizeLabel.textContent = 'Размер файла: ';
      const sizeValue = document.createElement('span');
      sizeValue.textContent = '...';
      fileSizeDiv.appendChild(sizeLabel);
      fileSizeDiv.appendChild(sizeValue);
  
      // Вставляем fileSizeDiv под nameBlock
      nameBlock.parentNode.insertBefore(fileSizeDiv, nameBlock.nextSibling);
  
      // Получаем размер мода
      try {
        const resp = await fetch(link.href);
        const html = await resp.text();
        const match = html.match(/<div[^>]*class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB)<\/div>/i);
        if (match) {
          let val = parseFloat(match[1].replace(',', '.'));
          let unit = match[2];
          let sizeMB = val;
          if (unit === 'GB') sizeMB = val * 1024;
          if (unit === 'KB') sizeMB = val / 1024;
          // Форматируем вывод
          if (sizeMB < 1) {
            sizeValue.textContent = `${(sizeMB * 1024).toFixed(2)} KB`;
          } else if (sizeMB < 1024) {
            sizeValue.textContent = `${sizeMB.toFixed(2)} MB`;
          } else {
            sizeValue.textContent = `${(sizeMB/1024).toFixed(2)} GB`;
          }
        } else {
          sizeValue.textContent = '?';
        }
      } catch (e) {
        sizeValue.textContent = '?';
      }
    }
  })();