(async function() {
  if (document.readyState === "loading") {
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve));
  }

  const html = document.documentElement;
  const isRu =
      html &&
      html.tagName === "HTML" &&
      html.classList.contains("responsive") &&
      html.classList.contains("DesktopUI") &&
      html.getAttribute("lang") === "ru";

  const fileSizeLabel = isRu ? 'Размер файла: ' : 'File size: ';

  const modItems = document.querySelectorAll('.collectionItem');
  for (const item of modItems) {
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

    try {
      const resp = await fetch(link.href);
      const html = await resp.text();
      const match = html.match(/<div[^>]*class="detailsStatRight"[^>]*>([\d.,]+)\s*(MB|KB|GB|B)<\/div>/i);
      if (match) {
        let val = parseFloat(match[1].replace(',', '.'));
        let unit = match[2];
        let sizeMB = val;
        if (unit === 'GB') sizeMB = val * 1024;
        if (unit === 'KB') sizeMB = val / 1024;
        if (unit === 'B') sizeMB = val / 1024 / 1024;

        if (sizeMB < 1 / 1024) {
          let bytes = Math.round(sizeMB * 1024 * 1024);
          sizeValue.textContent = `${bytes} B`;
        } else if (sizeMB < 1) {
          sizeValue.textContent = `${(sizeMB * 1024).toFixed(2)} KB`;
        } else if (sizeMB < 1024) {
          sizeValue.textContent = `${sizeMB.toFixed(2)} MB`;
        } else {
          sizeValue.textContent = `${(sizeMB / 1024).toFixed(2)} GB`;
        }
      } else {
        sizeValue.textContent = '?';
      }
    } catch (e) {
      sizeValue.textContent = '?';
    }
  }
})();