"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateEverything = exports.simulateIntervention = void 0;
const format_1 = require("./format");
const loops_1 = require("./loops");
const traversal_1 = require("./traversal");
const propagation_1 = require("./propagation");
const interventions_1 = require("./interventions");
const simulateIntervention = (nodes, edges, origin, delta) => {
    // Prepare data
    var G = format_1.formatData(nodes, edges);
    loops_1.identifyAndRemoveLoops(G, origin);
    // Simulate intervention
    const path = traversal_1.calculatePropagationPath(G, origin);
    return propagation_1.propagate(path, origin, delta ? delta : 1);
};
exports.simulateIntervention = simulateIntervention;
const simulateEverything = (nodes, edges, deltasInNodeData) => {
    // Prepare data
    var G = format_1.formatData(nodes, edges);
    // Simulate all interventions
    return interventions_1.calculateAllInterventionEffects(G, deltasInNodeData ? nodes : undefined);
};
exports.simulateEverything = simulateEverything;
/*
    const calculateOptimalIntervention = () => {}
    const sortedBySumOfEffects = sortInterventions(allPossibleInterventions, {sumOfEffects: true});
    const sortedByEffectOnNode = sortInterventions(allPossibleInterventions, {effectOnNode: 'D'});
    const sortedByBestEffects = sortInterventions(allPossibleInterventions, {bestEffects: G.nodes(true)});
*/ 
//# sourceMappingURL=index.js.map