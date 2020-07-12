import React from "react";
import {
  Box,
  Input,
  FormControl,
  FormHelperText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Editor from "./Editor";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  saveStatus: {
    color: theme.palette.grey[600],
  },
}));

const EditorForm = ({ formData, handlers, saveStatus }) => {
  const classes = useStyles();

  const { title, permalink, content } = formData;
  const { handleEditorChange, handleChange } = handlers;

  return (
    <Box px={20}>
      <FormControl className={classes.textField} fullWidth>
        <Input
          value={title}
          onChange={handleChange("title")}
          placeholder="Enter your story's title..."
          fullWidth
        />
        <FormHelperText variant='filled'>
          Your permalink: {permalink}
        </FormHelperText>
      </FormControl>
      <Editor onEditorChange={handleEditorChange} content={content} />
      <Box p={1} className={classes.saveStatus}>
        <Typography>{saveStatus}</Typography>
      </Box>
    </Box>
  );
};

export default EditorForm;
