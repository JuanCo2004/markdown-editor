/*Preview*/
const textAreaInput = document.querySelector("#markdown-input");
const previewOutput = document.querySelector("#preview-output");

function parseToHTML(markdownLine){
    // Elimina espacios al inicio y fin
	const line = markdownLine.trim();
	// Encabezados: #, ##, ###, etc.
	const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
	if (headerMatch) {
		const level = headerMatch[1].length;
		const content = headerMatch[2];
		return `<h${level}>${content}</h${level}>`;
	}
	// Si la línea no es encabezado y no está vacía, es un párrafo
	if (line.length > 0) {
		return `<p>${line}</p>`;
	}
	// Si la línea está vacía, retorna cadena vacía
	return "";
}

function renderPreview(evento){
    const rawInput = textAreaInput.value;
    const markdownLines = rawInput.split("\n");

    //console.log(rawInput.split("\n"));

    const htmlElements = [];
    for (const markdownLine of markdownLines){
        const htmlElement = parseToHTML(markdownLine);
        htmlElements.push(htmlElement);
    }
    previewOutput.innerHTML = htmlElements.join("");

    //Para actualizar el contador:
    updateCounter(rawInput);
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