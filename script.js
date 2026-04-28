
console.log("个人主页加载完成");

/* =========================
   贪吃蛇
========================= */

const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const snakeScoreEl = document.getElementById("snakeScore");
const snakeStartBtn = document.getElementById("snakeStartBtn");

const gridSize = 20;
const tileCount = snakeCanvas.width / gridSize;

let snake = [];
let food = {};
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let snakeScore = 0;
let snakeTimer = null;
let snakeRunning = false;

function initSnake() {
    snake = [
        { x: 8, y: 8 },
        { x: 7, y: 8 },
        { x: 6, y: 8 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    snakeScore = 0;
    snakeScoreEl.textContent = snakeScore;
    snakeRunning = true;

    placeFood();
    drawSnakeGame();

    if (snakeTimer) {
        clearInterval(snakeTimer);
    }

    snakeTimer = setInterval(updateSnakeGame, 130);
}

function placeFood() {
    while (true) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };

        const onSnake = snake.some(part => part.x === food.x && part.y === food.y);
        if (!onSnake) {
            break;
        }
    }
}

function updateSnakeGame() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        gameOverSnake();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore++;
        snakeScoreEl.textContent = snakeScore;
        placeFood();
    } else {
        snake.pop();
    }

    drawSnakeGame();
}

function drawSnakeGame() {
    snakeCtx.fillStyle = "#111827";
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snakeCtx.fillStyle = "#ef4444";
    snakeCtx.fillRect(
        food.x * gridSize + 2,
        food.y * gridSize + 2,
        gridSize - 4,
        gridSize - 4
    );

    snakeCtx.fillStyle = "#22c55e";
    snake.forEach((part, index) => {
        snakeCtx.fillStyle = index === 0 ? "#86efac" : "#22c55e";
        snakeCtx.fillRect(
            part.x * gridSize + 2,
            part.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4
        );
    });
}

function gameOverSnake() {
    clearInterval(snakeTimer);
    snakeRunning = false;

    snakeCtx.fillStyle = "rgba(0, 0, 0, 0.65)";
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

    snakeCtx.fillStyle = "white";
    snakeCtx.font = "28px Microsoft YaHei";
    snakeCtx.textAlign = "center";
    snakeCtx.fillText("游戏结束", snakeCanvas.width / 2, 145);

    snakeCtx.font = "16px Microsoft YaHei";
    snakeCtx.fillText("点击按钮重新开始", snakeCanvas.width / 2, 180);
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if ((key === "arrowup" || key === "w") && direction.y !== 1) {
        nextDirection = { x: 0, y: -1 };
    } else if ((key === "arrowdown" || key === "s") && direction.y !== -1) {
        nextDirection = { x: 0, y: 1 };
    } else if ((key === "arrowleft" || key === "a") && direction.x !== 1) {
        nextDirection = { x: -1, y: 0 };
    } else if ((key === "arrowright" || key === "d") && direction.x !== -1) {
        nextDirection = { x: 1, y: 0 };
    }
});

snakeStartBtn.addEventListener("click", initSnake);
drawSnakeGame();


/* =========================
   扫雷
========================= */

const mineBoardEl = document.getElementById("mineBoard");
const mineStatusEl = document.getElementById("mineStatus");
const mineRestartBtn = document.getElementById("mineRestartBtn");

const mineRows = 9;
const mineCols = 9;
const mineCount = 10;

let mineBoard = [];
let mineGameOver = false;
let openedCells = 0;

function initMineGame() {
    mineBoard = [];
    mineGameOver = false;
    openedCells = 0;
    mineStatusEl.textContent = "游戏进行中";

    for (let r = 0; r < mineRows; r++) {
        const row = [];
        for (let c = 0; c < mineCols; c++) {
            row.push({
                row: r,
                col: c,
                mine: false,
                open: false,
                flag: false,
                count: 0
            });
        }
        mineBoard.push(row);
    }

    placeMines();
    calculateNumbers();
    renderMineBoard();
}

function placeMines() {
    let placed = 0;

    while (placed < mineCount) {
        const r = Math.floor(Math.random() * mineRows);
        const c = Math.floor(Math.random() * mineCols);

        if (!mineBoard[r][c].mine) {
            mineBoard[r][c].mine = true;
            placed++;
        }
    }
}

function calculateNumbers() {
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (mineBoard[r][c].mine) {
                continue;
            }

            let count = 0;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;

                    if (
                        nr >= 0 &&
                        nr < mineRows &&
                        nc >= 0 &&
                        nc < mineCols &&
                        mineBoard[nr][nc].mine
                    ) {
                        count++;
                    }
                }
            }

            mineBoard[r][c].count = count;
        }
    }
}

function renderMineBoard() {
    mineBoardEl.innerHTML = "";

    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            const cell = mineBoard[r][c];
            const button = document.createElement("button");

            button.className = "mine-cell";

            if (cell.open) {
                button.classList.add("open");

                if (cell.mine) {
                    button.classList.add("mine");
                    button.textContent = "💣";
                } else if (cell.count > 0) {
                    button.textContent = cell.count;
                }
            } else if (cell.flag) {
                button.classList.add("flag");
                button.textContent = "🚩";
            }

            button.addEventListener("click", () => openMineCell(r, c));
            button.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            });

            mineBoardEl.appendChild(button);
        }
    }
}

function openMineCell(r, c) {
    if (mineGameOver) {
        return;
    }

    const cell = mineBoard[r][c];

    if (cell.open || cell.flag) {
        return;
    }

    cell.open = true;

    if (cell.mine) {
        mineGameOver = true;
        mineStatusEl.textContent = "踩雷了，游戏失败";
        openAllMines();
        renderMineBoard();
        return;
    }

    openedCells++;

    if (cell.count === 0) {
        openEmptyAround(r, c);
    }

    if (openedCells === mineRows * mineCols - mineCount) {
        mineGameOver = true;
        mineStatusEl.textContent = "恭喜，你赢了！";
    }

    renderMineBoard();
}

function openEmptyAround(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;

            if (
                nr < 0 ||
                nr >= mineRows ||
                nc < 0 ||
                nc >= mineCols
            ) {
                continue;
            }

            const nextCell = mineBoard[nr][nc];

            if (!nextCell.open && !nextCell.flag && !nextCell.mine) {
                nextCell.open = true;
                openedCells++;

                if (nextCell.count === 0) {
                    openEmptyAround(nr, nc);
                }
            }
        }
    }
}

function toggleFlag(r, c) {
    if (mineGameOver) {
        return;
    }

    const cell = mineBoard[r][c];

    if (cell.open) {
        return;
    }

    cell.flag = !cell.flag;
    renderMineBoard();
}

function openAllMines() {
    for (let r = 0; r < mineRows; r++) {
        for (let c = 0; c < mineCols; c++) {
            if (mineBoard[r][c].mine) {
                mineBoard[r][c].open = true;
            }
        }
    }
}

mineRestartBtn.addEventListener("click", initMineGame);
initMineGame();
