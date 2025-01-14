// FASE 0 : define os jogadores, cores e cria as peças do jogo - 
//as peças do player 1 aparecem do lado esquerdo do tabuleiro e as do player 2 ficam do lado direito

// FASE 1 : DROP PIECES

// FASE 2 : MOVE PIECES
   

class Player {
    constructor(color, size, isAI = false) {
        this.color = color;
        this.num_pieces = 3 * size;
        this.pieces_in_game = 3 * size; 
        this.possibleMoves_movePhase = []; 
        this.possibleMoves_dropPhase = [];
        this.isAI = isAI;
        this.selectedPiece = null;
        this.isPieceSelected = false;
    }

    renderPieces() {
        // Select the area where the pieces will go based on player color
        const piecesArea = document.querySelector(this.color === 'red' ? '.red-side' : '.blue-side');
        // Clear any existing pieces
        piecesArea.innerHTML = ''; 
        // Create and add each piece to the selected area
        for (let i = 0; i < this.num_pieces; i++) {
            const piece = document.createElement('button');
            if (this.color === 'red') {
                piece.classList.add('red-piece'); // Add piece styles and color
            } else {
                piece.classList.add('blue-piece'); // Add piece styles and color
            }
            piecesArea.appendChild(piece);
        }
    }

    // to remove a piece from the player's side  when the player places it on the game board
    removePiece() {
        const piecesArea = document.querySelector(this.color === 'red' ? '.red-side' : '.blue-side');
        if (piecesArea.children.length > 0) {
            piecesArea.removeChild(piecesArea.lastElementChild);  // Remove the last piece element
        }
    }
}


