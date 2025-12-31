import Scanner from './Scanner_Sensor.js';
import Predictor from './Predictor_Engine.js';
import TrapLib from './Trap_Library.js';
import Defense from './Defense_Advanced.js';
import Attack from './Attack_Striker.js';
import Psycho from './Psychology_Tactics.js';
import GameCore from './Game_Core.js';

class BrainMaster {
    constructor() {
        this.boardSize = 12;
        this.dangerZone = [];
        this.lastTarget = null;
        this.aiMode = 'NEUTRAL';
    }

    async compute(grid) {
        console.log("LOG: [BRAIN] Khởi động quét đa tầng...");
        const scan = Scanner.analyze(grid);
        const prediction = Predictor.forecast(grid, scan.topThreats);
        
        if (scan.dangerScore > 1000000 || prediction.isKillPathFound) {
            this.aiMode = 'SURVIVAL';
            console.warn("LOG: [BRAIN] Đe dọa cực lớn! Kích hoạt phòng thủ.");
            let defMove = Defense.findSafetyPoint(grid, scan.threats);
            if (defMove) return defMove;
        }

        const midTrap = TrapLib.checkMidGame(grid);
        if (midTrap && scan.dangerScore < 500000) {
            this.aiMode = 'TRAPPING';
            console.log("LOG: [BRAIN] Gài bẫy trung cuộc: " + midTrap.name);
            return Psycho.obfuscate(midTrap.move);
        }

        const openTrap = TrapLib.checkOpening(grid);
        if (openTrap && grid.flat().filter(x => x !== 0).length < 20) {
            this.aiMode = 'OPENING';
            return openTrap.move;
        }

        this.aiMode = 'AGGRESSIVE';
        let attackMove = Attack.solve(grid, scan.potentialPoints);
        
        if (!attackMove) {
            attackMove = scan.topThreats[0] || {r: 6, c: 6};
        }
        
        this.lastTarget = attackMove;
        return attackMove;
    }

    logHistory(r, c, p) {
        this.history.push({r, c, p, ts: Date.now()});
        if (this.history.length > 100) this.history.shift();
    }
}
export default new BrainMaster();
