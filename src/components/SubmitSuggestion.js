// src/components/SubmitSuggestion.js
import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import Fuse from "fuse.js";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/lab/Autocomplete";
import { nations } from "../data/nations";
import { relationships } from "../data/relationships";

const SubmitSuggestion = ({ nationMap }) => {
  const [formData, setFormData] = useState({
    nation1Id: "",
    nation2Id: "",
    relationship: "",
    details: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [warning, setWarning] = useState("");

  // Extract and sort nations alphabetically
  const sortedNations = [...nations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Extract existing relationship types
  const relationshipTypes = Array.from(
    new Set(relationships.map((r) => r.relationship))
  ).sort((a, b) => a.localeCompare(b));

  // Set up Fuse.js for fuzzy searching relationship types
  const fuse = new Fuse(relationshipTypes, {
    includeScore: true,
    threshold: 0.3, // Adjust this value to set sensitivity
  });

  useEffect(() => {
    setWarning("");

    if (formData.relationship.trim() !== "") {
      const results = fuse.search(formData.relationship);

      if (results.length > 0) {
        const similarType = results[0].item;
        if (similarType.toLowerCase() !== formData.relationship.toLowerCase()) {
          setWarning(
            `A similar relationship type "${similarType}" already exists. Please check if it doesn't already exist.`
          );
        }
      }
    }
  }, [formData.relationship]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleAutocompleteChange = (event, value) => {
    setFormData({ ...formData, relationship: value || "" });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the combination already exists
    const exists = relationships.some(
      (rel) =>
        ((rel.nation1Id === formData.nation1Id &&
          rel.nation2Id === formData.nation2Id) ||
          (rel.nation1Id === formData.nation2Id &&
            rel.nation2Id === formData.nation1Id)) &&
        rel.relationship.toLowerCase() === formData.relationship.toLowerCase()
    );

    if (exists) {
      setError(
        "This combination of nations and relationship already exists in the data."
      );
      return;
    }

    // Send email using EmailJS
    emailjs
      .send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        {
          nation1: nationMap[formData.nation1Id],
          nation2: nationMap[formData.nation2Id],
          relationship: formData.relationship,
          details: formData.details,
        },
        "YOUR_USER_ID" // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          console.log(
            "Email successfully sent!",
            response.status,
            response.text
          );
          setSuccess(true);
          setFormData({
            nation1Id: "",
            nation2Id: "",
            relationship: "",
            details: "",
          });
        },
        (err) => {
          console.error("Failed to send email. Error:", err);
          setError("Failed to send the suggestion. Please try again later.");
        }
      );
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Submit a New Relationship Suggestion
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Nation 1"
          name="nation1Id"
          value={formData.nation1Id}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {sortedNations.map((nation) => (
            <MenuItem key={nation.id} value={nation.id}>
              {nation.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Nation 2"
          name="nation2Id"
          value={formData.nation2Id}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        >
          {sortedNations.map((nation) => (
            <MenuItem key={nation.id} value={nation.id}>
              {nation.name}
            </MenuItem>
          ))}
        </TextField>
        <Autocomplete
          freeSolo
          options={relationshipTypes}
          value={formData.relationship}
          onChange={handleAutocompleteChange}
          onInputChange={(event, value) => {
            setFormData({ ...formData, relationship: value });
            setError("");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Relationship Type"
              name="relationship"
              required
              fullWidth
              margin="normal"
            />
          )}
        />
        {warning && (
          <Box mt={1}>
            <Alert severity="warning">{warning}</Alert>
          </Box>
        )}
        <TextField
          label="Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        {error && (
          <Box mt={1}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            !formData.nation1Id ||
            !formData.nation2Id ||
            !formData.relationship ||
            !formData.details
          }
          style={{ marginTop: "16px" }}
        >
          Submit Suggestion
        </Button>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Suggestion submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubmitSuggestion;
