// Return text with white space as %20
function replaceWhiteSpace(text) {
    return text.replace(/\s/g, '%20');
}

export { replaceWhiteSpace }