class Game {
    constructor(size, color1, color2, aiLevel, firstPlayer) {
        this.size = size;
        this.players = [
            new Player(color1, size, firstPlayer === 'computer'),
            new Player(color2, size, firstPlayer !== 'computer')
        ];
        this.currentPlayer = this.players[0];
        this.board = new this.Board(size);
        this.gamePhase = 'drop_pieces';
        //Minimax
        this.possibleMoves = null;
        this.lastmoves = 10; 
        this.mills = [];
        this.aiLevel = aiLevel;
        this.gameEnd = false;
    }
    // Inner Board class
    Board = class {
        constructor(size) {
            this.size = size;
            this.matrix = this.createBoardMatrix(size);
            this.renderBoard(this.matrix);
        }
        createBoardMatrix(size) {
            const matrix = [];
            const check_position = [];
            const rows = 2*(2*size) + 1; // Número de linhas e colunas do tabuleiro
            const midColumnIndex = Math.floor(rows / 2);
            
            // Inicializa a matriz de posições verificadas
            for (let r = 0; r < rows; r++) { 
                const line = [];
                for (let c = 0; c < rows; c++){
                    line.push(false);
                }
                check_position.push(line);
            }

            // Criação da matriz do tabuleiro
            for (let i = 0; i < rows; i++) {
                let row = [];
                for (let j = 0; j < rows; j++) {
                    // Diagonal principal
                    if (i === j && (i < (size*2) || i >= rows - (size*2)) && i%2 === 0) {
                        row.push(1);
                        check_position[i][j] = true;

                    // Diagonal secundária
                    } else if (i + j === rows - 1 && (i < (size*2) || i >= rows - (size*2)) && i%2 === 0) {
                        row.push(1); 
                        check_position[i][j] = true;

                    // Coluna central
                    } else if (j === midColumnIndex && (i < (size*2) || i >= rows - (size*2)) && i%2 === 0) {
                        row.push(1);
                        check_position[i][j] = true;
                    
                    // Linha central
                    } else if (i === midColumnIndex && (j < (size*2) || j >= rows - (size*2)) && j%2 === 0) {
                        row.push(1);
                        check_position[i][j] = true;

                    } else if(( i >=  (size*2) && i < rows-(size*2)) && (j >= (size*2) && j < rows - (size*2)) && i%2 === 0){
                        row.push(0)
                    
                    
                    // Colocação das linhas verticais - entradas com id = 3 
                    } else if (((i > j && i + j < rows - 1) || (i < j && i + j > rows - 1)) && ((i < midColumnIndex && j % 2 === 0) || (i > midColumnIndex && j % 2 === 0)) || (j===midColumnIndex && (i < (size*2 - 1) || i > rows - (size*2)))) {
                        row.push(3);
                        check_position[i][j] = true;
                        

                    // Colocação das linhas horizontais - entradas com id = 2
                    } else if (((i < j && i + j < rows - 1) || (i > j && i + j > rows - 1)) && ((j < midColumnIndex && i % 2 === 0) || (j > midColumnIndex && i % 2 === 0)) || (i===midColumnIndex && (j < (size*2 - 1) || j > rows - (size*2)))) { 
                        row.push(2);
                        check_position[i][j] = true;
                        
                    // Restantes células
                    } else {
                        row.push(0); 
                        check_position[i][j] = true;
                    }
                } 
                matrix.push(row); // Adiciona a linha à matriz
            }
            return matrix;
        }

        renderBoard() {
            const board = document.getElementById('game-board');
            const numRows = this.matrix.length;
            const numCols = this.matrix[0].length;
        
            // Calcula o tamanho da célula dinamicamente
            const boardSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
            const cellSize = boardSize / numRows;
        
            board.style.gridTemplateColumns = `repeat(${numCols}, ${cellSize}px)`;
            board.style.gridTemplateRows = `repeat(${numRows}, ${cellSize}px)`;
        
            board.innerHTML = ''; // Clear the board
        
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    const cell = document.createElement('div');
                    const button = document.createElement('button');
                    const cellValue = this.matrix[i][j];

                    if (cellValue === 1) {
                        button.classList.add('point');
                        button.setAttribute('data-row', i);  // Store row index
                        button.setAttribute('data-col', j);  // Store column index
                        cell.appendChild(button);
                    } else if (cellValue === "X") {
                        button.classList.add('blue-piece');
                        button.setAttribute('data-row', i);  // Store row index
                        button.setAttribute('data-col', j);  // Store column index
                        cell.appendChild(button);
                    } else if (cellValue === "O") {
                        button.classList.add('red-piece');
                        button.setAttribute('data-row', i);  // Store row index
                        button.setAttribute('data-col', j);  // Store column index
                        cell.appendChild(button);
                    }else if (cellValue === 2) {
                        cell.classList.add('horizontal-line');
                    } else if (cellValue === 3) {
                        cell.classList.add('vertical-line');
                    } else {
                        cell.classList.add('fundo');
                    }
                    board.appendChild(cell);
                    
                }
            }
        
        }
    }



    createPlayerSides() {
        // Get the game board container
        const gameBoard = document.getElementById('game-board');

        // Create blue-side container if it doesn't exist
        if (!document.querySelector('.blue-side')) {
            const blueSide = document.createElement('button');
            blueSide.classList.add('blue-side');
            gameBoard.appendChild(blueSide);
        }

        // Create red-side container if it doesn't exist
        if (!document.querySelector('.red-side')) {
            const redSide = document.createElement('button');
            redSide.classList.add('red-side');
            gameBoard.appendChild(redSide);
        }

        
    }
    updateStatusMessage(message, winner) {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = message, winner;
        statusMessage.style.visibility = 'visible'; // Torna a mensagem visível

        setTimeout(() => {
            statusMessage.style.visibility = 'hidden'; // Oculta a mensagem após 5 segundos
        }, 5000);
    } 
        
    

    init() {
        this.createPlayerSides();
        // Render pieces for both players
        this.players.forEach(player => player.renderPieces());
        this.board.renderBoard(this.board.matrix);
    }

    changePlayer() {
        // Toggle between the two players based on the current player
        this.currentPlayer = (this.currentPlayer === this.players[0]) ? this.players[1] : this.players[0];
        
         // Let the AI make a move if it's the AI's turn
        // if (this.currentPlayer.isAI) {
        //     this.makeMove();
        // }
    }

    // counts the player marks in a list - so that in the checkForMills function we can check if the player has 3 marks in a row/column
    countPlayerMarks(list, playerMark){
        let count = 0;
        for(let i = 0; i < list.length; i++){
            if(list[i] === playerMark){
                count++;
            }
        }
        return count;
    }


    checkForMills(matrix, playerMark) {
        //const potentialMills = []; // Para armazenar moinhos válidos encontrados
        // Verificação Horizontal
        for (let i = 0; i < matrix.length; i++) {

            let row = [];
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === playerMark) {
                    
                    row.push({ row: i, col: j }); // Adiciona coordenadas
                }
                
                if (row.length === 3) {
                    // Verifica se as três peças são adjacentes
                    if (this.isAdjacent(row[0].row, row[0].col, row[1].row, row[1].col, matrix) &&
                        this.isAdjacent(row[1].row, row[1].col, row[2].row, row[2].col, matrix)) {
                        
                        // Se forem adjacentes e ainda não registadas, adiciona o moinho
                        // Verifica se o moinho já existe
                        const exists = this.mills.some(mill =>
                            mill.every((point, index) => point.row === row[index].row && point.col === row[index].col)
                        );

                        if (!exists) {
                            this.mills.push(row);  // Adiciona o moinho às coordenadas
                            this.updateStatusMessage(`O jogador ${this.currentPlayer.color} fez um moinho! Selecione uma peça do adversário para remover.`);
                            return true;  // Mill found
                        }
                        break;
                    }
                }
            }
        }
    
        // Verificação Vertical
        for (let j = 0; j < matrix[0].length; j++) {
            let col = [];
            for (let i = 0; i < matrix.length; i++) {
                if (matrix[i][j] === playerMark) {
                    col.push({ row: i, col: j }); // Adiciona coordenadas
                }
                if (col.length === 3) {
                    // Verifica se as três peças são adjacentes
                    if (this.isAdjacent(col[0].row, col[0].col, col[1].row, col[1].col, matrix) &&
                        this.isAdjacent(col[1].row, col[1].col, col[2].row, col[2].col, matrix)) {
                        
                        // Se forem adjacentes e ainda não registradas, adiciona o moinho
                        // Verifica se o moinho já existe
                        const exists = this.mills.some(mill =>
                            mill.every((point, index) => point.row === col[index].row && point.col === col[index].col)
                        );

                        if (!exists) {
                            this.mills.push(col);  // Adiciona o moinho às coordenadas
                            this.updateStatusMessage(`O jogador ${this.currentPlayer.color} fez um moinho! Selecione uma peça do adversário para remover.`);
                            return true;  // Mill found
                        }
                    }
                }
            }
        }
    
        return false; // No mill found
    }
    


    isAdjacent(currentRow, currentCol, selectedRow, selectedCol, matrix) {
        // Verifica se estão na mesma linha
        if (currentRow === selectedRow) {
            // Determina a direção para a verificação (da menor coluna para a maior)
            const startCol = Math.min(currentCol, selectedCol);
            const endCol = Math.max(currentCol, selectedCol);
    
            // Verifica se todas as células entre elas (exclusivas) são linhas horizontais (valor 2)
            for (let j = startCol + 1; j < endCol; j++) {
                if (matrix[currentRow][j] !== 2) {
                    return false;
                }
            }
            return true; // Adjacente horizontalmente
        }
    
        // Verifica se estão na mesma coluna
        if (currentCol === selectedCol) {
            // Determina a direção para a verificação (da menor linha para a maior)
            const startRow = Math.min(currentRow, selectedRow);
            const endRow = Math.max(currentRow, selectedRow);
    
            // Verifica se todas as células entre elas (exclusivas) são linhas verticais (valor 3)
            for (let i = startRow + 1; i < endRow; i++) {
                if (matrix[i][currentCol] !== 3) {
                    return false;
                }
            }
            return true; // Adjacente verticalmente
        }
    
        // Não estão nem na mesma linha nem na mesma coluna, então não são adjacentes
        return false;
    }

    

    movePiece(row, col) {
    
        // Se o jogador clicar numa peça da sua cor
        console.log("Jogador:", this.currentPlayer.isAI);
        console.log(this.currentPlayer.isPieceSelected);
        console.log(" linha e coluna", row, col); 
        console.log("segunda condição", this.board.matrix[row][col] === (this.currentPlayer.color === 'blue' ? 'X' : 'O'));
        if (!this.currentPlayer.isPieceSelected && this.board.matrix[row][col] === (this.currentPlayer.color === 'blue' ? 'X' : 'O')) {
            this.currentPlayer.selectedPiece = {row, col};
            this.currentPlayer.isPieceSelected = true;  
            console.log(`Selected piece at Row ${row}, Column ${col}`);

            // Verificar possíveis movimentos
            this.possibleMoves_movePhase(row, col, this.currentPlayer, this.board.matrix);
            if(!this.myPiecesValid(this.currentPlayer, this.board.matrix)){
                this.updateStatusMessage("Empate - não há mais jogadas possíveis");
            }

    
        // Se uma peça já foi selecionada e o jogador clica numa célula vazia
        } else if (this.currentPlayer.isPieceSelected && this.board.matrix[row][col] === 1) {
            const selectedRow = this.currentPlayer.selectedPiece.row;
            const selectedCol = this.currentPlayer.selectedPiece.col;
    
            // Verificar se a célula de destino é adjacente
            if (this.isAdjacent(selectedRow, selectedCol, row, col, this.board.matrix) || this.currentPlayer.pieces_in_game === 3) {
                this.updateStatusMessage(`O jogador ${this.currentPlayer.color} moveu a peça para (${row}, ${col})`);   
                console.log(`Moving piece from (${selectedRow}, ${selectedCol}) to (${row}, ${col})`);

                this.removeMillIfNeeded(row,col); //Remover o Moinho
    
                // Atualizar a matriz com a nova posição
                this.board.matrix[row][col] = this.currentPlayer.color === 'blue' ? 'X' : 'O';
                this.board.matrix[selectedRow][selectedCol] = 1;
                this.board.renderBoard(this.board.matrix);
    
                const playerMark = this.currentPlayer.color === 'red' ? 'O' : 'X';
                if (this.checkForMills(this.board.matrix, playerMark)) {  
                    //console.log("Mill formed! Entering remove_piece phase.");
                    this.gamePhase = 'remove_piece';
                    this.removeOpponentPiece(playerMark,row,col);
                } else {
                    this.currentPlayer.selectedPiece = null;
                    this.currentPlayer.isPieceSelected = false;
                    this.changePlayer();
                }

                if(this.gamePhase === 'draw_phase'){
                    this.lastmoves--;
                }
    
                // Resetar o estado
                this.currentPlayer.selectedPiece = null;
                this.currentPlayer.isPieceSelected = false;
            } else {
                this.updateStatusMessage(`Jogada inválida. Selecione uma célula adjacente.`);   
                //console.log("Invalid move. The target cell is not adjacent.");
                this.currentPlayer.selectedPiece = null;
                this.currentPlayer.isPieceSelected = false;
            }
    
        } else {
            // this.updateStatusMessage(`Jogada inválida. Selecione uma das suas peças.`);   
             console.log("Invalid selection. Select one of your own pieces.");
            this.currentPlayer.selectedPiece = null;
            this.currentPlayer.isPieceSelected = false;
        }



    }



   
    possibleMoves_movePhase(selectedRow, selectedCol, player, matrix){
        player.possibleMoves_movePhase = [];
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[i].length; j++){
                
                if(matrix[i][j] === 1 && this.isAdjacent(selectedRow, selectedCol, i, j, matrix)){
                    
                    player.possibleMoves_movePhase.push({row: i, col: j});
                  
                }
            }
        }
        
    }



    displayLeaderboard() {
        const table = document.getElementById('ranking-table');
        table.innerHTML = `
            <tr>
                <th>Player Mark</th>
                <th>IA</th>
                <th>Nível da IA</th>
                <th>Vitórias</th>
                <th>Empates</th>
                <th>Derrotas</th>
            </tr>
        `;
    
        leaderboard.forEach(player => {
            table.innerHTML += `
                <tr>
                    <td>${player.playerMark}</td>
                    <td>${player.isAI ? 'Sim' : 'Não'}</td>
                    <td>${player.aiLevel || 'N/A'}</td>
                    <td>${player.wins}</td>
                    <td>${player.draws}</td>
                    <td>${player.losses}</td>
                </tr>
            `;
        });
    }
    
    

