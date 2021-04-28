import * as jsnx from 'jsnetworkx';
import {Node, Edge} from '../@types/index';
import {formatData} from './format';
import {identifyAndRemoveLoops} from './loops'
import {calculatePropagationPath} from './traversal';
import {propagate} from './propagation';
import {calculateAllInterventionEffects, sortInterventions} from './interventions';

export const simulateIntervention = (nodes:Node[], edges:Edge[], origin:Node["id"], delta?:number) => {
    // Prepare data
    var G:jsnx.classes.DiGraph = formatData(nodes, edges);
    identifyAndRemoveLoops(G, origin);
    // Simulate intervention
    const path = calculatePropagationPath(G, origin);
    return propagate(path, origin, delta ? delta : 1);
}

export const simulateEverything = (nodes:Node[], edges:Edge[], deltasInNodeData?:boolean) => {
    // Prepare data
    var G:jsnx.classes.DiGraph = formatData(nodes, edges);
    // Simulate all interventions
    return calculateAllInterventionEffects(G, deltasInNodeData ? nodes : undefined );
}

/*
    const calculateOptimalIntervention = () => {}
    const sortedBySumOfEffects = sortInterventions(allPossibleInterventions, {sumOfEffects: true});
    const sortedByEffectOnNode = sortInterventions(allPossibleInterventions, {effectOnNode: 'D'});
    const sortedByBestEffects = sortInterventions(allPossibleInterventions, {bestEffects: G.nodes(true)});
*/