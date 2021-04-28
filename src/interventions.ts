import * as jsnx from 'jsnetworkx';
import {Intervention, JsnxNode, Node} from '../@types/index';
import {propagate} from '../src/propagation';
import {calculatePropagationPath} from '../src/traversal';

export const calculateAllInterventionEffects = (G:jsnx.classes.DiGraph, deltas?:Node[]):Intervention[] => {
    const defaultDelta = 1;
    const allNodesInG:Node[] = G.nodes(true);

    const allInterventionEffects = [];

    for(const node of allNodesInG){
        const id = node[0];

        // Use intervention delta provided or default 
        const ds:Node[] = deltas ? deltas.filter(x => x[0] === id) : [];
        const d:number = ds.length===1 ? ds[0][1].value : defaultDelta;

        // Simulate intervention on every node
        const path = calculatePropagationPath(G, id);
        allInterventionEffects.push( 
            propagate(path, id, d)
        );
    }

    return allInterventionEffects
}

const sortBySumOfEffects = (
    is: Intervention[]
):Intervention[] => {
    for(const i of is){
        i.sumOfEffects = Object.values(i.results).reduce((a:number, b:number) => a + b)
    }
    is.sort(function(a,b) {
        return  b.sumOfEffects - a.sumOfEffects
    });
    return is
}

const sortedByEffectOnNode = (
    is: Intervention[],
    targetNode: Node["id"]
):Intervention[] => {
    is.sort(function(a,b) {
        return b.results[targetNode] - a.results[targetNode]
    });
    return is
}

const sortedByBestEffects = (
    is: Intervention[],
    nodes: JsnxNode[]
):Intervention[] => {
    const vm = (node: Node["id"]) => {
        const valence = nodes.filter(x => x[0] === node)[0][1].valence
        switch(valence){
            case 'Bad': return -1
            case 'Neutral': return 0
            default: return 1
        }
    }
    for(const i of is){
        i.sumOfEffects = 0;
        for(const [k, v] of Object.entries(i.results)){
            i.sumOfEffects += v * vm(k);
        }
    }
    is.sort(function(a,b) {
        return  b.sumOfEffects - a.sumOfEffects
    });
    return is
}

export const sortInterventions = (
    is: Intervention[], 
    criteria: {
        sumOfEffects?: true
        effectOnNode?: Node["id"]
        bestEffects?: JsnxNode[]
    }
) => {
    switch(true){
        case criteria.effectOnNode != undefined: return sortedByEffectOnNode(is, criteria.effectOnNode)
        case criteria.bestEffects != undefined: return sortedByBestEffects(is, criteria.bestEffects)
        default: return sortBySumOfEffects(is)
    }
}