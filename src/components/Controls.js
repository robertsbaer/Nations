// src/components/Controls.js
import React from "react";
import { Box } from "@mui/material";
import SearchBar from "./SearchBar";
import Filter from "./Filter";

const Controls = ({
  searchQuery,
  onSearchChange,
  relationshipTypes,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mb={2}
      mt={2}
    >
      <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <Filter
        options={relationshipTypes}
        selectedOption={selectedFilter}
        onChange={onFilterChange}
      />
    </Box>
  );
};

export default Controls;
