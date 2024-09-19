// src/App.js
import React, { useState } from "react";
import { relationships } from "./data/relationships";
import { nations } from "./data/nations";
import RelationshipGraph from "./components/RelationshipGraph";
import Filter from "./components/Filter";
import SearchBar from "./components/SearchBar";
import { Container, Typography, Box } from "@mui/material";

function App() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Create a nationMap to map nation IDs to nation names
  const nationMap = Object.fromEntries(nations.map((n) => [n.id, n.name]));

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Extract relationship types
  const relationshipTypes = Array.from(
    new Set(relationships.map((r) => r.relationship))
  );

  // Filter relationships based on search query and selected filter
  const filteredRelationships = relationships.filter((r) => {
    const nation1Name = nationMap[r.nation1Id] || "";
    const nation2Name = nationMap[r.nation2Id] || "";

    const matchFilter = selectedFilter
      ? r.relationship === selectedFilter
      : true;
    const matchSearch =
      nation1Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nation2Name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Box textAlign="center" my={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Global Nation Relationships
        </Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <Filter
          options={relationshipTypes}
          selectedOption={selectedFilter}
          onChange={handleFilterChange}
        />
      </Box>
      <RelationshipGraph
        relationships={filteredRelationships}
        nationMap={nationMap}
      />
    </div>
  );
}

export default App;
