import React from "react";
import { connect } from "react-redux";
import { Fab, makeStyles } from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

import {
  TableWithTabs,
  FullScreenDialog,
  Dialog,
  Table,
} from "../../components";
import StoryForm from "./components/StoryForm";
import StoryDetails from "../StoryDetails/StoryDetails";
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

  //States and handlers related to StoryForm *****
  const [activeStory, setActiveStory] = React.useState(initialState);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toBeCreated, setToBeCreated] = React.useState(true);
  const [saveStatus, setSaveStatus] = React.useState("");

  React.useEffect(() => {
    if (!dialogOpen) {
      if (localStorage.id) {
        localStorage.removeItem("id");
        localStorage.removeItem("type");
      }
    }
  }, [dialogOpen]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setActiveStory(initialState);
    setToBeCreated(true);
    setSaveStatus("");
    if (localStorage.id) {
      localStorage.removeItem("id");
      localStorage.removeItem("type");
      loadStories();
    }
  };

  const newHandler = () => {
    setActiveStory(initialState);
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
      setActiveStory(data);
      setToBeCreated(false);
    } else {
      setActiveStory({ ...data, publicationId: data._id });
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
      // Create Story on first typing stop
      updateTimer = setTimeout(() => {
        Story.create(activeStory, changes).then((res) => {
          setActiveStory((prevData) => {
            return {
              ...prevData,
              _id: res.data._id,
              type: res.data.type,
            };
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
      // Update story if typing stop
      updateTimer = setTimeout(() => {
        Story.update(activeStory, changes).then((res) => {
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
      prop === "title"
        ? toKebabCase(event.target.value)
        : activeStory.permalink;
    setActiveStory({
      ...activeStory,
      [prop]: event.target.value,
      permalink: permalink,
    });
    if (dialogOpen) {
      updateDocument({
        [prop]: event.target.value,
        permalink: permalink,
      });
    }
  };

  const handleEditorChange = (content) => {
    setActiveStory({ ...activeStory, content: content });
    if (dialogOpen) {
      updateDocument({ content: content });
    }
  };

  // States and handlers related to table *****
  const [updateHistOpen, setUpdateHistOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handleUpdateHistOpen = () => {
    setUpdateHistOpen(true);
  };

  const handleUpdateHistClose = () => {
    setUpdateHistOpen(false);
  };

  const detailsPageOpen = (permalink) => (e) => {
    const origin = window.location.origin;
    window.open(`${origin}/admin/story/${permalink}`, "Story");
  };

  const handleDetailsOpen = () => (e) => {
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  // Child props & options declarations ***
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
      label: "Created At",
      cell: (data) => {
        return new Date(data.createdAt).toLocaleString();
      },
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
      label: "Created At",
      cell: (data) => {
        return new Date(data.createdAt).toLocaleString();
      },
    },
    {
      label: "Last Updated By",
      cell: (data) => {
        return data.updateTimeline.length > 0
          ? data.updateTimeline[0].updatedBy.name
          : "(not updated)";
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

  const menuOptions = {
    buttons: [
      {
        label: activeStory.publicationId ? "Push Update" : "Publish",
        onClick: publishHandler(activeStory._id),
        hidden: activeStory.type === "publication" ? true : false,
      },
      {
        label: "Edit",
        onClick: editHandler(activeStory),
      },
      {
        label: "Delete",
        onClick: deleteHandler(activeStory.type, activeStory._id),
      },
      {
        label: "Update History",
        onClick: handleUpdateHistOpen,
        hidden:
          activeStory.type === "draft" || activeStory.updateTimeline?.length < 1
            ? true
            : false,
      },
      {
        label: "Preview",
        onClick:
          activeStory.type === "publication"
            ? detailsPageOpen(activeStory.permalink)
            : handleDetailsOpen(),
      },
    ],
    setState: setActiveStory,
  };

  const storyFormActions = [
    {
      label: "New",
      onClick: newHandler,
      disabled: activeStory._id ? false : true,
    },
    {
      label: "Publish",
      onClick: publishHandler(activeStory._id),
      disabled:
        activeStory._id && activeStory.type !== "publication" ? false : true,
    },
  ];

  const updateHistColumns = [
    {
      label: "Updated By",
      selector: "updatedBy.name",
    },
    {
      label: "Updated At",
      cell: (data) => {
        return new Date(data.updatedAt).toLocaleString();
      },
      align: "right",
    },
  ];

  return (
    <div className={classes.root}>
      <TableWithTabs
        tabPanelsData={tabPanelsData}
        loadingState={isLoading}
        menuOptions={menuOptions}
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
        actions={storyFormActions}>
        <StoryForm
          formData={activeStory}
          handlers={{ handleChange, handleEditorChange }}
          saveStatus={saveStatus}
        />
      </FullScreenDialog>
      <Dialog
        open={updateHistOpen}
        onClose={handleUpdateHistClose}
        title='Update History'>
        <Table columns={updateHistColumns} rows={activeStory?.updateTimeline} />
      </Dialog>
      <FullScreenDialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        title='Details'>
        <StoryDetails story={activeStory} />
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
