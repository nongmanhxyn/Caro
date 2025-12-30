const SIZE = 12;
let board = [];
let gameOver = true;
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

function startGame() {
    board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    gameOver = false;
    statusElement.innerText = "Den luot bro (X)";
    render();
}

function render() {
    boardElement.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (board[r][c]) {
                cell.innerText = board[r][c];
                cell.classList.add(board[r][c].toLowerCase(), 'taken');
            }
            cell.onclick = () => playerMove(r, c);
            boardElement.appendChild(cell);
        }
    }
}

function playerMove(r, c) {
    if (gameOver || board[r][c]) return;
    board[r][c] = 'X';
    render();
    if (checkWin(r, c, 'X')) {
        statusElement.innerText = "Bro thang roi! Ghe vay!";
        gameOver = true;
        return;
    }
    statusElement.innerText = "Bot dang tinh...";
    setTimeout(botMove, 100);
}

function botMove() {
    if (gameOver) return;
    let bestScore = -Infinity;
    let move;

    // Quet cac o trong de tim nuoc di tot nhat
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c]) {
                let score = evaluateMove(r, c, 'O');
                if (score > bestScore) {
                    bestScore = score;
                    move = { r, c };
                }
            }
        }
    }

    if (move) {
        board[move.r][move.c] = 'O';
        render();
        if (checkWin(move.r, move.c, 'O')) {
            statusElement.innerText = "Bot thang roi! Den thoi!";
            gameOver = true;
        } else {
            statusElement.innerText = "Den luot bro (X)";
        }
    }
}

// Ham luong gia diem cho nuoc di - Day la linh hon cua Bot
function evaluateMove(r, c, player) {
    let score = 0;
    const opponent = player === 'O' ? 'X' : 'O';
    
    // Uu tien chan doi thu va tan cong
    score += getLineScore(r, c, player); // Diem tan cong
    score += getLineScore(r, c, opponent) * 1.5; // Diem phong ngu (chan bro)
    
    return score;
}

function getLineScore(r, c, p) {
    let total = 0;
    const dirs = [[1,0], [0,1], [1,1], [1,-1]];
    for (let [dr, dc] of dirs) {
        let count = 1;
        // Dem 2 phia
        count += countDir(r, c, dr, dc, p);
        count += countDir(r, c, -dr, -dc, p);
        if (count >= 5) total += 10000;
        else if (count === 4) total += 1000;
        else if (count === 3) total += 100;
        else if (count === 2) total += 10;
    }
    return total;
}

function countDir(r, c, dr, dc, p) {
    let count = 0;
    let nr = r + dr, nc = c + dc;
    while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === p) {
        count++;
        nr += dr; nc += dc;
    }
    return count;
}

function checkWin(r, c, p) {
    const dirs = [[1,0], [0,1], [1,1], [1,-1]];
    for (let [dr, dc] of dirs) {
        if (countDir(r, c, dr, dc, p) + countDir(r, c, -dr, -dc, p) + 1 >= 5) return true;
    }
    return false;
}
