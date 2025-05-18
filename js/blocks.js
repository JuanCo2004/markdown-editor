// Función de orden superior que recibe un texto y un transformador para aplicar resaltado
function applyCodeHighlighting(text, transformer) {
    return transformer(text);
}

// Función de primera clase que transforma bloques entre triple backticks a <pre><code>
const highlightCodeBlocks = (text) => {
    // Reemplaza cada bloque de ```código``` por <pre><code class="...">...</code></pre>
    // Soporta múltiples bloques sin interferencia
    return text.replace(/```([\s\S]*?)```/g, (match, codeContent) => {
        const escaped = codeContent
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<pre><code class="bg-gray-900 text-green-400 p-2 rounded block overflow-x-auto">${escaped}</code></pre>`;
    });
};

// Exportar función para usarla en app.js
function transformCodeBlocks(text) {
    return applyCodeHighlighting(text, highlightCodeBlocks);
}