(function() {
    function processBlock(block) {
        block.innerHTML = block.innerHTML
            .replace(/(^|[\s>])(\+rep)(?=[\s<.,;:!?]|$)/gi, '$1<span style="color:#91b806;font-weight:bold;">$2</span>')
            .replace(/(^|[\s>])(\-rep)(?=[\s<.,;:!?]|$)/gi, '$1<span style="color:#A34C25;font-weight:bold;">$2</span>');
    }

    document.querySelectorAll('.commentthread_comment_text').forEach(processBlock);

    new MutationObserver(muts => {
        muts.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList.contains('commentthread_comment_text')) processBlock(node);
                    node.querySelectorAll && node.querySelectorAll('.commentthread_comment_text').forEach(processBlock);
                }
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
})();