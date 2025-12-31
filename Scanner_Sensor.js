const ScannerSensor = {
    dirs: [[1,0], [0,1], [1,1], [1,-1], [-1,0], [0,-1], [-1,-1], [-1,1]],

    analyze(grid) {
        let heatmap = Array(12).fill(0).map(() => Array(12).fill(0));
        let threats = [];
        let maxScore = 0;

        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                if (grid[r][c] === 0) {
                    let pScore = this.getWeight(grid, r, c, 1);
                    let bScore = this.getWeight(grid, r, c, 2);
                    
                    let combined = pScore * 1.5 + bScore;
                    heatmap[r][c] = combined;
                    
                    if (pScore > 100) threats.push({r, c, s: pScore});
                    if (combined > maxScore) maxScore = combined;
                }
            }
        }
        return { dangerScore: maxScore, threats: threats.sort((a,b) => b.s - a.s), heatmap };
    },

    getWeight(grid, r, c, p) {
        let total = 0;
        this.dirs.forEach(([dr, dc]) => {
            let count = 0, open = 0, gap = 0;
            for (let i = 1; i <= 4; i++) {
                let nr = r + dr * i, nc = c + dc * i;
                if (nr<0||nr>=12||nc<0||nc>=12) break;
                if (grid[nr][nc] === p) count++;
                else if (grid[nr][nc] === 0) { open++; break; }
                else break;
            }
            for (let i = 1; i <= 4; i++) {
                let nr = r - dr * i, nc = c - dc * i;
                if (nr<0||nr>=12||nc<0||nc>=12) break;
                if (grid[nr][nc] === p) count++;
                else if (grid[nr][nc] === 0) { open++; break; }
                else break;
            }
            total += this.calc(count, open);
        });
        return total;
    },

    calc(c, o) {
        if (c >= 4) return 10000000;
        if (c === 3 && o === 2) return 500000;
        if (c === 3 && o === 1) return 10000;
        if (c === 2 && o === 2) return 5000;
        return c * 100;
    }
};
export default ScannerSensor;
