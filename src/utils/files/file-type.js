

export function fileType(file){
    if (file.type.includes('excel') || file.name.match(/\.xls[x]?$/i)) {
        return 'excel';
    }
    if (file.type === 'text/csv' || file.name.match(/\.csv$/i)) {
        return 'csv';
    }
    if (file.type.includes('txt') || file.name.match(/\.txt$/i)) {
        return 'txt';
    }
    return 'unknown';
}