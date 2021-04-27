import { type } from "node:os"
// Nodes
export type Node = string;
export type NodeWithValue = [
    Node,
    {value: number}
];
// Edges
export type Edge = [
    Node,
    Node
];
export type EdgeWithWeight = {
    source: Node, 
    target: Node, 
    b: number
};
// Path
export type Path = EdgeWithWeight[];
// Propagation
export type Step = {
    source: Node,
    deltaX: number,
    target: Node,
    beta: number,
    deltaY: number
};
export type Summary = Record<Node, number>;