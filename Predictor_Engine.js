const PredictorEngine = {
    forecast(grid, threats) {
        let res = { isKillPathFound: false, dangerMoves: [] };
        for (let t of threats.slice(0, 5)) {
            let simGrid = grid.map(row => [...row]);
            simGrid[t.r][t.c] = 1;
            if (this.checkWinFast(simGrid, t.r, t.c, 1)) {
                res.isKillPathFound = true;
                res.dangerMoves.push(t);
            }
        }
        return res;
    },

    checkWinFast(grid, r, c, p) {
        const ds = [[1,0],[0,1],[1,1],[1,-1]];
        for (let [dr, dc] of ds) {
            let cnt = 1;
            for (let i=1;i<5;i++) if(grid[r+dr*i]?.[c+dc*i]===p) cnt++; else break;
            for (let i=1;i<5;i++) if(grid[r-dr*i]?.[c-dc*i]===p) cnt++; else break;
            if (cnt >= 5) return true;
        }
        return false;
    }
};
export default PredictorEngine;
