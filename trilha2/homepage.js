// Elementos da Página
const loginForm = document.querySelector(".login");
const homepage = document.getElementById("homepage");
const configArea = document.getElementById("config-area");
const rulesArea = document.getElementById("rules-area");
const boardArea = document.getElementById("board-area");


// Mostrar a homepage após o login
document.getElementById("btn").addEventListener("click", function(event) {
    event.preventDefault();
    loginForm.style.display = "none";
    homepage.style.display = "block";
});

// Botão "Jogar" - Mostra as Configurações
document.getElementById("play-game").addEventListener("click", function() {
    homepage.style.display = "none";
    configArea.style.display = "block";
});

// Botão "Regras" - Mostra as Regras
document.getElementById("view-rules").addEventListener("click", function() {
    homepage.style.display = "none";
    rulesArea.style.display = "block";
});

// Botão "Logout" - Volta ao Login
document.getElementById("logout").addEventListener("click", function() {
    homepage.style.display = "none";
    loginForm.style.display = "block";
});

// Botão "Voltar" nas Regras - Retorna à Homepage
document.getElementById("back-to-home-from-rules").addEventListener("click", function() {
    rulesArea.style.display = "none";
    boardArea.style.display = "none";
    configArea.style.display = "none";
    homepage.style.display = "block";
});

// Botão "Voltar" nas configuracaoes
document.getElementById("back-to-home-from-conf").addEventListener("click", function() {
    rulesArea.style.display = "none";
    boardArea.style.display = "none";
    configArea.style.display = "none";
    homepage.style.display = "block";
});

// Voltar para a página de configurações a partir do jogo


// Página de Classificações
document.getElementById("classificacoes-button").addEventListener("click", function() {
    homepage.style.display = "none";
    document.getElementById("classificacoes-area").style.display = "block";
});

// Botão "Voltar" nas Classificações - Retorna à Homepage
document.getElementById("back-to-home-from-class").addEventListener("click", function() {
    document.getElementById("classificacoes-area").style.display = "none";
    homepage.style.display = "block";
});