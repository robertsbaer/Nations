// src/components/RelationshipGraph.js
import React, { useRef, useEffect, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import CircularProgress from "@mui/material/CircularProgress";

const RelationshipGraph = ({ relationships, nationMap }) => {
  const fgRef = useRef();
  const [loading, setLoading] = useState(true);

  // State to hold nodes and links
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  // State to hold the dimensions
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 100, // Adjust for header and controls
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100, // Adjust as needed
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        // Restore colors
        nodeAutoColorBy="group" // Adjust if not using 'group'
        linkColor={(link) =>
          relationshipColors[link.__label || link.label] || "gray"
        }
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
        linkDirectionalArrowRelPos={1}
        linkWidth={1.5}
        // Set curvature for self-loops
        linkCurvature={(link) => (link.source === link.target ? 0.5 : 0)}
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
