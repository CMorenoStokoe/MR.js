import * as jsnx from 'jsnetworkx';
import {Node, Edge, JsnxNode, JsnxEdge} from '../@types/index';

export const formatData = (nodes:Node[], edges:Edge[]):jsnx.classes.DiGraph => {
    var G:jsnx.classes.DiGraph = new jsnx.DiGraph();
    const arrayOfNodes:JsnxNode[] = nodes.map(x => [x.id, x])
    const arrayOfEdges:JsnxEdge[] = edges.map(x => [x.source, x.target, x])
        G.addNodesFrom(arrayOfNodes);
        G.addEdgesFrom(arrayOfEdges);
    return G
}
