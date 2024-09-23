// src/App.js
import React, { useState } from "react";
import { relationships } from "./data/relationships";
import { nations } from "./data/nations";
import RelationshipGraph from "./components/RelationshipGraph";
import DataDisplay from "./components/DataDisplay"; // Import the new component
import Controls from "./components/Controls"; // If you have a Controls component
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SubmitSuggestion from "./components/SubmitSuggestion";

import { Typography, AppBar, Toolbar, Button } from "@mui/material";

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

    // Split search query into terms, trim whitespace, and remove empty strings
    const searchTerms = searchQuery
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (searchTerms.length === 0) {
      // If no search terms, include all relationships (after filter)
      return matchFilter;
    }

    // Check if all search terms match either nation1Name or nation2Name
    const nationNames = [nation1Name.toLowerCase(), nation2Name.toLowerCase()];

    const matchSearch = searchTerms.every((term) =>
      nationNames.some((nationName) => nationName.includes(term))
    );

    return matchFilter && matchSearch;
  });

  return (
    <Router basename="/Nations">
      <div style={{ width: "100vw", height: "100vh" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Global Nation Relationships
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Graph View
            </Button>
            <Button color="inherit" component={Link} to="/data">
              Data View
            </Button>
            <Button color="inherit" component={Link} to="/submit">
              Submit Suggestion
            </Button>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                <Controls
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  relationshipTypes={relationshipTypes}
                  selectedFilter={selectedFilter}
                  onFilterChange={handleFilterChange}
                />
                <RelationshipGraph
                  relationships={filteredRelationships}
                  nationMap={nationMap}
                />
              </div>
            }
          />
          <Route
            path="/data"
            element={
              <>
                <Controls
                  searchQuery={searchQuery}
                  onSearchChange={handleSearchChange}
                  relationshipTypes={relationshipTypes}
                  selectedFilter={selectedFilter}
                  onFilterChange={handleFilterChange}
                />
                <DataDisplay
                  relationships={filteredRelationships}
                  nationMap={nationMap}
                />
              </>
            }
          />
          <Route
            path="/submit"
            element={<SubmitSuggestion nationMap={nationMap} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
