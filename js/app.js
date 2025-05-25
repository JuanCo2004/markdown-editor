const btnPreview = document.getElementById("btn-preview");
const btnContrast = document.getElementById("btn-contrast");
const editorArea = document.getElementById("editorArea");
const previewArea = document.getElementById("previewArea");

let contrasteActivo = false;

btnPreview.addEventListener("click", function(){
    let content = editorArea.value;

    // Encabezados Markdown
    content = content.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    content = content.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    content = content.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Primero transformar listas con viñetas (- o *) en <ul>
    content = content.replace(/^([-*]) (.*)$/gm, '<li>$2</li>');
    content = content.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

    // Luego transformar listas numeradas en <ol>
    // Usamos la función que definí para lista enumeradas:
    content = convertNumberedListsToHTML(content);
    // Resaltado de bloques de código
    content = transformCodeBlocks(content);

    previewArea.innerHTML = content;

    if(contrasteActivo){
        aplicarContraste();
    }

    updateCounter(editorArea.value);

});

btnContrast.addEventListener("click", function(){
    contrasteActivo = !contrasteActivo;
    if (contrasteActivo) {
        aplicarContraste();
    } else {
        quitarContraste();
    }
});
//Contraste:
function aplicarContraste() {
    //Asigno estilos a cada encabezado:
    previewArea.querySelectorAll('h1').forEach(h => {
        h.classList.add('text-red-600', 'text-4xl', 'font-bold');
    });
    previewArea.querySelectorAll('h2').forEach(h => {
        h.classList.add('text-orange-600', 'text-3xl', 'font-bold');
    });
    previewArea.querySelectorAll('h3').forEach(h => {
        h.classList.add('text-yellow-600', 'text-2xl', 'font-bold');
    });
    previewArea.querySelectorAll('h4').forEach(h => {
        h.classList.add('text-green-600', 'text-xl', 'font-semibold');
    });
    previewArea.querySelectorAll('h5').forEach(h => {
        h.classList.add('text-blue-600', 'text-lg', 'font-medium');
    });
    previewArea.querySelectorAll('h6').forEach(h => {
        h.classList.add('text-purple-600', 'text-base', 'italic');
    });
}
//Sin contraste:
function quitarContraste() {
    previewArea.querySelectorAll('h1').forEach(h => {
        h.classList.remove('text-red-600', 'text-4xl', 'font-bold');
    });
    previewArea.querySelectorAll('h2').forEach(h => {
        h.classList.remove('text-orange-600', 'text-3xl', 'font-bold');
    });
    previewArea.querySelectorAll('h3').forEach(h => {
        h.classList.remove('text-yellow-600', 'text-2xl', 'font-bold');
    });
    previewArea.querySelectorAll('h4').forEach(h => {
        h.classList.remove('text-green-600', 'text-xl', 'font-semibold');
    });
    previewArea.querySelectorAll('h5').forEach(h => {
        h.classList.remove('text-blue-600', 'text-lg', 'font-medium');
    });
    previewArea.querySelectorAll('h6').forEach(h => {
        h.classList.remove('text-purple-600', 'text-base', 'italic');
    });
}

/*Botón de Limpiar */
const clearButton = document.querySelector("#clear-button");

clearButton.addEventListener("click", () => {
    editorArea.value = "";
    previewArea.innerHTML = "";
    // Reinicia el contador a cero
    updateCounter(""); 
});

/*Contador de palabras y carácteres*/
const counterDisplay = document.querySelector("#counter");

function updateCounter(text) {
    const trimmed = text.trim();
    const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    const charCount = text.length;
    counterDisplay.textContent = `Palabras: ${wordCount} | Caracteres: ${charCount}`;
}

// Actualizar contador en tiempo real
editorArea.addEventListener("input", () => {
    updateCounter(editorArea.value);
});

/*Validación para encabezados*/
function parseToHTML(markdownLine){
    // Elimina espacios al inicio y fin
	const line = markdownLine.trim();

    // Validación de encabezado mal formado
    if (/^#{1,6}[^\s#]/.test(line)) {
        throw new Error("Encabezado mal formado: debe haber un espacio después de '#'");
    }

    // Validación de lista mal formada
    if (/^[-*](?!\s)/.test(line)) {
        throw new Error("Elemento de lista mal formado: debe haber un espacio después de '-' o '*'");
    }

	// Encabezados: #, ##, ###, etc.
	const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
	if (headerMatch) {
		const level = headerMatch[1].length;
		const content = headerMatch[2];
		return `<h${level}>${content}</h${level}>`;
	}
	// Párrafos
	if (line.length > 0) {
		return `<p>${line}</p>`;
	}
	// Si la línea está vacía, retorna cadena vacía
	return "";
}

/*Validación para mensajes vacíos*/
const errorMessage = document.querySelector("#error-message");
function renderPreview(evento) {
    try {
        const rawInput = editorArea.value;

        if (rawInput.trim() === "") {
            throw new Error("No se ingresó contenido");
        }

        // Si hay contenido, se oculta el mensaje de error
        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");

        const markdownLines = rawInput.split("\n");
        const htmlElements = [];
        const errores = [];

        for (const line of markdownLines) {
            try {
                const htmlElement = parseToHTML(line);
                htmlElements.push(htmlElement);
            } catch (lineError) {
                errores.push(lineError.message);
            }
        }
        
        //Envolvemos toda la renderización HTML en un try/catch general
        try {
            previewArea.innerHTML = htmlElements.join("");
        } catch (unexpectedError) {
            console.error("Error inesperado en la conversión:", unexpectedError);
            errorMessage.textContent = "Se produjo un error interno al convertir el contenido.";
            errorMessage.classList.remove("hidden");
            previewArea.innerHTML = "";
        }

        updateCounter(rawInput);

         // Mostrar errores si hay
        if (errores.length > 0) {
            errorMessage.textContent = errores.join(" | ");
            errorMessage.classList.remove("hidden");
        }

    } catch (error) {
        // Muestra el mensaje de error
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");

        // Limpia vista previa y contador
        previewArea.innerHTML = "";
        updateCounter("");
    }
}

editorArea.addEventListener("keyup", renderPreview);

/*FUNCIÓN ADICIONAL: */
// Alternar tema claro/oscuro:
const btnTema = document.getElementById("btn-tema");
const body = document.body;
const editor = document.querySelector(".editor");
const preview = document.getElementById("previewArea");

btnTema.addEventListener("click", () => {
    const modoOscuro = body.classList.toggle("bg-black");

    if (modoOscuro) {
        body.classList.remove("bg-white");
        editor.classList.remove("bg-gray-100");
        editor.classList.add("bg-gray-900", "text-white");
        preview.classList.remove("bg-white");
        preview.classList.add("bg-gray-800", "text-white");
    } else {
        body.classList.add("bg-white");
        editor.classList.remove("bg-gray-900", "text-white");
        editor.classList.add("bg-gray-100");
        preview.classList.remove("bg-gray-800", "text-white");
        preview.classList.add("bg-white");
    }
});