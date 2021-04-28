"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loops_1 = require("../src/loops");
const traversal_1 = require("../src/traversal");
const propagation_1 = require("../src/propagation");
const interventions_1 = require("../src/interventions");
const testData_1 = require("./testData");
const format_1 = require("../src/format");
// Get example data to test algorithms
const origin = 'A'; // Starting node (i.e., the one intervened on)
var testData = format_1.formatData(testData_1.exampleNodes, testData_1.exampleEdges); // Test data in ./testData
// Use tests and methods
const tests = {};
tests.duplicateEdgesRemoved = testData.edges(true).length === 18;
const loops = loops_1.identifyAndRemoveLoops(testData, origin);
tests.detectedLoops = loops.length === 8;
tests.removedLoops = testData.edges(true).length === 10;
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
tests.correctAnswer = checkAnswers(propagationResults.results, { A: 1, B: 0.5, C: 0.75, D: 0.375, E: 0.46875, F: 1.125, G: 0.5625 });
const allPossibleInterventions = interventions_1.calculateAllInterventionEffects(testData);
tests.gotAllPossibleInterventions = allPossibleInterventions.length === 7;
const checkInterventions = (a) => {
    for (const i of a) {
        if (typeof i.origin != 'string') {
            return false;
        }
        if (!(Object.keys(i.results).length > 0)) {
            return false;
        }
        if (!(i.steps.length >= 0)) {
            return false;
        }
    }
    return true;
};
tests.interventionsLookSensible = checkInterventions(allPossibleInterventions);
const sortedBySumOfEffects = interventions_1.sortInterventions(allPossibleInterventions, { sumOfEffects: true });
tests.identifiesBestInterventionForOverallSumOfEffects = sortedBySumOfEffects[0].origin === 'A';
const sortedByEffectOnNode = interventions_1.sortInterventions(allPossibleInterventions, { effectOnNode: 'D' });
tests.identifiesBestInterventionForSpecificNode = sortedByEffectOnNode[1].origin === 'C';
const sortedByBestEffects = interventions_1.sortInterventions(allPossibleInterventions, { bestEffects: testData.nodes(true) });
tests.identifiesInterventionWithBestEffects = sortedByBestEffects[0].origin === 'E';
debugger;
//# sourceMappingURL=tests.js.map