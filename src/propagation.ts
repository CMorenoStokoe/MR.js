import { Node, NodeWithValue, Path, Step, Summary } from '../@types/index';

export const propagate = (path:Path, origin:Node, valueChange:number):{
    individualSteps: Step[],
    summary: Summary
} => {
    const individualSteps:Step[] = [];
    const summary = {};
    summary[origin] = valueChange; // Effect of intervention on origin

    for(const edge of path){

        // Two-step MR
        const beta = edge.b;
        const deltaX = summary[edge.source];
        const deltaY = deltaX * beta;

        // Save individual step to history
        individualSteps.push({
            source: edge.source,
            deltaX: deltaX,
            target: edge.target,
            beta: beta,
            deltaY: deltaY
        })

        // Update total changes
        if(summary[edge.target]){
            summary[edge.target]+=deltaY
        }else{
            summary[edge.target]=deltaY
        }
    }

    return ({
        individualSteps: individualSteps,
        summary: summary
    })
};