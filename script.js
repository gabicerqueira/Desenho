let canvas = document.getElementById('canvas');//Pega o ID canvas no HTML
let contexto = canvas.getContext("2d"); //Pegamos o contexto do desenho, esse é o método que retorna o tipo de animação, parametro 2d significa que o objeto que será redenrizado será bidiomensional
let desenhando = false; //variável que vai identificar se estamos desenhando
let corSelecionada = "#000000";
let modoBorracha = false;
let formas = [];
let acoes = []; // Armazena ações de desenho para desfazer

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

    if (modoBorracha) {
        tamanhoSlider.value = 1;//tamanho do lápis
        contexto.lineWidth = tamanhoSlider.value; //base no valor do slider
        this.style.backgroundColor = ""; // Limpa o estilo de fundo
    } else {
        tamanhoSlider.value = 10; //tamanho da borracha
        contexto.lineWidth = tamanhoSlider.value; //base no valor do slider
        this.style.backgroundColor = "#828282"; // Define o estilo de fundo para indicar que a borracha está ativada
    }

    modoBorracha = !modoBorracha; // Alternar entre lápis e borracha
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

document.getElementById("botaoDesfazer").addEventListener("click", function () {
    if (acoes.length > 0) {
        acoes.pop(); // Remove a última ação
        contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        if (acoes.length > 0) {
            contexto.putImageData(acoes[acoes.length - 1], 0, 0); // Restaura a ação anterior
        }
    }
});

document.getElementById("botaoLimpar").addEventListener("click", function () {
    contexto.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
});