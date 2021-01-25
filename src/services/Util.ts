export function copyToClipboard(value) {
    document.addEventListener('copy', (event) => {
        // Prevents the default behavior of copying, ex: pressing Ctrl+C
        // If we didn't prevent the prevent default, the clipboard would be filled with what ever the user had highlighted on the page.
        event.preventDefault();
        event.clipboardData.setData('text/plain', value);
    }, {once: true})
    document.execCommand('copy');
}