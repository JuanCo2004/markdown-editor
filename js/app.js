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

    // Listas
    content = content.replace(/^([-*]) (.*)$/gm, '<li>$2</li>');
    content = content.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

    previewArea.innerHTML = content;

    if(contrasteActivo){
        aplicarContraste();
    }
});

btnContrast.addEventListener("click", function(){
    contrasteActivo = !contrasteActivo;
    if (contrasteActivo) {
        aplicarContraste();
    } else {
        quitarContraste();
    }
});

function aplicarContraste() {
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