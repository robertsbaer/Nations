// src/components/RelationshipList.js
import React from "react";
import { List, ListItem, ListItemText, Typography, Paper } from "@mui/material";

const RelationshipList = ({ relationships, nationMap }) => (
  <Paper elevation={3} style={{ padding: "16px", marginTop: "16px" }}>
    <Typography variant="h5" gutterBottom>
      Nation Relationships
    </Typography>
    <List>
      {relationships.map((relation, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemText
            primary={
              relation.nation1Id === relation.nation2Id
                ? `${nationMap[relation.nation1Id]}: ${relation.relationship}`
                : `${nationMap[relation.nation1Id]} - ${
                    nationMap[relation.nation2Id]
                  }: ${relation.relationship}`
            }
            secondary={relation.details}
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default RelationshipList;
