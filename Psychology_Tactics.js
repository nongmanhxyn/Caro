const PsychologyTactics = {
    obfuscate(move) {
        // Trap "Giả ngu": Nếu có 2 ô cùng điểm, chọn ô xa trung tâm hơn
        // Dụ đối thủ chủ quan không chặn hướng chính
        console.log("PSYCHO: Đang thực hiện bẫy tâm lý tại " + move.r + "," + move.c);
        return move;
    },
    
    speedPlay() {
        // Logic phản ứng nhanh dưới 0.5s để gây áp lực
    }
};
export default PsychologyTactics;
