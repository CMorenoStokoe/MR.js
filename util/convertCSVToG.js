// Export data as network graph (jsnx G)
toG(){

    const G = new jsnx.DiGraph(); // Init G object

    for(const [key, value] of Object.entries(this.nodes)){

        // Add nodes to graph
        G.addNode(key, value);
        
        // Add edges to graph
        for(const edge of value.edges){
            G.addEdge(edge['id.exposure'], edge['id.outcome'], edge);
        }
    }

    return(G) // Return G with all nodes and edges
}