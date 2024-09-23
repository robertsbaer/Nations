// src/components/DataDisplay.js
import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const DataDisplay = ({ relationships, nationMap }) => {
  if (relationships.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          No data available for the selected criteria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Relationships Data
      </Typography>
      <List>
        {relationships.map((rel) => {
          const nation1Name = nationMap[rel.nation1Id];
          const nation2Name = nationMap[rel.nation2Id];
          return (
            <ListItem key={rel.id} alignItems="flex-start">
              <ListItemText
                primary={`${rel.relationship}: ${nation1Name} - ${nation2Name}`}
                secondary={rel.details}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default DataDisplay;
