(async function addVotesRowsToSecondPanelOwner() {
    try {
      // 1. Найти все блоки panel.owner
      const panels = document.querySelectorAll('div.panel.owner');
      if (panels.length < 2) throw new Error('Меньше двух блоков panel.owner');
  
      // 2. Использовать второй блок panel.owner (индекс 1)
      const panel = panels[1];
  
      // 3. Найти таблицу stats_table в этом блоке
      const statsTable = panel.querySelector('table.stats_table');
      if (!statsTable) throw new Error('Не найдена таблица stats_table во втором panel.owner');
      const tbody = statsTable.querySelector('tbody');
      if (!tbody) throw new Error('В таблице stats_table отсутствует <tbody>');
  
      // 4. Найти ссылку на статистику продукта
      const statsBtn = document.querySelector('a.sectionTab.stats.stats[href*="/sharedfiles/filedetails/stats/"]');
      if (!statsBtn) throw new Error('Не найдена ссылка "Статистика продукта"');
      const statsUrl = statsBtn.getAttribute('href');
      if (!statsUrl) throw new Error('У ссылки на статистику отсутствует href');
  
      // 5. Получить число положительных и отрицательных оценок из profileBlock на странице статистики
      let posVotes = null, negVotes = null;
      try {
        const resp = await fetch(statsUrl, { credentials: 'include' });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const html = await resp.text();
  
        // Создать временный контейнер
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
  
        // Найти блок profileBlock
        const profileBlock = tmp.querySelector('#profileBlock .statsBox table');
        if (!profileBlock) throw new Error('В статистике не найден profileBlock');
  
        // Найти строку "Положительные оценки"
        const posVotesRow = Array.from(profileBlock.querySelectorAll('tr')).find(tr => {
          const td = tr.querySelector('td');
          return td && td.textContent.trim() === 'Положительные оценки';
        });
        if (!posVotesRow) throw new Error('В статистике не найдена строка "Положительные оценки"');
        const posValueTd = posVotesRow.querySelector('td:nth-child(2)');
        if (!posValueTd) throw new Error('Не найден второй столбец для "Положительные оценки"');
        const posMatch = posValueTd.textContent.match(/\d+/);
        if (!posMatch) throw new Error('Не найдено число положительных оценок');
        posVotes = posMatch[0];
  
        // Найти строку "Отрицательные оценки"
        const negVotesRow = Array.from(profileBlock.querySelectorAll('tr')).find(tr => {
          const td = tr.querySelector('td');
          return td && td.textContent.trim() === 'Отрицательные оценки';
        });
        if (!negVotesRow) throw new Error('В статистике не найдена строка "Отрицательные оценки"');
        const negValueTd = negVotesRow.querySelector('td:nth-child(2)');
        if (!negValueTd) throw new Error('Не найден второй столбец для "Отрицательные оценки"');
        const negMatch = negValueTd.textContent.match(/\d+/);
        if (!negMatch) throw new Error('Не найдено число отрицательных оценок');
        negVotes = negMatch[0];
      } catch (e) {
        throw new Error('Ошибка при получении статистики: ' + e.message);
      }
  
      // 6. Сформировать новый <tr> для "положительные оценки"
      const posRow = document.createElement('tr');
      posRow.innerHTML = `<td><span style="color: #91b806;">${posVotes}</span></td>
        <td>положительные оценки<span class="sub">(Доступно только вам)</span></td>`;
  
      // 7. Сформировать новый <tr> для "отрицательные оценки"
      const negRow = document.createElement('tr');
      negRow.innerHTML = `<td><span style="color: #EE563B;">${negVotes}</span></td>
        <td>отрицательные оценки<span class="sub">(Доступно только вам)</span></td>`;
  
      // 8. Добавить новые <tr> в конец таблицы
      tbody.appendChild(posRow);
      tbody.appendChild(negRow);
  
      // === ДОБАВИТЬ: заработанные очки Steam по наградам ===
  
      // Найти контейнер с наградами на странице (он может быть не на той же странице, что и stats, а на основной!)
      const reviewAwardCtn = document.querySelector('.review_award_ctn');
      if (reviewAwardCtn) {
        // Найти все награды с data-tooltip-html
        const awardDivs = reviewAwardCtn.querySelectorAll('.review_award.tooltip[data-tooltip-html]');
        let totalPoints = 0;
  
        awardDivs.forEach(div => {
          const tooltipHtml = div.getAttribute('data-tooltip-html');
          if (!tooltipHtml) return;
  
          // Создаем временный контейнер для парсинга HTML
          const tmp = document.createElement('div');
          tmp.innerHTML = tooltipHtml;
  
          // Найти div с классом reaction_award_points
          const pointsDiv = tmp.querySelector('.reaction_award_points');
          if (!pointsDiv) return;
  
          const text = pointsDiv.textContent.replace(/\s+/g, ' ').trim();
  
          // Извлечь количество очков (поддержка формата "1,600" или "800")
          let pointMatch = text.match(/(\d[\d\s,]*)\s*очк\. Steam/);
          let points = 0;
          if (pointMatch) {
            points = parseInt(pointMatch[1].replace(/\s|,/g, ''), 10);
          }
  
          // Количество подарков берём из data-reactioncount (оно всегда есть и совпадает с фактом)
          let users = 1;
          let reactionCount = div.getAttribute('data-reactioncount');
          if (reactionCount && !isNaN(reactionCount)) {
            users = parseInt(reactionCount, 10);
          }
  
          totalPoints += points * users;
        });
  
        if (totalPoints > 0) {
          // Форматирование числа с запятой после тысяч
          const formatPoints = totalPoints.toLocaleString('en-US');
  
          // Сформировать новый <tr> для "заработано очков Steam"
          const pointsRow = document.createElement('tr');
          pointsRow.innerHTML = `<td><span style="color: #6088BB;">${formatPoints}</span></td>
            <td>заработано очков Steam<span class="sub">(Доступно только вам)</span></td>`;
          tbody.appendChild(pointsRow);
        }
        // Если 0 или нет наград — ничего не добавлять
      }
  
    } catch (e) {
      // Отобразить ошибку пользователю во втором panel.owner
      const panels = document.querySelectorAll('div.panel.owner');
      if (panels.length > 1) {
        const panel = panels[1];
        const errorDiv = document.createElement('div');
        errorDiv.style.color = "red";
        errorDiv.style.margin = "10px 0";
        errorDiv.textContent = "Ошибка при добавлении оценок: " + e.message;
        panel.insertBefore(errorDiv, panel.firstChild);
      }
    }
  })();