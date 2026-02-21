document.addEventListener('DOMContentLoaded', () => {
    const solveBtn = document.getElementById('solveBtn');
    const languageSelect = document.getElementById('language');
    const statusText = document.getElementById('status');
    const loader = document.getElementById('loader');
    const btnText = document.querySelector('.btn-text');

    const resultArea = document.getElementById('resultArea');
    const generatedCode = document.getElementById('generatedCode');
    const copyBtn = document.getElementById('copyBtn');
    const injectBtn = document.getElementById('injectBtn');

    let lastGeneratedSolution = "";

    // Persistence
    chrome.storage.local.get(['language'], (result) => {
        if (result.language) languageSelect.value = result.language;
    });

    languageSelect.addEventListener('change', (e) => {
        chrome.storage.local.set({ language: e.target.value });
    });

    solveBtn.addEventListener('click', async () => {
        setLoading(true);
        updateStatus("Extracting problem...");
        resultArea.style.display = 'none';

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab.url.includes("leetcode.com/problems")) {
                throw new Error("Please open a LeetCode problem");
            }

            // 1. Get Problem and Language from Content Script
            // Note: We ignore the detected language now and use the dropdown value instead as requested
            const problem = await chrome.tabs.sendMessage(tab.id, { action: "GET_PROBLEM" });

            if (!problem || !problem.title) {
                throw new Error("Unable to extract problem details. Refresh page.");
            }

            const targetLanguage = languageSelect.value;
            updateStatus("Generating " + targetLanguage + " solution...");

            // 2. Call Backend
            const response = await fetch("http://localhost:8000/api/v1/solve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: problem.title,
                    description: problem.description,
                    language: targetLanguage
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || "Failed to generate solution");
            }

            lastGeneratedSolution = result.solution;
            generatedCode.innerText = lastGeneratedSolution;
            resultArea.style.display = 'block';

            updateStatus("Solution generated! ✅", "success");

        } catch (err) {
            console.error(err);
            updateStatus(err.message, "error");
        } finally {
            setLoading(false);
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(lastGeneratedSolution).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Copied! ✨";
            setTimeout(() => copyBtn.innerText = originalText, 2000);
        });
    });

    injectBtn.addEventListener('click', async () => {
        updateStatus("Attempting auto-injection...");
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const injectResult = await chrome.tabs.sendMessage(tab.id, {
                action: "INSERT_CODE",
                code: lastGeneratedSolution
            });

            if (injectResult.success) {
                updateStatus("Injected! ✅", "success");
            } else {
                throw new Error("Injection failed. Use Copy button.");
            }
        } catch (err) {
            updateStatus(err.message, "error");
        }
    });

    function setLoading(isLoading) {
        solveBtn.disabled = isLoading;
        loader.style.display = isLoading ? 'block' : 'none';
        btnText.style.display = isLoading ? 'none' : 'block';
    }

    function updateStatus(text, type = "") {
        statusText.innerText = text;
        statusText.className = type;
    }
});
