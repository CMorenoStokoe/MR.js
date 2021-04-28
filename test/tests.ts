import * as jsnx from 'jsnetworkx';
import {identifyAndRemoveLoops} from '../src/loops'
import {Intervention, JsnxEdge, JsnxNode} from '../@types/index';
import {calculatePropagationPath} from '../src/traversal';
import {propagate} from '../src/propagation';
import {calculateAllInterventionEffects, sortInterventions} from '../src/interventions';
import {exampleNodes, exampleEdges} from './testData';
import {formatData} from '../src/format';
import {simulateIntervention, simulateEverything} from '../src/index';

// Get example data to test algorithms
const origin:string = 'A'; // Starting node (i.e., the one intervened on)
var testData:jsnx.classes.DiGraph = formatData(exampleNodes, exampleEdges);  // Test data in ./testData

// Use tests and methods
const tests:Record<string, boolean> = {};
tests.duplicateEdgesRemoved = testData.edges(true).length === 18;

const loops = identifyAndRemoveLoops(testData, origin);
tests.detectedLoops = loops.length === 8;
tests.removedLoops = testData.edges(true).length === 10;

const path = calculatePropagationPath(testData, origin);
tests.correctNumSteps = path.length === 10;

// Calculate intervention
const propagationResults = propagate(path, origin, 1);
const checkAnswers = (r:Intervention["results"], a:Intervention["results"]):boolean => {
    for(const [k, v] of Object.entries(r)){
        if(! (a[k] === v) ){
            return false
        }
    }; return true
} 
tests.correctAnswer = checkAnswers(propagationResults.results, {A:1,B:0.5,C:0.75,D:0.375,E:0.46875,F:1.125,G:0.5625});

// All possible interventions
const allPossibleInterventions = calculateAllInterventionEffects(testData);
tests.gotAllPossibleInterventions = allPossibleInterventions.length === 7;
const checkInterventions = (a:Intervention[]) => {
    for(const i of a){
        if (typeof i.origin != 'string'){return false}
        if (! (Object.keys(i.results).length > 0) ){return false}
        if (! (i.steps.length >= 0) ){return false}
    }
    return true
}
tests.interventionsLookSensible = checkInterventions(allPossibleInterventions);

// Sorting by effectiveness
const sortedBySumOfEffects = sortInterventions(allPossibleInterventions.slice(), {sumOfEffects: true});
tests.identifiesBestInterventionForOverallSumOfEffects = sortedBySumOfEffects[0].origin === 'A';
const sortedByEffectOnNode = sortInterventions(allPossibleInterventions.slice(), {effectOnNode: 'D'});
tests.identifiesBestInterventionForSpecificNode = sortedByEffectOnNode[1].origin === 'C';
const sortedByBestEffects = sortInterventions(allPossibleInterventions.slice(), {bestEffects: testData.nodes(true)});
tests.identifiesInterventionWithBestEffects = sortedByBestEffects[0].origin === 'E';

// Easy functions
const easyFunc1 = simulateIntervention(exampleNodes, exampleEdges, 'A', 1);
const easyFunc2 = simulateEverything(exampleNodes, exampleEdges, true);
tests.easyFunction1Worked = 
    easyFunc1.origin == propagationResults.origin
    && easyFunc1.results.E == propagationResults.results.E
    && easyFunc1.steps.length == propagationResults.steps.length;
tests.easyFunction2Worked = 
    easyFunc2.length == allPossibleInterventions.length &&
    easyFunc2[5].origin == allPossibleInterventions[5].origin &&
    easyFunc2[5].steps.length == allPossibleInterventions[5].steps.length &&
    easyFunc2[5].results.G == allPossibleInterventions[5].results.G;

debugger;