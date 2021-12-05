import Index from "../index.js"
import GameResults from "./gameResults.js";
import GameLogic from "../utils/gameLogic.js";
import LocalGame from "../utils/localGame.js";
import BotGame from "../utils/botGame.js";
import BotUtils from "../utils/botUtils.js";

export default (() => {

    let player1, player2, game;

    function display(p1, p2, gameType) {
        player1 = p1;
        player2 = p2;
        game = gameType;

        if (player1 === "") player1 = "Player 1";
        if (player2 === "") player2 = "Player 2";

        const gameDiv = document.querySelector(".game");
        gameDiv.append(PlayerUtils.createCurrentPlayerText());
        gameDiv.append(GameBoard.create());
        gameDiv.append(QuitButton.create());

        const bot_has_to_make_first_move = game != "local" && PlayerUtils.getCurrentPlayerName() != "Player";
        if (bot_has_to_make_first_move) {
            switch (game) {
                case "easy":
                    BotUtils.EasyBot.makeMove();
                    break;
                case "normal":
                case "jeff":
                default:
                    return;
            }
            PlayerUtils.switchCurrentPlayer();
            GameBoard.switchCurrentSymbol();
        }
    
    }

    function resetGame() {
        Index.clearGameDisplay();
        const winner = PlayerUtils.getCurrentPlayerName();
        const loser = PlayerUtils.getPreviousPlayerName();
        display(loser, winner, game);
    }

    const PlayerUtils = (() => {
        let currentPlayer;

        function getCurrentPlayerName() {
            return currentPlayer;
        }

        function getPreviousPlayerName() {
            return currentPlayer === player1 ? player2 : player1;
        }

        function createCurrentPlayerText() {
            currentPlayer = player1;

            const currentPlayerText = document.createElement("p");
            currentPlayerText.id = "current-player";
            currentPlayerText.textContent = `It's ${currentPlayer}'s turn`;

            return currentPlayerText;
        }

        function switchCurrentPlayer() {
            const currentPlayerText = document.getElementById("current-player");
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            currentPlayerText.textContent = `It's ${currentPlayer}'s turn`;
        }

        return { 
            getCurrentPlayerName, 
            getPreviousPlayerName, 
            createCurrentPlayerText, 
            switchCurrentPlayer 
        };

    })();

    const GameBoard = (() => {
        const NUM_OF_ROWS = 3;
        const NUM_OF_COLUMNS = 3;
        const NUM_OF_SPACES = NUM_OF_ROWS * NUM_OF_COLUMNS;
        let currentSymbol;

        function create() {
            currentSymbol = "X";
            const gameBoard = document.createElement("div");
            gameBoard.classList.add("gameboard");
            generateSpaces(gameBoard);
            return gameBoard;
        }

        function getCurrentSymbol() {
            return currentSymbol;
        }

        function switchCurrentSymbol() {
            currentSymbol = currentSymbol === "X" ? "O" : "X";
        }

        function extractSymbols() {
            const spaces = Array.from(document.getElementsByClassName("space"));
            const symbols = [];
            for (let i = 0; i < NUM_OF_ROWS; i++) {
                symbols.push([]);
                for (let j = 0; j < NUM_OF_COLUMNS; j++) {
                    let space = spaces.shift();
                    symbols[i].push(space.innerText);
                }
            }

            return symbols;
        }

        function generateSpaces(parentBoard) {
            for (let i = 1; i <= NUM_OF_SPACES; i++) {
                const space = document.createElement("div");
                space.id = i;
                space.classList.add("space");
                space.innerText = "";
                space.style.cursor = "pointer";

                switch(game) {
                    case "local":
                        space.onclick = LocalGame.behavior;
                        break;
                    case "easy":
                        space.onclick = BotGame.easyMode;
                        break;
                    case "normal":
                        space.onclick = BotGame.normalMode;
                        break;
                    case "jeff":
                        space.onclick = BotGame.hardMode;
                        break;
                    default:
                        space.onclick = LocalGame.behavior;
                }

                let row = i < 4 ? "top" : i < 7 ? "middle" : "bottom";
                let col = i % 3 === 0 ? "right" : i % 3 === 1 ? "left" : "center";
                space.classList.add(row, col);

                parentBoard.append(space);
            }
        }

        function disableSpaces() {
            const spaces = document.getElementsByClassName("space");
            for (let space of spaces) {
                space.style.pointerEvents = "none";
            }
        }

        function enableSpaces() {
            const spaces = document.getElementsByClassName("space");
            for (let space of spaces) {
                space.style.pointerEvents = "all";
            }
        }

        return { 
            create, 
            getCurrentSymbol, 
            switchCurrentSymbol, 
            extractSymbols,
            disableSpaces,
            enableSpaces 
        };

    })();

    const QuitButton = (() => {

        function create() {
            const quitButton = document.createElement("button");
            quitButton.innerText = "Quit";
            quitButton.classList.add("quit");
            quitButton.onclick = Index.goBackToMainMenu;

            return quitButton;
        }

        return { create };
    })();

    // These are the only usable methods and properties outside this file
    return { display, resetGame, PlayerUtils, GameBoard }
})();