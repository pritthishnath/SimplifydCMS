import React from "react";
import { connect } from "react-redux";
import { Fab, makeStyles } from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

import { TableWithTabs, FullScreenDialog } from "../../components";
import StoryForm from "./components/StoryForm";
import { loadStories, setAlert } from "../../store/actions";
import { Story } from "../../shared/api-requests";
import { toKebabCase } from "../../shared/utility";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  fab: {
    margin: theme.spacing(1),
    position: "fixed",
    left: theme.spacing(33),
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

let updateTimer = null;
let statusTimer = null;
const UPDATE_INTERVAL = 1000;
const STATUS_INTERVAL = 500;

const initialState = {
  _id: "",
  title: "",
  permalink: "",
  content: "",
};

const Stories = ({
  drafts,
  publications,
  isLoading,
  loadStories,
  setAlert,
}) => {
  const classes = useStyles();

  const [formValues, setFormValues] = React.useState(initialState);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toBeCreated, setToBeCreated] = React.useState(true);
  const [saveStatus, setSaveStatus] = React.useState("");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormValues(initialState);
    setToBeCreated(true);
    setSaveStatus("");
    if (localStorage.id) {
      localStorage.removeItem("id");
      localStorage.removeItem("type");
      loadStories();
    }
  };

  const newHandler = () => {
    setFormValues(initialState);
    if (!dialogOpen) setDialogOpen(true);
    setToBeCreated(true);
    setSaveStatus("");
    if (localStorage.id) {
      localStorage.removeItem("id");
      localStorage.removeItem("type");
      loadStories();
    }
  };

  const publishHandler = (id) => (e) => {
    Story.publish(id)
      .then((res) => {
        setAlert(res.data.msg, "success");
        loadStories();
      })
      .then(() => (dialogOpen ? handleDialogClose() : null))
      .catch((err) => setAlert(err.response.data.msg, "error"));
  };

  const editHandler = (data) => (e) => {
    if (data.type === "draft") {
      setFormValues(data);
      setToBeCreated(false);
    } else {
      setFormValues({ ...data, publicationId: data._id });
    }
    localStorage.setItem("id", data._id);
    localStorage.setItem("type", data.type);
    handleDialogOpen();
  };

  const deleteHandler = (type, id) => (e) => {
    Story.delete(type, id).then((res) => {
      setAlert(res.data.msg, "info");
      loadStories();
    });
  };

  const updateDocument = (changes) => {
    setSaveStatus("");
    clearTimeout(updateTimer);
    clearTimeout(statusTimer);
    if (toBeCreated) {
      updateTimer = setTimeout(() => {
        Story.create(formValues, changes).then((res) => {
          setFormValues((prevData) => {
            return { ...prevData, _id: res.data._id, type: res.data.type };
          });
          localStorage.setItem("id", res.data._id);
          localStorage.setItem("type", res.data.type);
          setSaveStatus(res.data.saveStatus);
          setToBeCreated(false);
        });
      }, UPDATE_INTERVAL);
      statusTimer = setTimeout(() => {
        setSaveStatus("Draft saving...");
      }, STATUS_INTERVAL);
    } else {
      updateTimer = setTimeout(() => {
        Story.update(formValues, changes).then((res) => {
          setSaveStatus(res.data.saveStatus);
        });
      }, UPDATE_INTERVAL);
      statusTimer = setTimeout(() => {
        setSaveStatus("Draft saving...");
      }, STATUS_INTERVAL);
    }
  };

  const handleChange = (prop) => (event) => {
    let permalink =
      prop === "title" ? toKebabCase(event.target.value) : formValues.permalink;
    setFormValues({
      ...formValues,
      [prop]: event.target.value,
      permalink: permalink,
    });
    if (dialogOpen) {
      updateDocument({ [prop]: event.target.value, permalink: permalink });
    }
  };

  const handleEditorChange = (content) => {
    setFormValues({ ...formValues, content: content });
    if (dialogOpen) {
      updateDocument({ content: content });
    }
  };

  const draftColumns = [
    {
      label: "Title",
      selector: "title",
    },
    {
      label: "Created By",
      selector: "createdBy.name",
    },
    {
      label: "Last Modified By",
      selector: "lastUpdatedBy.name",
    },
  ];

  const publicationColumns = [
    {
      label: "Title",
      selector: "title",
    },
    {
      label: "Created By",
      selector: "createdBy.name",
    },
    {
      label: "Last Updated By",
      cell: (data) => {
        return data.updateTimeline.length > 0
          ? data.updateTimeline[0].updatedBy.name
          : "(not updated yet)";
      },
    },
  ];

  const tabPanelsData = [
    {
      tabLabel: "Drafts",
      rowData: drafts,
      columnData: draftColumns,
    },
    {
      tabLabel: "Published",
      rowData: publications,
      columnData: publicationColumns,
    },
  ];

  const menuProps = {
    buttons: [
      {
        label: formValues.publicationId ? "Push Update" : "Publish",
        onClick: publishHandler(formValues._id),
        hidden: formValues.type === "publication" ? true : false,
      },
      {
        label: "Edit",
        onClick: editHandler(formValues),
      },
      {
        label: "Delete",
        onClick: deleteHandler(formValues.type, formValues._id),
      },
    ],
    setState: setFormValues,
  };

  const modalActions = [
    {
      label: "New",
      onClick: newHandler,
      disabled: formValues._id ? false : true,
    },
    {
      label: "Publish",
      onClick: publishHandler(formValues._id),
      disabled:
        formValues._id && formValues.type !== "publication" ? false : true,
    },
  ];

  return (
    <div className={classes.root}>
      <TableWithTabs
        tabPanelsData={tabPanelsData}
        loadingState={isLoading}
        menuProps={menuProps}
      />
      <Fab
        variant='extended'
        color='primary'
        className={classes.fab}
        onClick={newHandler}>
        <AddCircleIcon className={classes.extendedIcon} />
        New Story
      </Fab>
      <FullScreenDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title='New Story'
        actions={modalActions}>
        <StoryForm
          formData={formValues}
          handlers={{ handleChange, handleEditorChange }}
          saveStatus={saveStatus}
        />
      </FullScreenDialog>
    </div>
  );
};

const mapState = (state) => ({
  drafts: state.stories.drafts,
  publications: state.stories.publications,
  isLoading: state.stories.isLoading,
});

export default connect(mapState, {
  loadStories,
  setAlert,
})(Stories);
