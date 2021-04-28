"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatData = void 0;
const jsnx = require("jsnetworkx");
const formatData = (nodes, edges) => {
    var G = new jsnx.DiGraph();
    const arrayOfNodes = nodes.map(x => [x.id, x]);
    const arrayOfEdges = edges.map(x => [x.source, x.target, x]);
    G.addNodesFrom(arrayOfNodes);
    G.addEdgesFrom(arrayOfEdges);
    return G;
};
exports.formatData = formatData;
//# sourceMappingURL=format.js.map