import React, { useState, useRef } from "react";
import { useAutocomplete } from "./api";
import useTagsStore from "./store";
import {
  Chip,
  TextField,
  Autocomplete,
  Box,
  Container,
  AutocompleteChangeReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "react-query";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const { data: suggestions = [] } = useAutocomplete(input);
  const tags = useTagsStore((state) => state.tags);
  const addTag = useTagsStore((state) => state.addTag);
  const removeTag = useTagsStore((state) => state.removeTag);
  const OPERANDS = ["+", "-", "*", "(", ")", "^", "/"];
  type QueryKey = [string, string]; // [key, input]


  const fetchSuggestions = async () => {
    const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  // This function gets the term after the last operand (or the full string if no operand exists)
  const getLastTerm = (inputString: string) => {
    const terms = inputString.split(/[\+\-\*\(\)\^\/]+/); // split by operands
    return terms[terms.length - 1].trim();
  };

  // Use react-query to fetch suggestions based on the last term
  const { data: fetchedSuggestions = [] } = useQuery(
    ["suggestions", getLastTerm(input)],
    fetchSuggestions,
    {
      enabled: !!input.trim(), // only fetch if input is not empty
    }
  );

  return (
    <Container maxWidth="sm" style={{ marginTop: "100px" }}>
      <Box boxShadow={3} p={3} bgcolor="background.paper">
        <Autocomplete
          multiple
          freeSolo
          options={fetchedSuggestions.map((suggestion: any) => suggestion.name)}
          value={tags.map((tag) => tag.name)}
          onInputChange={(event, newValue) => {
            setInput(newValue);
          }}
          onChange={(
            event: any,
            newValues: string[],
            reason: AutocompleteChangeReason
          ) => {
            // Check if a tag was added
            if (reason === "selectOption") {
              const addedTag = newValues[newValues.length - 1];
              if (addedTag && !tags.find((tag) => tag.name === addedTag)) {
                addTag({ name: addedTag, id: `${Date.now()}-${addedTag}` });
              }
            }

            // Check if a tag was removed
            if (reason === "removeOption") {
              const removedTag = event.target.value;
              if (removedTag) {
                const tagToRemove = tags.find((tag) => tag.name === removedTag);
                if (tagToRemove) {
                  removeTag(tagToRemove.id);
                }
              }
            }
          }}
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Enter tag or operand..."
            />
          )}
        />
      </Box>
    </Container>
  );
};

export default App;
