"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsnx = require("jsnetworkx");
const loops_1 = require("../src/loops");
const traversal_1 = require("../src/traversal");
const propagation_1 = require("../src/propagation");
/* Example of a complex tree:
    '../test/test-network-illustration.png'
*/
const exampleComplexTree = () => {
    var G = new jsnx.DiGraph();
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    G.addNodesFrom(nodes, { value: 0 }); // Each node starts with a prevalence value of 0
    const edges = [
        // Main branch from origin
        ['A', 'B'], ['B', 'C'],
        // Loops
        // Self-loops
        ['B', 'B'],
        // One-step loops (x-->y-->x)
        ['A', 'C'], ['C', 'A'],
        ['B', 'F'], ['F', 'B'],
        ['C', 'F'], ['F', 'C'],
        ['A', 'F'], ['F', 'A'],
        // n-step loops (x-->n-->y)
        ['C', 'D'], ['D', 'E'], ['E', 'C'],
        ['E', 'F'], ['F', 'G'], ['G', 'E'],
        ['G', 'C'],
        // Duplicate edges
        ['C', 'A'], ['C', 'F'], ['F', 'G']
    ];
    G.addEdgesFrom(edges, { b: 0.5 }); // Each edge is weighted 0.5
    return G;
};
const tests = {
    duplicateEdgesRemoved: false,
    detectedLoops: false,
    removedLoops: false,
    correctNumSteps: false,
    correctAnswer: false
};
// Use and tests methods
const origin = 'A'; // Starting node (i.e., the one intervened on)
var testData = exampleComplexTree();
tests.duplicateEdgesRemoved = testData.edges().length === 18;
const loops = loops_1.identifyAndRemoveLoops(testData, origin);
tests.detectedLoops = loops.length === 8;
tests.removedLoops = testData.edges().length === 10;
const path = traversal_1.calculatePropagationPath(testData, origin);
tests.correctNumSteps = path.length === 10;
const propagationResults = propagation_1.propagate(path, origin, 1);
const checkAnswers = (r, a) => {
    for (const [k, v] of Object.entries(r)) {
        if (!(a[k] === v)) {
            return false;
        }
    }
    ;
    return true;
};
tests.correctAnswer = checkAnswers(propagationResults.summary, { A: 1, B: 0.5, C: 0.75, D: 0.375, E: 0.46875, F: 1.125, G: 0.5625 });
debugger;
//# sourceMappingURL=tests.js.map