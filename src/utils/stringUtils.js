// Return text with white space as %20
function replaceWhiteSpace(text) {
    return text.replace(/\s/g, '%20');
}

function getCsvRowCount(csvString) {
    const rowArray = csvString.split("\n");
    
    for (let row = 0; row < rowArray.length; row++) {
        if (rowArray[row] === "" || rowArray[row] === null) {
            rowArray.splice(row, 1);
        }
    }

    return rowArray.length - 1;
}

export { replaceWhiteSpace, getCsvRowCount }