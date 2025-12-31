/** * CARO OS V29 - MODULE: BRAIN_MASTER
 * Nhiệm vụ: Tổng tư lệnh điều phối 8 tầng não bộ.
 * Phân tích: Defense x100, Attack x100, Trap x100.
 */
import { Scanner } from '../sensors/Scanner_Sensor.js';
import { TrapLibrary } from '../data/Trap_Library.js';

class BrainMaster {
    constructor() {
        this.version = "V29.Monster";
        this.dangerThreshold = 80000; // Ngưỡng kích hoạt Defense x100
        this.memory = []; 
    }

    async compute(grid) {
        console.log("%c--- LEVIATHAN AI: STARTING DEEP ANALYSIS ---", "color: #00ff88; font-weight: bold;");

        // BƯỚC 1: SCANNER X100 - QUÉT TOÀN BỘ MA TRẬN
        const scan = Scanner.analyze(grid);
        const { maxDanger, threats, heatmap } = scan;

        console.log(`[BRAIN] Danger Level: ${maxDanger}`);

        // BƯỚC 2: DEFENSE X100 - CHẶN ĐỨNG TRAP TỪ TRỨNG NƯỚC
        if (maxDanger >= this.dangerThreshold) {
            console.warn("!! ALERT !! Kích hoạt giao thức PHÒNG THỦ.");
            // Tìm điểm giao tử thần (Root Block) để chặn 1 nước phá 2 đường
            const defensePoint = this.findRootBlock(threats);
            if (defensePoint) return defensePoint;
        }

        // BƯỚC 3: TRAP X100 - ĐỐI CHIẾU THƯ VIỆN BẪY ĐẠI KIỆN TƯỚNG
        const trapChance = TrapLibrary.scanForTraps(grid, 2); // 2 là Bot
        if (trapChance) {
            console.log("%c[BRAIN] Phát hiện cơ hội gài Trap: " + trapChance.name, "color: #05d9e8");
            return trapChance.move;
        }

        // BƯỚC 4: ATTACK X100 - TÌM CHUỖI KẾT LIỄU
        const bestAttack = this.calculateBestAttack(threats, heatmap);
        
        // LOGIC DỰ PHÒNG NẾU KHÔNG CÓ NƯỚC ĐI TỐT
        if (!bestAttack || grid[bestAttack.r][bestAttack.c] !== 0) {
            return this.findEmergencyMove(grid);
        }

        return bestAttack;
    }

    findRootBlock(threats) {
        // Thuật toán tìm điểm giao của các hướng tấn công đối thủ
        // Nếu Player có 2 hướng 3, tìm ô chung để chặn cả 2
        if (threats.length > 1) {
            for (let i = 0; i < threats.length; i++) {
                for (let j = i + 1; j < threats.length; j++) {
                    if (threats[i].r === threats[j].r && threats[i].c === threats[j].c) {
                        return { r: threats[i].r, c: threats[i].c };
                    }
                }
            }
        }
        return threats[0] ? { r: threats[0].r, c: threats[0].c } : null;
    }

    calculateBestAttack(threats, heatmap) {
        // Ưu tiên ô có tổng điểm Heatmap cao nhất để vừa công vừa thủ
        let best = { r: 6, c: 6, score: -1 };
        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                if (heatmap[r][c] > best.score) {
                    best = { r, c, score: heatmap[r][c] };
                }
            }
        }
        return best;
    }

    findEmergencyMove(grid) {
        // Tìm ô trống gần trung tâm nhất nếu rơi vào thế bí
        const centers = [[6,6], [5,5], [6,5], [5,6], [7,7]];
        for (let [r, c] of centers) {
            if (grid[r][c] === 0) return { r, c };
        }
        // Quét mù toàn sân
        for (let r = 0; r < 12; r++) {
            for (let c = 0; c < 12; c++) {
                if (grid[r][c] === 0) return { r, c };
            }
        }
    }
}

export default new BrainMaster();
