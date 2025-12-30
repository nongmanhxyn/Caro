import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// THAY LINK CỦA M VÀO ĐÂY NÈ
const firebaseConfig = { 
    databaseURL: "https://carovippro-default-rtdb.firebaseio.com/" 
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const SIZE = 12;
let board = [];
let history = [];
let brainData = {};
let isGameOver = true;

// Tải não từ Cloud
async function loadBrain() {
    try {
        const snapshot = await get(child(ref(db), 'brain'));
        if (snapshot.exists()) brainData = snapshot.val();
        document.getElementById('status').innerText = "Đã kết nối Cloud. Chiến thôi!";
    } catch (e) { document.getElementById('status').innerText = "Chế độ Offline (Lỗi Cloud)"; }
}
loadBrain();

function initBoard() {
    board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.onclick = () => playerMove(r, c);
            boardEl.appendChild(cell);
        }
    }
}

window.playerMove = (r, c) => {
    if (isGameOver || board[r][c]) return;
    makeMove(r, c, 'X');
    if (checkWin(r, c, 'X')) {
        endGame("Bro thắng! Bot đang học lỏm...");
        saveToCloud('X');
    } else {
        document.getElementById('status').innerText = "Bot đang tính...";
        setTimeout(botMove, 400);
    }
};

function botMove() {
    if (isGameOver) return;
    let bestScore = -Infinity;
    let move = null;

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c]) {
                let score = evaluateMove(r, c);
                // CỘNG ĐIỂM HỌC LỎM TỪ CLOUD
                let key = `${r}_${c}`;
                if (brainData[key]) score += brainData[key] * 50; 

                if (score > bestScore) {
                    bestScore = score;
                    move = {r, c};
                }
            }
        }
    }
    if (move) {
        makeMove(move.r, move.c, 'O');
        if (checkWin(move.r, move.c, 'O')) {
            endGame("Bot thắng! Đã lưu chiêu thâm độc.");
            saveToCloud('O');
        } else {
            document.getElementById('status').innerText = "Đến lượt bro!";
        }
    }
}

function makeMove(r, c, p) {
    board[r][c] = p;
    history.push({r, c, p});
    const cell = document.querySelector(`.cell[data-r='${r}'][data-c='${c}']`);
    cell.innerText = p;
    cell.classList.add(p);
}

function evaluateMove(r, c) {
    // Logic đánh gat: Ưu tiên chặn 3, chặn 4 và nối 4 của mình
    let score = Math.random() * 2;
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    directions.forEach(([dr, dc]) => {
        score += countInDir(r, c, dr, dc, 'O') * 10; // Điểm tấn công
        score += countInDir(r, c, dr, dc, 'X') * 15; // Điểm phòng thủ (Chặn bro)
    });
    return score;
}

function countInDir(r, c, dr, dc, p) {
    let count = 0;
    [[dr, dc], [-dr, -dc]].forEach(([tr, tc]) => {
        let nr = r + tr, nc = c + tc;
        while(nr>=0 && nr<SIZE && nc>=0 && nc<SIZE && board[nr][nc] === p) {
            count++; nr += tr; nc += tc;
        }
    });
    return count;
}

function checkWin(r, c, p) {
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    return directions.some(([dr, dc]) => countInDir(r, c, dr, dc, p) >= 4);
}

function saveToCloud(winner) {
    history.forEach(m => {
        let key = `${m.r}_${m.c}`;
        brainData[key] = (brainData[key] || 0) + (m.p === winner ? 2 : -1);
    });
    set(ref(db, 'brain'), brainData);
}

function endGame(msg) {
    isGameOver = true;
    document.getElementById('status').innerText = msg;
}

document.getElementById('startBtn').onclick = () => {
    isGameOver = false;
    history = [];
    initBoard();
    document.getElementById('status').innerText = "Trận đấu bắt đầu!";
};
