import * as jsnx from 'jsnetworkx';
import {identifyAndRemoveLoops} from '../src/loops'
import {Node, Edge, Summary} from '../@types/index';
import {calculatePropagationPath} from '../src/traversal';
import {propagate} from '../src/propagation';

/* Example of a complex tree:
    '../test/test-network-illustration.png'
*/

const exampleComplexTree = ():jsnx.classes.DiGraph => {
    var G:jsnx.classes.DiGraph = new jsnx.DiGraph();
    const nodes:Node[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    G.addNodesFrom(nodes, {value: 0}) // Each node starts with a prevalence value of 0
    const edges:Edge[] = [
        // Main branch from origin
        ['A','B'], ['B','C'], // Direct and indirect route from A-->C

        // Loops
            // Self-loops
            ['B','B'],

            // One-step loops (x-->y-->x)
            ['A','C'], ['C','A'], // Backward edge (loop, A<-->A)
            ['B','F'], ['F','B'],
            ['C','F'], ['F','C'],
            ['A','F'], ['F','A'],

            // n-step loops (x-->n-->y)
            ['C','D'], ['D','E'], ['E','C'],
            ['E','F'], ['F','G'], ['G','E'],
            ['G','C'], // (C<-->C)
            
        // Duplicate edges
        ['C','A'], ['C','F'], ['F','G'] 
    ]
    G.addEdgesFrom(edges, {b: 0.5}) // Each edge is weighted 0.5

    return G
};

const tests:Record<string, boolean> = {
    duplicateEdgesRemoved: false,
    detectedLoops: false,
    removedLoops: false,
    correctNumSteps: false,
    correctAnswer: false
};

// Use and tests methods
const origin:string = 'A'; // Starting node (i.e., the one intervened on)
var testData = exampleComplexTree(); 
tests.duplicateEdgesRemoved = testData.edges().length === 18;

const loops = identifyAndRemoveLoops(testData, origin);
tests.detectedLoops = loops.length === 8;
tests.removedLoops = testData.edges().length === 10;

const path = calculatePropagationPath(testData, origin);
tests.correctNumSteps = path.length === 10;

const propagationResults = propagate(path, origin, 1);
const checkAnswers = (r: Summary, a: Summary):boolean => {
    for(const [k, v] of Object.entries(r)){
        if(! (a[k] === v) ){
            return false
        }
    }; return true
} 
tests.correctAnswer = checkAnswers(propagationResults.summary, {A:1,B:0.5,C:0.75,D:0.375,E:0.46875,F:1.125,G:0.5625});

debugger;