import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Kết nối tới Cloud của bro
const firebaseConfig = { 
    databaseURL: "https://carovippro-default-rtdb.firebaseio.com/" 
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const SIZE = 12;
let board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
let history = []; 
let brainData = {};

// Tải dữ liệu học lỏm từ Cloud
async function loadBrain() {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'brain'));
        if (snapshot.exists()) brainData = snapshot.val();
        console.log("Đã tải não bộ từ Cloud!");
    } catch (e) { console.error("Lỗi tải não:", e); }
}
loadBrain();

window.startGame = () => {
    board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    history = [];
    document.getElementById('status').innerText = "Trận đấu bắt đầu!";
    render();
};

function render() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${board[r][c] || ''}`;
            cell.innerText = board[r][c] || '';
            cell.onclick = () => playerMove(r, c);
            boardEl.appendChild(cell);
        }
    }
}

function playerMove(r, c) {
    if (board[r][c]) return;
    board[r][c] = 'X';
    history.push({r, c, p: 'X'});
    render();
    if (checkWin(r, c, 'X')) {
        document.getElementById('status').innerText = "Bro thắng rồi! Đang gửi dữ liệu cho Bot học...";
        saveVictory('X');
    } else {
        document.getElementById('status').innerText = "Bot đang soi chiêu...";
        setTimeout(botMove, 500);
    }
}

function botMove() {
    let bestScore = -Infinity;
    let move = null;
    // Quét tìm nước đi kết hợp Logic + Cloud Data
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (!board[r][c]) {
                let score = Math.random() * 5; 
                let key = `${r}_${c}`;
                if (brainData[key]) score += brainData[key] * 20; // Ưu tiên nước đi từng thắng
                if (score > bestScore) { bestScore = score; move = {r, c}; }
            }
        }
    }
    if (move) {
        board[move.r][move.c] = 'O';
        history.push({r: move.r, c: move.c, p: 'O'});
        render();
        if (checkWin(move.r, move.c, 'O')) {
            document.getElementById('status').innerText = "Bot thắng! Chiêu này đã được lưu vào Cloud.";
            saveVictory('O');
        } else {
            document.getElementById('status').innerText = "Đến lượt bro!";
        }
    }
}

function saveVictory(winner) {
    history.forEach(m => {
        let key = `${m.r}_${m.c}`;
        brainData[key] = (brainData[key] || 0) + (m.p === winner ? 1 : -1);
    });
    set(ref(db, 'brain'), brainData);
}

function checkWin(r, c, p) {
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    for (let [dr, dc] of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            let nr = r + dr*i, nc = c + dc*i;
            if (nr>=0 && nr<SIZE && nc>=0 && nc<SIZE && board[nr][nc] === p) count++;
            else break;
        }
        for (let i = 1; i < 5; i++) {
            let nr = r - dr*i, nc = c - dc*i;
            if (nr>=0 && nr<SIZE && nc>=0 && nc<SIZE && board[nr][nc] === p) count++;
            else break;
        }
        if (count >= 5) return true;
    }
    return false;
}
