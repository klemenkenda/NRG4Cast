function constructNetwork(clickedId) {
    networkData.nodes.clear();
    networkData.edges.clear();

    for (var i = 0; i < groupsTable.length; i++) {
        if (groupsTable[i].id == clickedId) {
            // add nodes
            for (var j = 0; j < groupsTable[i].states.length; j++) {
                var titleString = "";
                titleStr = getTooltipStr(groupsTable[i].states[j]);	//get content for tooltip

                networkData.nodes.add({
                    id: groupsTable[i].states[j].id, shape: "dot", value:
                        groupsTable[i].states[j].size,
                    label: "" + groupsTable[i].states[j].id, title: (titleStr)
                });
            }

            //add edges
            for (var x = 0; x < groupsTable[i].intensities.length; x++) {
                for (var y = 0; y < groupsTable[i].intensities[x].length; y++) {
                    if (groupsTable[i].intensities[x][y] > 0) {
                        var a = groupsTable[i].states[x].id;
                        var b = groupsTable[i].states[y].id;
                        networkData.edges.add({
                            from: a, to: b, value: groupsTable[i].intensities[x][y],
                            label: "" + groupsTable[i].intensities[x][y].toFixed(2),
                            title: groupsTable[i].intensities[x][y]
                        });
                    }
                }
            }
        }
    }
}	//end of function
