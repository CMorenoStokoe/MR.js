import * as jsnx from 'jsnetworkx';
import { Edge, EdgeWithWeight, Node, Path } from '../@types/index';

// Run DFS
export const calculatePropagationPath = (G:jsnx.classes.DiGraph, root:Node):Path => {

    // Init search queue
    const queue:Node[] = [root];

    // Path of traversal for propagation
    const path:Path = [];

    // Run search with failsafe to avoid infinite loops (max iterations = n nodes ^ 2)
    for (let i = 0; i < Math.pow(G.nodes().length, 2); i++){ 

        if(queue[0] == undefined){break;}

        // Construct traversal path from successor nodes
        const successors:Node[] = G.successors(queue[0]);
        for(const successor of successors){

            // Get edge beta
            const b:number = G.getEdgeData(queue[0], successor).b;

            // Add edge to search path
            // Add node to search path (if not already queued)
            if (path.filter(item=> item.source == queue[0] && item.target == successor).length == 0){
                path.push({source: queue[0], target: successor, b: b})
            }

            // Add to queue
            queue.push(successor);
        }
        
        // Remove current item from queue
        queue.shift();

    }
    return path
}