// src/components/RelationshipGraph.js
import React, { useRef, useEffect, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import CircularProgress from "@mui/material/CircularProgress";

const RelationshipGraph = ({ relationships, nationMap }) => {
  const fgRef = useRef();
  const [loading, setLoading] = useState(true);

  // State to hold nodes and links
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // Prepare the graph data
  useEffect(() => {
    setLoading(true);

    // Simulate data loading (replace with actual data fetching if necessary)
    setTimeout(() => {
      const nodes = [];
      const links = [];
      const addedNodes = new Set();

      relationships.forEach((relation) => {
        const {
          id,
          nation1Id,
          nation2Id,
          relationship: relType,
          details,
        } = relation;

        // Add nation1 node if not already added
        if (!addedNodes.has(nation1Id)) {
          nodes.push({ id: nation1Id });
          addedNodes.add(nation1Id);
        }

        // Add nation2 node if not already added
        if (!addedNodes.has(nation2Id)) {
          nodes.push({ id: nation2Id });
          addedNodes.add(nation2Id);
        }

        // Add link with '__' prefix for custom properties
        links.push({
          id, // Unique identifier
          source: nation1Id,
          target: nation2Id,
          __label: relType,
          __details: details,
        });
      });

      setGraphData({ nodes, links });
      setLoading(false);
    }, 500); // Adjust delay as needed
  }, [relationships]);

  // Center the graph when data changes
  useEffect(() => {
    if (
      fgRef.current &&
      graphData.nodes.length > 0 &&
      graphData.links.length > 0
    ) {
      // Wait for the graph to stabilize
      setTimeout(() => {
        if (fgRef.current) {
          fgRef.current.zoomToFit(400, 50);
        }
      }, 500);
    }
  }, [fgRef, graphData]);

  // Define colors for different relationship types
  const relationshipColors = {
    Allies: "green",
    "Strategic Partners": "blue",
    "Trade Partners": "cyan",
    Neutral: "gray",
    "Tense Relations": "orange",
    Adversaries: "red",
    "At War": "darkred",
    "Diplomatic Relations": "purple",
    Sanctioned: "brown",
    "Cultural Exchanges": "pink",
    "Historical Ties": "goldenrod",
    "Non-Recognition": "black",
    "Internal Conflict": "darkorange",
    "Civil War": "maroon",
    "Humanitarian Crisis": "purple",
    "Political Polarization": "yellow",
    // Add other relationship types and colors as needed
  };

  // Function to check if a nation has an internal conflict
  const hasInternalConflict = (nationId) => {
    return relationships.some(
      (relation) =>
        relation.nation1Id === nationId &&
        relation.nation2Id === nationId &&
        relation.relationship === "Internal Conflict"
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <p>Loading data...</p>
      </div>
    );
  }

  // Handle case when graphData is empty
  if (graphData.nodes.length === 0 || graphData.links.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>No data available for the selected criteria.</p>
      </div>
    );
  }

  // Adjust the link curvature for self-loops and multiple links
  const getLinkCurvature = (link) => {
    if (link.source === link.target) {
      // Self-loop
      return 0.5; // Adjust curvature for self-loops
    }

    const sameLinks = graphData.links.filter(
      (l) =>
        (l.source === link.source && l.target === link.target) ||
        (l.source === link.target && l.target === link.source)
    );

    if (sameLinks.length === 1) {
      return 0; // No curvature needed
    } else {
      const index = sameLinks.findIndex((l) => l.id === link.id);
      const direction = link.source < link.target ? 1 : -1;
      const curvature =
        ((index - (sameLinks.length - 1) / 2) / (sameLinks.length / 2)) *
        0.5 *
        direction;
      return curvature;
    }
  };

  // Adjust the arrow positioning for self-loops
  const getLinkDirectionalArrowRelPos = (link) => {
    if (link.source === link.target) {
      return 1; // Position arrow at the end of the self-loop
    }
    return 0.5; // Default position for other links
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={window.innerWidth}
        height={window.innerHeight - 90} // Adjust for header and controls
        nodeAutoColorBy="id" // Color nodes based on their ID
        linkColor={(link) => relationshipColors[link.__label] || "gray"}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = nationMap[node.id];
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Draw node (circle)
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5 / globalScale, 0, 2 * Math.PI, false);

          // Set node color
          ctx.fillStyle = hasInternalConflict(node.id)
            ? "darkorange"
            : node.color || "gray";
          ctx.fill();

          // Draw label
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x, node.y - 10 / globalScale);
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={getLinkDirectionalArrowRelPos}
        linkWidth={1.5}
        linkCurvature={getLinkCurvature}
        nodeLabel={(node) => nationMap[node.id]}
        linkLabel={(link) => {
          const sourceId =
            typeof link.source === "object" ? link.source.id : link.source;
          const targetId =
            typeof link.target === "object" ? link.target.id : link.target;
          const sourceName = nationMap[sourceId];
          const targetName = nationMap[targetId];
          const label = link.__label || link.label;
          const details = link.__details || link.details;

          return `${label}: ${sourceName} - ${targetName}\n${details}`;
        }}
      />
    </div>
  );
};

export default RelationshipGraph;
