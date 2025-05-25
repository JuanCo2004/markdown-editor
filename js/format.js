// Estado para alternar entre formatos
let actualFormato = 'bold';

// Función de orden superior que recibe un callback (negrita o cursiva)
function toggleFormat(callback) {
    const textarea = document.getElementById("editorArea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    let selectedText;
    let replaceStart, replaceEnd;


    if (start === end) {
        // No hay texto seleccionado - buscar palabra actual
        const cursorPos = start;
        const text = textarea.value;
        
        // Encontrar inicio y fin de la palabra actual
        let wordStart = cursorPos;
        let wordEnd = cursorPos;
        
        // Buscar hacia atrás hasta encontrar espacio o inicio
        while (wordStart > 0 && !/\s/.test(text[wordStart - 1])) {
            wordStart--;
        }
        
        // Buscar hacia adelante hasta encontrar espacio o final
        while (wordEnd < text.length && !/\s/.test(text[wordEnd])) {
            wordEnd++;
        }
        
        // Si no hay palabra, insertar marcadores de formato
        if (wordStart === wordEnd) {
            const formatInfo = callback('');
            const beforeText = text.substring(0, cursorPos);
            const afterText = text.substring(cursorPos);
            
            textarea.value = beforeText + formatInfo.text + afterText;
            
            // Posicionar cursor entre los marcadores
            const newPos = cursorPos + (formatInfo.text.length / 2);
            textarea.setSelectionRange(newPos, newPos);
            textarea.focus();
            
            actualFormato = formatInfo.nextFormat;
            updateButtonText();
            updatePreview();
            return;
        }
        
        selectedText = text.slice(wordStart, wordEnd);
        replaceStart = wordStart;
        replaceEnd = wordEnd;
    } else {
        // Hay texto seleccionado
        selectedText = textarea.value.slice(start, end);
        replaceStart = start;
        replaceEnd = end;
    }

    const formattedText = callback(selectedText);

    // Definir las variables necesarias
    const beforeText = textarea.value.substring(0, replaceStart);
    const afterText = textarea.value.substring(replaceEnd);

    // Reemplazar texto seleccionado por el formateado
    textarea.value = beforeText + formattedText.text + afterText;

    // Selección en el texto formateado
    const newStart = replaceStart;
    const newEnd = replaceStart + formattedText.text.length;
    textarea.setSelectionRange(newStart, newEnd);

    textarea.focus();

    // Actualizar estado:
    actualFormato = formattedText.nextFormat;

    // Actualizar el texto del botón después del cambio:
    updateButtonText();

    // Actualizar el preview después del cambio
    updatePreview();
}

// Alterna entre negrita (**texto**), cursiva (*texto*), sin formato
function alternarFormato(texto) {
    // Si no hay texto, crear marcadores vacíos según el formato actual
    if (texto === '') {
        if (actualFormato === 'bold') {
            return {
                text: '****',
                action: "Marcadores de negrita insertados",
                nextFormat: 'italic'
            };
        } else {
            return {
                text: '**',
                action: "Marcadores de cursiva insertados", 
                nextFormat: 'bold'
            };
        }
    }

    // Detectar formato actual del texto seleccionado
    const isBold = texto.startsWith("**") && texto.endsWith("**") && texto.length > 4;
    const isItalic = texto.startsWith("*") && texto.endsWith("*") && texto.length > 2 && !isBold;
    
    if (isBold) {
        //De negrita a cursiva: 
        const inner = texto.slice(2, -2);
        return {
            text: `*${inner}*`,
            action: "Cambiado de negrita a cursiva",
            nextFormat: 'italic'
        };
    }
    
    if (isItalic) {
        //De cursiva a negrita:
        const inner = texto.slice(1, -1);
        return {
            text: inner,
            action: "Formato removido", 
            nextFormat: 'bold'
        };
    }
    
    //Sin formato: aplicar según formato actual
    if (actualFormato  === 'bold') {
        return {
            text: `**${texto}**`,
            action: "Negrita aplicada",
            nextFormat: 'italic' // Próxima vez será cursiva
        };
    } else {
        return {
            text: `*${texto}*`,
            action: "Cursiva aplicada", 
            nextFormat: 'bold' // Próxima vez será negrita
        };
    }
}

//Inicialización segura para mantener la estructura sin alterar:
function initializeFormatModule() {
    const btnFormato = document.getElementById("btn-alternar-formato");
    const textarea = document.getElementById("editorArea");
    
    if (btnFormato) {
        //Evento del botón
        btnFormato.addEventListener('click', () => {
            toggleFormat(alternarFormato);
        });
        
        //Actualizar texto del botón según formato actual
        updateButtonText();
        
        console.log("Módulo de formato inicializado correctamente");
    } else {
        console.error("No se encontró el botón 'btn-alternar-formato'");
    }

    // Listener para actualizar preview en tiempo real
    if (textarea) {
        textarea.addEventListener('input', () => {
            updatePreview();
        });
        
        // Actualizar preview inicial
        updatePreview();
    } else {
        console.error("No se encontró el textarea 'editorArea'");
    }

}

//Función para actualizar el preview con markdown renderizado:
function updatePreview() {
    const textarea = document.getElementById("editorArea");
    const preview = document.getElementById("previewArea");
    
    if (textarea && preview) {
        let content = textarea.value;
        
        // Convertir markdown a HTML
        // Negrita:
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Cursiva:
        content = content.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
        
        // Convertir saltos de línea a <br>
        content = content.replace(/\n/g, '<br>');
        
        // Si está vacío, mostrar placeholder
        if (content.trim() === '') {
            content = '<span style="color: #999; font-style: italic;">El preview aparecerá aquí...</span>';
        }
        
        preview.innerHTML = content;
    }
}

//Función para el botón:
function updateButtonText() {
    const btnFormato = document.getElementById('btn-alternar-formato');
    if (btnFormato) {
        const nextAction = actualFormato === 'bold' ? 'Negrita (**)' : 'Cursiva (*)';
        btnFormato.textContent = `Aplicar ${nextAction}`;
        
        // Cambiar color según formato
        const colorClass = actualFormato === 'bold' ? 
            'bg-green-600 hover:bg-green-700' : 
            'bg-purple-600 hover:bg-purple-700';
            
        btnFormato.className = `${colorClass} px-4 py-2 rounded text-white`;
    }
}

//Inicialización completa:
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeFormatModule();
    });
} else {
    initializeFormatModule();
}