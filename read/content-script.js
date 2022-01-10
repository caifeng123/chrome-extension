chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	speechSynthesis.speak(new SpeechSynthesisUtterance(window.getSelection().toString()));
});