// src/components/SubmitSuggestion.js
import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
} from "@mui/material";
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

  const relationshipTypes = Array.from(
    new Set(relationships.map((r) => r.relationship))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        rel.relationship === formData.relationship
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
          {nations.map((nation) => (
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
          {nations.map((nation) => (
            <MenuItem key={nation.id} value={nation.id}>
              {nation.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Relationship Type"
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          select
        >
          {relationshipTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        {formData.relationship === "Other" && (
          <TextField
            label="Specify Relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
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
          <Typography color="error" variant="body2">
            {error}
          </Typography>
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
        message="Suggestion submitted successfully!"
      />
    </Box>
  );
};

export default SubmitSuggestion;
