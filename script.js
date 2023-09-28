let canvas = document.getElementById('canvas');//Pega o ID canvas no HTML
let contexto = canvas.getContext("2d"); //Pegamos o contexto do desenho, esse é o método que retorna o tipo de animação, parametro 2d significa que o objeto que será redenrizado será bidiomensional
let desenhando = false; //variável que vai identificar se estamos desenhando
let corSelecionada = "#000000";
let modoBorracha = false;
let formas = [];
let acoes = []; // Armazena ações de desenho para desfazer
let formaSelecionada = "lapis"; // Inicialmente, a forma padrão é lápis
document.getElementById("botaoLapis").classList.add("selecionado");

document.getElementById("botaoLapis").addEventListener("click", function () {
    formaSelecionada = "lapis";
    document.querySelector(".fa-pencil").classList.add("azul")

    tamanhoSlider.value = 1;//tamanho do lápis
    contexto.lineWidth = tamanhoSlider.value; //base no valor do slider
    modoBorracha = false;

    document.getElementById("botaoBorracha").classList.remove("selecionado");
    this.classList.add("selecionado"); // Adicione a classe "selecionado" quando o lápis for selecionado

    document.querySelector(".fa-eraser").classList.remove("azul");

});

let tamanhoSlider = document.getElementById("tamanhoDoTraco");

tamanhoSlider.addEventListener("input", function () {
    contexto.lineWidth = this.value;
});

canvas.addEventListener("mousedown", function (event) {
    //vamos usar o método addEventListener para ouvir nosso mouse, ele irá identificar quando clicamos
    desenhando = true;
    contexto.beginPath();  //a variável contexto junto com o método beginPath() indica que algo novo vais er criado
    contexto.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop); //nesse método, vamos dizer como o contexto irá funcionar, o clientX vai fornecer as coordenadas horizontais do mouse e o offsetLeft irá converter esse valor em pixel(px), a mesma coisa acontece com o clientY na vertical.
});

canvas.addEventListener("mousemove", function (event) {
    //função que identifica quando movemos o mouse
    if (desenhando) {
        if (modoBorracha) {
            contexto.fillStyle = "#ffffff";
            contexto.strokeStyle = "#ffffff";
        } else {
            contexto.fillStyle = corSelecionada;
            contexto.strokeStyle = corSelecionada;
        }

        contexto.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop); //o lineTo() vai juntar as coordenadas e identificar a linha que estamos traçando enquanto clicamos e movemos o mouse
        contexto.stroke(); //traça a linha
    }


});

canvas.addEventListener("mouseup", function (event) {
    desenhando = false; //essa função identifica quando não estamos mais clicando no mouse
    if (modoBorracha) {
        contexto.fillStyle = "#ffffff";
        contexto.strokeStyle = "#ffffff";
    } else {
        contexto.fillStyle = corSelecionada;
        contexto.strokeStyle = corSelecionada;
        formas.push(contexto); // Armazena o caminho desenhado
        acoes.push(contexto.getImageData(0, 0, canvas.width, canvas.height)); // Salva a ação para desfazer
    }
});

document.getElementById("seletorDeCores").addEventListener("input", function () {
    corSelecionada = this.value;
});

document.getElementById("botaoBorracha").addEventListener("click", function () {
    document.querySelector(".fa-eraser").classList.add("azul")
    if (formaSelecionada === "borracha") {
        this.classList.add("selecionado");
    } else {
        formaSelecionada = "borracha"; // Ativar o modo de borracha
        tamanhoSlider.value = 10;
        contexto.lineWidth = tamanhoSlider.value;
        this.classList.add("selecionado");
        document.getElementById("botaoLapis").classList.remove("selecionado");
        document.querySelector(".fa-pencil").classList.remove("azul");
    }
    modoBorracha = true; // Sempre ative o modo de borracha ao clicar no botão "Borracha"
});



document.getElementById("botaoPreencher").addEventListener("click", function () {
    // Preenche a última forma desenhada com a cor selecionada
    if (formas.length > 0) {
        contexto.fillStyle = corSelecionada;
        contexto.fill();
    }
});

document.getElementById("botaoPreencherFundo").addEventListener("click", function () {
    // Preenche todo o fundo do canvas com a cor selecionada
    contexto.fillStyle = corSelecionada;
    contexto.fillRect(0, 0, canvas.width, canvas.height);
});

// Inicializei arrays para armazenar ações desfeitas e ações refeitas
var acoesDesfeitas = [];
var acoesRefeitas = [];

document.getElementById("botaoDesfazer").addEventListener("click", function () {
    if (acoes.length > 0) {
        var acaoDesfeita = acoes.pop(); // Remove a última ação
        acoesDesfeitas.push(acaoDesfeita); // Adiciona a ação desfeita à pilha de ações desfeitas

        contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        if (acoes.length > 0) {
            contexto.putImageData(acoes[acoes.length - 1], 0, 0); // Restaura a ação anterior
        }
    }
});

document.getElementById("botaoRefazer").addEventListener("click", function () {
    if (acoesDesfeitas.length > 0) {
        var acaoRefazer = acoesDesfeitas.pop(); // Remove a última ação desfeita
        acoes.push(acaoRefazer); // Adicione a ação de volta à pilha de ações

        contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        contexto.putImageData(acaoRefazer, 0, 0); // Restaura a ação desfeita
    }
});


document.getElementById("botaoLimpar").addEventListener("click", function () {
    contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
});

document.getElementById("salvarDesenho").addEventListener("click", function () {
    salvarCanvasComoImagem();
});

function salvarCanvasComoImagem() {
    let canvasCopia = document.createElement('canvas');
    let contextoCopia = canvasCopia.getContext('2d');

    canvasCopia.width = canvas.width;
    canvasCopia.height = canvas.height;

    contextoCopia.fillStyle = "#ffffff"; // Preenche o novo canvas com o fundo branco
    contextoCopia.fillRect(0, 0, canvasCopia.width, canvasCopia.height);

    contextoCopia.drawImage(canvas, 0, 0); // Desenha o conteúdo do canvas original na cópia

    let link = document.createElement('a');
    link.href = canvasCopia.toDataURL(); // Converte o conteúdo da cópia em uma URL de dados

    link.download = 'desenho.png';
    link.click();
}

