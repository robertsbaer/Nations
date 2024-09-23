// src/components/SearchBar.js
import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchQuery, onSearchChange }) => (
  <TextField
    label="Search for one or two nations (separate by comma)"
    variant="outlined"
    fullWidth
    margin="normal"
    value={searchQuery}
    onChange={onSearchChange}
  />
);

export default SearchBar;
