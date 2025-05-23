/*Preview*/
const textAreaInput = document.querySelector("#markdown-input");
const previewOutput = document.querySelector("#preview-output");

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

const errorMessage = document.querySelector("#error-message");

function renderPreview(evento) {
    try {
        const rawInput = textAreaInput.value;

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
            previewOutput.innerHTML = htmlElements.join("");
        } catch (unexpectedError) {
            console.error("Error inesperado en la conversión:", unexpectedError);
            errorMessage.textContent = "Se produjo un error interno al convertir el contenido.";
            errorMessage.classList.remove("hidden");
            previewOutput.innerHTML = "";
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
        previewOutput.innerHTML = "";
        updateCounter("");
    }
}

textAreaInput.addEventListener("keyup", renderPreview);

// keydown -> keypress -> actualiza.el.value -> "keyup" -> change

/*Botón de Limpiar */
const clearButton = document.querySelector("#clear-button");

clearButton.addEventListener("click", () => {
    textAreaInput.value = "";
    previewOutput.innerHTML = "";
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