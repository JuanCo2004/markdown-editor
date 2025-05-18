// Función de orden superior que recibe un callback (negrita o cursiva)
function toggleFormat(callback) {
    const textarea = document.getElementById("editorArea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return; // No hay texto seleccionado

    const selectedText = textarea.value.slice(start, end);
    const formattedText = callback(selectedText);

    // Reemplazar texto seleccionado por el formateado
    textarea.setRangeText(formattedText, start, end, 'end');
    textarea.focus();
}

// Alterna entre negrita (**texto**), cursiva (*texto*), sin formato
function alternarFormato(texto) {
    if (texto.startsWith("**") && texto.endsWith("**")) {
        const inner = texto.slice(2, -2);
        return `*${inner}*`; // negrita → cursiva
    }

    if (texto.startsWith("*") && texto.endsWith("*")) {
        return texto.slice(1, -1); // cursiva → sin formato
    }

    return `**${texto}**`; // sin formato → negrita
}

// Asociar botón
const btnFormato = document.getElementById('btn-alternar-formato');
if (btnFormato) {
    btnFormato.addEventListener('click', () => {
        toggleFormat(alternarFormato);
    });
}