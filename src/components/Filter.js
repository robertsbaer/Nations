// src/components/Filter.js
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const Filter = ({ options, selectedOption, onChange }) => (
  <FormControl variant="outlined" fullWidth margin="normal">
    <InputLabel>Filter by Relationship</InputLabel>
    <Select
      value={selectedOption}
      onChange={onChange}
      label="Filter by Relationship"
    >
      <MenuItem value="">
        <em>All</em>
      </MenuItem>
      {options.map((option, index) => (
        <MenuItem key={index} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Filter;