/*
    updateLeaderboard(resultado, aiLevel) {

            
        // Empate: atualiza o número de empates para todos os jogadores
        if (winnerMark === 'draw') {
            player.draws += 1;
        }
        // Vitória: atualiza a vitória apenas para o jogador correspondente
        else if ( resultado === 'humano') {
            player.wins += 1;
        }
        // Derrota: atualiza a derrota para os outros jogadores
        else if (player.playerMark !== winnerMark && player.isAI === true && (aiLevel === null || player.aiLevel === aiLevel)) {
            player.losses += 1;
        }
    

        this.updateLeaderboardTable();
    }
        */

    updateLeaderboard(resultado, aiLevel) {
        // Localiza o jogador humano e o AI no leaderboard
        const playerHumano = leaderboard.find(player => !player.isAI);
        const playerAI = leaderboard.find(player => player.isAI && player.aiLevel === aiLevel);
        
        // Atualiza os resultados conforme o resultado do jogo
        if (resultado === 'humano') {
            playerHumano.wins += 1;
            playerAI.losses += 1;
        } else if (resultado === 'AI') {
            playerHumano.losses += 1;
            playerAI.wins += 1;
        } else if (resultado === 'empate') {
            playerHumano.draws += 1;
            playerAI.draws += 1;
        } else {
            console.log('Resultado inválido. Use "humano", "AI" ou "empate".');
        }
        
        
        console.log(leaderboard);

        this.updateLeaderboardTable()

    }
    

    

    updateLeaderboardTable() {
        const leaderboardTable = document.getElementById("ranking-table").querySelector("tbody");
        leaderboardTable.innerHTML = ""; // Clear existing rows
    
        leaderboard.forEach(player => {
            const row = document.createElement("tr");
    
            
    
            const aiLevelCell = document.createElement("td");
            aiLevelCell.textContent = player.isAI ? player.aiLevel || "N/A" : "Human";
            row.appendChild(aiLevelCell);
    
            // Wins, draws, losses
            const winsCell = document.createElement("td");
            winsCell.textContent = player.wins;
            row.appendChild(winsCell);
    
            const drawsCell = document.createElement("td");
            drawsCell.textContent = player.draws;
            row.appendChild(drawsCell);
    
            const lossesCell = document.createElement("td");
            lossesCell.textContent = player.losses;
            row.appendChild(lossesCell);
    
            leaderboardTable.appendChild(row);
        });
    }

    

    checkWinner() {

        if(this.players[0].pieces_in_game === 2){
            console.log("Ganhou o vermelho"); 
            this.updateStatusMessage("Vencedor - Jogador Azul!");
            this.gameEnd = true;
            
            
            if(this.players[1].isAI){
                this.updateLeaderboard('AI', this.aiLevel);
            }else{
                this.updateLeaderboard('humano', this.aiLevel);
            }
       
            
        } else if (this.players[1].pieces_in_game === 2){
            console.log("Ganhou o azul!");
            this.updateStatusMessage("Vencedor - Jogador Vermelho!");
            this.gameEnd = true;
            

            if(this.players[0].isAI){
                this.updateLeaderboard('AI', this.aiLevel);
            }else{
                this.updateLeaderboard('humano', this.aiLevel);
            }
       
            
        }
     }

        

    checkDrawValidMoves(){

        //Condição de empate - se  jogador atual não tiver movimentos possíveis

        if(this.currentPlayer.possibleMoves_movePhase.length === 0){
            //console.log(this.currentPlayer.color + " has no possible moves. It's a draw.");
            // console.log("Empate");
            this.updateStatusMessage("Empate! Não há mais movimentos possíveis!");
            this.gameEnd = true;

        } 
    }

    checkDrawPlayCounts(){

        //Condição de Empate - se ambos os jogadores tiverem 3 peças e têm só 10 jogadas possíveis 

        // console.log(this.players[0].pieces_in_game);
        // console.log(this.players[1].pieces_in_game);

        if(this.players[0].pieces_in_game === 3 && this.players[1].pieces_in_game === 3){
            // console.log("Empate -> Cada jogador tem 3 peças.")
            this.updateStatusMessage("Atenção! O jogo termina em 10 jogadas!")
            return true; 

        }

        return false; 
    }


    // Função para remover um moinho de rowMills ou colMills quando uma peça do moinho é removida
    // Função para remover um moinho das coordenadas `mills` quando uma peça do moinho é removida
    removeMillIfNeeded(row, col) {
        row = Number(row);
        col = Number(col);
    
        //console.log(`Called removeMillIfNeeded() for point (${row}, ${col})`);
    
        const millsBefore = this.mills.length;
        this.mills = this.mills.filter(mill => {
            const containsPoint = mill.some(point => Number(point.row) === row && Number(point.col) === col);
    
            if (containsPoint) {
                //console.log(`Removing mill containing point (${row}, ${col})`);
            }
    
            return !containsPoint;
        });
    
        // const millsAfter = this.mills.length;
        //console.log(`Mills before: ${millsBefore}, Mills after: ${millsAfter}`);
    }
    
    
    
    removeOpponentPiece(playerMark,row,col) {

        // console.log("Entra na função remove piece")
        const opponentColor = playerMark === 'O' ? 'blue' : 'red';
        const board = document.getElementById('game-board');
    
        // Verificar se o jogador clicou numa peça do oponente
        if (this.board.matrix[row][col] === (opponentColor === 'blue' ? 'X' : 'O')) {   
            //console.log(`Removing opponent piece at Row ${row}, Column ${col}`);
            this.updateStatusMessage(`O jogador ${this.currentPlayer.color} removeu a peça em (${row}, ${col})`);
            this.board.matrix[row][col] = 1; // Define como vazio
            this.board.renderBoard();

            this.changePlayer(); 
            this.currentPlayer.pieces_in_game-- ;
            this.changePlayer(); 
            

            this.checkWinner(); 

            // Remover o moinho associado, se houver
            this.removeMillIfNeeded(row, col);

            // Atualizar a fase do jogo
            if (this.players[0].num_pieces === 0 && this.players[1].num_pieces === 0) {
                this.gamePhase = 'move_pieces';
            } else {
                this.gamePhase = 'drop_pieces';
            }

            if (this.checkDrawPlayCounts()){
               
                this.gamePhase = 'draw_phase';
            }
            
            //console.log("Piece removed. Returning to", this.gamePhase, "phase.");

            this.changePlayer();
        } else {
            this.updateStatusMessage(`Jogada inválida. Selecione uma peça do adversário para remover.`);
            //console.log("Invalid selection. Choose an opponent's piece to remove.");
        }
    }

    

    //---------------- AI Implementation ----------------
    makeMove() {
        // console.log("AI move requested.");
        // console.log("this.currentPlayer.isAI: ", this.currentPlayer.isAI);
        if (this.currentPlayer.isAI) {
            if (this.aiLevel === 'easy') {
                this.aiEasy();
            }
            // Add more AI behavior (e.g., 'medium', 'hard') here
        }
    }

    possibleMoves_dropPhase(player, matrix){
        player.possibleMoves_dropPhase = [];
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[i].length; j++){
                if(matrix[i][j] === 1){
                    player.possibleMoves_dropPhase.push({row: i, col: j});
                }
            }
        }
    }


    myPieces(player, matrix) {
        const piecesWithMoves = [];
    
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const playerMark = player.color === 'red' ? 'O' : 'X';
    
                // Verificar se a célula contém a peça do jogador
                if (matrix[i][j] === playerMark) {
                    // Obter os movimentos possíveis para essa peça
                     this.possibleMoves_movePhase(i, j,player, matrix);
                    const possibleMoves = player.possibleMoves_movePhase;
    
                    // Se tiver movimentos possíveis, adiciona a peça à lista
                    if (possibleMoves.length > 0) {
                        piecesWithMoves.push({ row: i, col: j });
                    }
                }
            }
        }
    
        return piecesWithMoves;
    }

    
    myPiecesValid(player, matrix) {
        const piecesWithMoves = [];
    
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const playerMark = player.color === 'red' ? 'O' : 'X';
    
                // Verificar se a célula contém a peça do jogador
                if (matrix[i][j] === playerMark) {
                    // Obter os movimentos possíveis para essa peça
                     this.possibleMoves_movePhase(i, j,player, matrix);
                    const possibleMoves = this.possibleMoves_movePhase;
    
                    // Se tiver movimentos possíveis, adiciona a peça à lista
                    if (possibleMoves.length > 0) {
                        return true;
                    }
                }
            }
        }
    
        return false;
    }

    
    myPieces_free_movement(player, matrix) {
        const piecesWithMoves = [];
    
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const playerMark = player.color === 'red' ? 'O' : 'X';
    
                // Verificar se a célula contém a peça do jogador
                if (matrix[i][j] === playerMark) {
                    piecesWithMoves.push({ row: i, col: j });
                }
            }
        }
    
        return piecesWithMoves;
    }
    


    removablePieces(player, matrix){
        const removablePieces = [];
        for(let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[i].length; j++){ 
                if(matrix[i][j] === (player.color === 'red' ? 'X' : 'O')){
                    removablePieces.push({row: i, col: j});
                }
            }
        }
        return removablePieces;
    }

    //Easy AI - Random moves
    aiEasy() {
        const aiPlayer = this.currentPlayer;
        //console.log("aiPlayer: ", aiPlayer);

    
        
        if (this.gamePhase === 'drop_pieces'){
            this.possibleMoves_dropPhase(aiPlayer, this.board.matrix);
            const possibleMoves = aiPlayer.possibleMoves_dropPhase;
            //console.log("possibleMoves: ", possibleMoves);
            if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                //console.log(`AI move: Row ${randomMove.row}, Column ${randomMove.col}`);
                this.play(randomMove.row, randomMove.col); // Execute the random move

            } 
        } 
        
        if (this.gamePhase === 'move_pieces'){

            if(aiPlayer.pieces_in_game > 3){
            
                const pieces = this.myPieces(aiPlayer,this.board.matrix);
                if (pieces.length > 0) {
                    const randomMove = pieces[Math.floor(Math.random() * pieces.length)];
                    //console.log(`AI Easy move: Row ${randomMove.row}, Column ${randomMove.col}`);
                    this.play(randomMove.row, randomMove.col); // Execute the random move

                    this.possibleMoves_movePhase(randomMove.row, randomMove.col, aiPlayer, this.board.matrix);
                    const possibleMoves = aiPlayer.possibleMoves_movePhase;
     
                    if (possibleMoves.length > 0) {
                        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
                        this.play(randomMove.row, randomMove.col); // Execute the random move
                    }
                }
            }

            if(aiPlayer.pieces_in_game === 3){
               
                const pieces = this.myPieces_free_movement(aiPlayer,this.board.matrix);
                console.log(pieces);
                if (pieces.length > 0) {
                    console.log("Entra pieces");
                    const randomMove = pieces[Math.floor(Math.random() * pieces.length)];
                    console.log(`AI Easy move: Row ${randomMove.row}, Column ${randomMove.col}`);
                    this.play(randomMove.row, randomMove.col); // Execute the random move
                    this.possibleMoves_dropPhase(aiPlayer, this.board.matrix);
                    const possibleMoves = aiPlayer.possibleMoves_dropPhase;
                    if (possibleMoves.length > 0) {
                        console.log("entra aqui");
                        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        // console.log(`AI Easy move: Row ${randomMove.row}, Column ${randomMove.col}`);
                        this.play(randomMove.row, randomMove.col); // Execute the random move
                    }
                }
            }
        }


        if (this.gamePhase === 'remove_piece'){
            const pieces_to_remove = this.removablePieces(aiPlayer, this.board.matrix);
            
            if (pieces_to_remove.length > 0) {
                const randomMove = pieces_to_remove[Math.floor(Math.random() * pieces_to_remove.length)];
                // console.log(`AI Easy move: Row ${randomMove.row}, Column ${randomMove.col}`);
                this.play(randomMove.row, randomMove.col); // Execute the random move
            }
        }
    }
        
    

   play(row, col) {
        let playerMark;
        if (this.currentPlayer.color === 'red') {
            playerMark = 'O';
        } else {
            playerMark = 'X';
        }

        const matrix = this.board.matrix;

        

        if (this.gamePhase === 'drop_pieces') {
            if (matrix[row][col] === 1 && this.currentPlayer.num_pieces > 0) {
                this.currentPlayer.num_pieces--; 
            this.currentPlayer.removePiece();

            matrix[row][col] = playerMark;
            this.board.renderBoard(matrix);

            let checkMills = this.checkForMills(matrix, playerMark, this.size);

            if (checkMills) {
                this.gamePhase = 'remove_piece';
            } else {
                this.changePlayer();
               
            }

            if ((this.players[0].num_pieces === 0 && this.players[1].num_pieces === 0) && (this.gamePhase !== 'remove_piece')) {
                this.gamePhase = 'move_pieces';
        
            }
        } else {
            this.updateStatusMessage(`Jogada inválida. Selecione uma célula vazia.`);
            // console.log('Invalid move. Try again.');
        }
    } else if (this.gamePhase === 'move_pieces') {
        this.movePiece(row, col);
    } else if (this.gamePhase === 'remove_piece'){

        this.removeOpponentPiece(playerMark, row, col);

    } else if (this.gamePhase === 'draw_phase') {

        if (this.lastmoves === 0) {
            this.checkWinner();

            // this.updateStatusMessage("Empate");
        } else {
            this.movePiece(row, col);
        }
    }
   }
}





