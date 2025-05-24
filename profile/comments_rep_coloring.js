(function colorRepWords() {
    function processCommentTextBlock(block) {
        let html = block.innerHTML;

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

    document.querySelectorAll('.commentthread_comment_text').forEach(processCommentTextBlock);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('commentthread_comment_text')) {
                        processCommentTextBlock(node);
                    }
                    node.querySelectorAll && node.querySelectorAll('.commentthread_comment_text').forEach(processCommentTextBlock);
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();