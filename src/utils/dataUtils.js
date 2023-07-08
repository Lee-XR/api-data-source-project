function getCsvRowCount(csvString) {
    const rowArray = csvString.split("\n");
    
    for (let row = 0; row < rowArray.length; row++) {
        if (rowArray[row] === "" || rowArray[row] === null) {
            rowArray.splice(row, 1);
            row--;
        }
    }

    return rowArray.length - 1;
}

function flattenArrayObject(obj) {
    const flattenedObj = {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object' && value !== null) {
                        const nestedItem = flattenArrayObject(item);
                        for (const [nestedItemKey, nestedItemValue] of Object.entries(nestedItem)) {
                            flattenedObj[`${key}[${index}].${nestedItemKey}`] = nestedItemValue;
                        }
                    } else {
                        flattenedObj[`${key}[${index}]`] = item;
                    }
                })
            } else {
                const nestedObj = flattenArrayObject(value);
                for (const [nestedKey, nestedValue] of Object.entries(nestedObj)) {
                    flattenedObj[`${key}.${nestedKey}`] = nestedValue;
                }
            }
        } else {
            flattenedObj[key] = value;
        }
    }

    return flattenedObj;
}

export { getCsvRowCount, flattenArrayObject }