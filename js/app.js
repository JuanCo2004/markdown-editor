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
    const headers = previewArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach(h => {
        h.classList.add('text-red-600', 'text-xl', 'font-bold');
    });
}

function quitarContraste() {
    const headers = previewArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headers.forEach(h => {
        h.classList.remove('text-red-600', 'text-xl', 'font-bold');
    });
}