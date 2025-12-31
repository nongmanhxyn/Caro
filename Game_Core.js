import Brain from './Brain_Master.js';

class GameCore {
    constructor() {
        this.grid = Array(12).fill(0).map(() => Array(12).fill(0));
        this.isOver = false;
    }

    async playerMove(r, c) {
        if (this.grid[r][c] !== 0 || this.isOver) return;
        this.grid[r][c] = 1;
        
        let botMove = await Brain.compute(this.grid);
        this.grid[botMove.r][botMove.c] = 2;
        
        this.updateUI(r, c, botMove.r, botMove.c);
    }

    updateUI(pr, pc, br, bc) {
        // Đồng bộ với Game_Interface.js
    }
}
export default new GameCore();
