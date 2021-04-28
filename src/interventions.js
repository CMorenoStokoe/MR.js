"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortInterventions = exports.calculateAllInterventionEffects = void 0;
const propagation_1 = require("../src/propagation");
const traversal_1 = require("../src/traversal");
const calculateAllInterventionEffects = (G, deltas) => {
    const defaultDelta = 1;
    const allNodesInG = G.nodes(true);
    const allInterventionEffects = [];
    for (const node of allNodesInG) {
        const id = node[0];
        // Use intervention delta provided or default 
        const ds = deltas ? deltas.filter(x => x[0] === id) : [];
        const d = ds.length === 1 ? ds[0][1].value : defaultDelta;
        // Simulate intervention on every node
        const path = traversal_1.calculatePropagationPath(G, id);
        allInterventionEffects.push(propagation_1.propagate(path, id, d));
    }
    return allInterventionEffects;
};
exports.calculateAllInterventionEffects = calculateAllInterventionEffects;
const sortBySumOfEffects = (is) => {
    for (const i of is) {
        i.sumOfEffects = Object.values(i.results).reduce((a, b) => a + b);
    }
    is.sort(function (a, b) {
        return b.sumOfEffects - a.sumOfEffects;
    });
    return is;
};
const sortedByEffectOnNode = (is, targetNode) => {
    is.sort(function (a, b) {
        return b.results[targetNode] - a.results[targetNode];
    });
    return is;
};
const sortedByBestEffects = (is, nodes) => {
    const vm = (node) => {
        const valence = nodes.filter(x => x[0] === node)[0][1].valence;
        switch (valence) {
            case 'Bad': return -1;
            case 'Neutral': return 0;
            default: return 1;
        }
    };
    for (const i of is) {
        i.sumOfEffects = 0;
        for (const [k, v] of Object.entries(i.results)) {
            i.sumOfEffects += v * vm(k);
        }
    }
    is.sort(function (a, b) {
        return b.sumOfEffects - a.sumOfEffects;
    });
    return is;
};
const sortInterventions = (is, criteria) => {
    switch (true) {
        case criteria.effectOnNode != undefined: return sortedByEffectOnNode(is, criteria.effectOnNode);
        case criteria.bestEffects != undefined: return sortedByBestEffects(is, criteria.bestEffects);
        default: return sortBySumOfEffects(is);
    }
};
exports.sortInterventions = sortInterventions;
//# sourceMappingURL=interventions.js.map