chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_PROBLEM") {
        extractProblem().then(sendResponse);
        return true;
    }
    if (request.action === "INSERT_CODE") {
        insertCode(request.code).then(result => sendResponse({ success: result }));
        return true;
    }
});

/**
 * Extracts problem title and description from LeetCode DOM
 */
async function extractProblem() {
    // Selectors for new and old LeetCode layout
    const titleSelectors = [
        '[data-cy="question-title"]',
        '.text-title-large',
        'div.flex.items-start.gap-1 h4'
    ];

    const descSelectors = [
        '[data-track-load="description_content"]',
        '.elfjS',
        '.question-content'
    ];

    let title = "";
    for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el) {
            title = el.innerText;
            break;
        }
    }

    let description = "";
    for (const selector of descSelectors) {
        const el = document.querySelector(selector);
        if (el) {
            description = el.innerText;
            break;
        }
    }

    // Language detection
    const language = detectLanguage();

    return { title, description, language };
}

/**
 * Detects the currently selected programming language in the LeetCode editor
 */
function detectLanguage() {
    // 1. Try to find the language button text (New LeetCode)
    const langBtn = document.querySelector('button.rounded.items-center.whitespace-nowrap.inline-flex.bg-fill-3');
    if (langBtn) {
        return langBtn.innerText.toLowerCase().trim();
    }

    // 2. Try the language selector text (Dynamic/Monaco)
    const langDisplay = document.querySelector('.ant-select-selection-item') ||
        document.querySelector('.language-btn-text');
    if (langDisplay) {
        return langDisplay.innerText.toLowerCase().trim();
    }

    // 3. Last fallback (usually Python is the most popular/default)
    return "python";
}

/**
 * Injects code into Monaco editor using safest and most reliable methods
 */
async function insertCode(code) {
    console.log("Triggering Code Injection...");

    // Find all Monaco textareas
    const textareas = Array.from(document.querySelectorAll('div.monaco-editor textarea.inputarea'));

    if (textareas.length === 0) {
        return false;
    }

    // Filter to find the main code editor (usually largest visible or in specific container)
    let target = null;
    for (const ta of textareas) {
        const container = ta.closest('.monaco-editor');
        if (!container) continue;

        const rect = container.getBoundingClientRect();
        if (rect.height < 150) continue; // Skip preview editors

        // Priority markers
        const isMain = container.closest('[data-track-load="code-editor"]') ||
            container.id === 'editor';

        if (isMain) {
            target = ta;
            break;
        }
    }

    // Fallback if priority markers fail
    if (!target && textareas.length > 0) {
        target = textareas.sort((a, b) => b.clientHeight - a.clientHeight)[0];
    }

    if (!target) return false;

    try {
        target.focus();

        // 1. Clear contents
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);

        // 2. Insert with simulated Paste (Forces Monaco State Sync)
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', code);

        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true,
            cancelable: true
        });
        target.dispatchEvent(pasteEvent);

        // 3. Fallback to execCommand if paste simulation failed to fill
        setTimeout(() => {
            if (target.value.length < 5) {
                document.execCommand('insertText', false, code);
            }
        }, 100);

        return true;
    } catch (err) {
        console.error("Injection failed:", err);
        return false;
    }
}
