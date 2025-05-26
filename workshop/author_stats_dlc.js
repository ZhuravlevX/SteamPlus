(async function() {
  try {
    const html = document.documentElement;
    const isRu = html && html.classList.contains("responsive") && html.classList.contains("DesktopUI") && html.getAttribute("lang") === "ru";
    const posLabel = isRu ? "Положительные оценки" : "Positive ratings";
    const negLabel = isRu ? "Отрицательные оценки" : "Negative ratings";
    const posRowLabel = isRu ? "положительные оценки" : "Positive ratings";
    const negRowLabel = isRu ? "отрицательные оценки" : "Negative ratings";
    const onlyYou = isRu ? "(Доступно только вам)" : "(Only visible to you)";
    const earnedPoints = isRu ? "заработано очков Steam" : "Steam Points earned";
    const panels = document.querySelectorAll('div.panel.owner');
    if (panels.length < 2) return;
    const panel = panels[1];
    const statsTable = panel.querySelector('table.stats_table');
    if (!statsTable) return;
    const tbody = statsTable.querySelector('tbody');
    if (!tbody) return;
    const statsBtn = document.querySelector('a.sectionTab.stats.stats[href*="/sharedfiles/filedetails/stats/"]');
    if (!statsBtn) return;
    const statsUrl = statsBtn.getAttribute('href');
    if (!statsUrl) return;
    let posVotes = null, negVotes = null;
    try {
      const resp = await fetch(statsUrl, { credentials: 'include' });
      if (!resp.ok) return;
      const html = await resp.text();
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const profileBlock = tmp.querySelector('#profileBlock .statsBox table');
      if (!profileBlock) return;
      const posVotesRow = Array.from(profileBlock.querySelectorAll('tr')).find(tr => {
        const td = tr.querySelector('td');
        return td && td.textContent.trim() === posLabel;
      });
      if (!posVotesRow) return;
      const posValueTd = posVotesRow.querySelector('td:nth-child(2)');
      if (!posValueTd) return;
      const posMatch = posValueTd.textContent.match(/\d+/);
      if (!posMatch) return;
      posVotes = posMatch[0];
      const negVotesRow = Array.from(profileBlock.querySelectorAll('tr')).find(tr => {
        const td = tr.querySelector('td');
        return td && td.textContent.trim() === negLabel;
      });
      if (!negVotesRow) return;
      const negValueTd = negVotesRow.querySelector('td:nth-child(2)');
      if (!negValueTd) return;
      const negMatch = negValueTd.textContent.match(/\d+/);
      if (!negMatch) return;
      negVotes = negMatch[0];
    } catch (e) { return; }
    const posRow = document.createElement('tr');
    posRow.innerHTML = `<td><span style="color: #91b806;">${posVotes}</span></td><td>${posRowLabel}<span class="sub">${onlyYou}</span></td>`;
    const negRow = document.createElement('tr');
    negRow.innerHTML = `<td><span style="color: #A34C25;">${negVotes}</span></td><td>${negRowLabel}<span class="sub">${onlyYou}</span></td>`;
    tbody.appendChild(posRow);
    tbody.appendChild(negRow);
    const reviewAwardCtn = document.querySelector('.review_award_ctn');
    if (reviewAwardCtn) {
      const awardDivs = reviewAwardCtn.querySelectorAll('.review_award.tooltip[data-tooltip-html]');
      let totalPoints = 0;
      awardDivs.forEach(div => {
        const tooltipHtml = div.getAttribute('data-tooltip-html');
        if (!tooltipHtml) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = tooltipHtml;
        const pointsDiv = tmp.querySelector('.reaction_award_points');
        if (!pointsDiv) return;
        const text = pointsDiv.textContent.replace(/\s+/g, ' ').trim();
        let pointMatch = text.match(/(\d[\d\s,]*)\s*очк\. Steam|(\d[\d\s,]*)\s*Steam Points/);
        let points = 0;
        if (pointMatch) points = parseInt((pointMatch[1] || pointMatch[2]).replace(/\s|,/g, ''), 10);
        let users = 1;
        let reactionCount = div.getAttribute('data-reactioncount');
        if (reactionCount && !isNaN(reactionCount)) users = parseInt(reactionCount, 10);
        totalPoints += points * users;
      });
      if (totalPoints > 0) {
        const formatPoints = totalPoints.toLocaleString('en-US');
        const pointsRow = document.createElement('tr');
        pointsRow.innerHTML = `<td><span style="color: #6088BB;">${formatPoints}</span></td><td>${earnedPoints}<span class="sub">${onlyYou}</span></td>`;
        tbody.appendChild(pointsRow);
      }
    }
  } catch (e) {}
})();