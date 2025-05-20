(function colorRepWords() {
    // Функция для обработки одного блока комментария
    function processCommentTextBlock(block) {
        let html = block.innerHTML;

        // Избежать двойной замены, если уже есть стиль (можно доработать при необходимости)
        html = html
            .replace(
                /(^|[\s>])(\+rep)(?=[\s<.,;:!?]|$)/gi,
                '$1<span style="color: #91b806; font-weight: bold;">$2</span>'
            )
            .replace(
                /(^|[\s>])(\-rep)(?=[\s<.,;:!?]|$)/gi,
                '$1<span style="color: #A34C25; font-weight: bold;">$2</span>'
            );

        block.innerHTML = html;
    }

    // Обработка всех видимых комментариев при загрузке
    document.querySelectorAll('.commentthread_comment_text').forEach(processCommentTextBlock);

    // Если появляются новые комментарии, обрабатывать их тоже (например, если подгружаются без перезагрузки)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // Если добавлен новый комментарий
                    if (node.classList && node.classList.contains('commentthread_comment_text')) {
                        processCommentTextBlock(node);
                    }
                    // Если внутри добавленных нод есть комментарии
                    node.querySelectorAll && node.querySelectorAll('.commentthread_comment_text').forEach(processCommentTextBlock);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();