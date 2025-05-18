// Función de orden superior que transforma líneas con callback
function transformLines(lines, callback) {
    return lines.map(callback);
}

// Callback para transformar líneas numeradas en <li>
function lineToListItem(line) {
    // Quita el número y el punto (e.g. "1. ") y espacios iniciales
    return line.replace(/^\d+\.\s*/, '');
}

// Detecta si hay lista numerada
function isNumberedList(lines) {
    // Al menos 2 líneas consecutivas que empiecen con número + punto
    let count = 0;
    for (const line of lines) {
        if (/^\d+\.\s/.test(line)) {
            count++;
            if (count >= 2) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

// Convierte texto con listas numeradas en HTML <ol><li>...</li></ol>
function convertNumberedListsToHTML(text) {
    const lines = text.split('\n');
    const result = [];
    let insideList = false;
    let buffer = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\d+\.\s/.test(line)) {
            buffer.push(line);
            insideList = true;
        } else {
        if (insideList) {
            // Procesar buffer como lista
            if (buffer.length > 0) {
                // Usar la función de orden superior para transformar cada línea
                const items = transformLines(buffer, lineToListItem)
                .map(item => `<li>${item}</li>`)
                .join('\n');
                result.push(`<ol>\n${items}\n</ol>`);
                buffer = [];
            }
            insideList = false;
        }
        result.push(line);
        }
    }

    // Por si la lista termina al final del texto
    if (insideList && buffer.length > 0) {
        const items = transformLines(buffer, lineToListItem)
        .map(item => `<li>${item}</li>`)
        .join('\n');
        result.push(`<ol>\n${items}\n</ol>`);
    }

    return result.join('\n');
}