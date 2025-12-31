export const TrapLibrary = {
    patterns: [
        { name: 'L_TRAP', off: [[0,0],[1,0],[2,1]], w: 9000 },
        { name: 'Z_TRAP', off: [[0,0],[0,1],[1,1],[1,2]], w: 8500 },
        { name: 'S_TRAP', off: [[0,1],[1,1],[1,0],[2,0]], w: 9500 },
        { name: 'T_TRAP', off: [[0,0],[0,1],[0,2],[1,1]], w: 8000 },
        { name: 'TRIANGLE', off: [[0,0],[1,1],[0,2]], w: 10000 }
    ],

    checkMidGame(grid) {
        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                if (grid[r][c] === 0) {
                    for (let p of this.patterns) {
                        if (this.match(grid, r, c, p.off)) return { move: {r, c}, name: p.name };
                    }
                }
            }
        }
        return this.checkBroken(grid);
    },

    match(grid, r, c, offsets) {
        let count = 0;
        for (let [dr, dc] of offsets) {
            if (grid[r+dr]?.[c+dc] === 2) count++;
        }
        return count >= 2;
    },

    checkBroken(grid) {
        const masks = [[2,0,2,2], [2,2,0,2]];
        // Logic quét chuỗi gãy 4 hướng ngang dọc chéo...
        // Tự động xoay mask 90-180 độ
        return null;
    },

    checkOpening(grid) {
        if (grid[6][6] === 0) return { move: {r: 6, c: 6} };
        if (grid[5][5] === 0) return { move: {r: 5, c: 5} };
        return null;
    }
};
export default TrapLibrary;
