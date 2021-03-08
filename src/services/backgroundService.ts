function injectScript(file, node) {
    const th = document.getElementsByTagName(node)[0];
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', file);
    th.appendChild(scriptElement);
}

function backgroundFunction() {
    injectScript(chrome.runtime.getURL('window.js'), 'body');
}

export { backgroundFunction };