const leaderboard = [
    {
        isAI: false,
        wins: 0,
        draws: 0,
        losses: 0
    },
    {
        isAI: true,
        aiLevel: 'easy',
        wins: 0,
        draws: 0,
        losses: 0
    },
   
];






let game; // Variável global para armazenar a instância do jogo

document.getElementById('start-game').addEventListener('click', () => {
    const boardSize = parseInt(document.getElementById('board-size').value);
    const aiLevel = document.getElementById('ai-level').value;
    const firstPlayer = document.getElementById('first-player').value;

    document.getElementById('board-area').style.display = 'block';
    document.querySelector('.config-area').style.display = 'none';

    // Inicializa a instância do jogo
    game = new Game(boardSize, 'red', 'blue', aiLevel, firstPlayer);
    game.init();

    // Listener para o botão "Back to Config"
    document.getElementById("back-to-config").addEventListener("click", () => {
        resetGame(); // Chama a função para reiniciar o jogo
    });

    

    // Listener para o tabuleiro
    document.getElementById('game-board').addEventListener('click', (event) => {
        if (game.currentPlayer.isAI) return;

        const isPoint = event.target.classList.contains('point');
        const isRedPiece = event.target.classList.contains('red-piece');
        const isBluePiece = event.target.classList.contains('blue-piece');

        if ((isPoint || isRedPiece || isBluePiece) && game.currentPlayer.isAI === false) {
            const row = parseInt(event.target.getAttribute('data-row'));
            const col = parseInt(event.target.getAttribute('data-col'));
            game.play(row, col);
        } 
        if (game.currentPlayer.isAI) {
            game.makeMove();
        }

        if (game.gameEnd === true) {
            
        }
    });
});


// Função para reiniciar o jogo
function resetGame() {

    console.log("criar novo jogo");
    // Limpa o tabuleiro
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    // Reseta a área de configuração
    document.getElementById('board-area').style.display = 'none';
    document.querySelector('.config-area').style.display = 'block';

    // Remove todos os listeners antigos
    const newGameBoard = gameBoard.cloneNode(true);
    gameBoard.parentNode.replaceChild(newGameBoard, gameBoard);

    // Limpa a instância do jogo
    game = null;
}

