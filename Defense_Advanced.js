const DefenseAdvanced = {
    findSafetyPoint(grid, threats) {
        if (threats.length === 0) return null;
        
        let intersections = this.getIntersections(threats);
        if (intersections.length > 0) return intersections[0];

        let critical = threats.find(t => t.s > 1000000);
        if (critical) return {r: critical.r, c: critical.c};

        return {r: threats[0].r, c: threats[0].c};
    },

    getIntersections(threats) {
        let points = [];
        for (let i=0; i<threats.length; i++) {
            for (let j=i+1; j<threats.length; j++) {
                if (threats[i].r === threats[j].r && threats[i].c === threats[j].c) {
                    points.push(threats[i]);
                }
            }
        }
        return points;
    }
};
export default DefenseAdvanced;
