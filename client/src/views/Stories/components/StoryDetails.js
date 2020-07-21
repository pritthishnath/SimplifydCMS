import React from "react";
import {
  Box,
  Typography,
  makeStyles,
  Paper,
  IconButton,
} from "@material-ui/core";
import {
  AccountCircle as AccountCircleIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  hr: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `.5px solid ${theme.palette.grey[200]}`,
  },
  title: {
    // fontSize: 60,
  },
  userInfoWrapper: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  icon: {
    fontSize: 45,
    marginRight: 5,
  },
  userInfo: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  content: {
    marginBottom: theme.spacing(3),
    lineHeight: 2,
    "& p": {
      fontSize: 22,
    },
  },
  commentsWrapper: {
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    "& h5": {
      marginBottom: theme.spacing(3),
    },
  },
  commentPaper: {
    // backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1.3),
    marginBottom: theme.spacing(2),
  },
  commentUserInfo: {
    display: "flex",
    alignItems: "center",
  },
  commentText: {
    fontSize: 20,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const StoryDetails = ({ state, setState }) => {
  const classes = useStyles();

  let updateInfo, commentsInfo;

  if (state.type === "publication") {
    updateInfo = (
      <Typography>
        Updated on{" "}
        <i>{new Date(state.updateTimeline?.[0].updatedAt).toDateString()} </i>
        by {state.updateTimeline?.[0].updatedBy.name}
      </Typography>
    );
    commentsInfo = (
      <Box pt={4} className={classes.commentsWrapper}>
        <Typography variant='h5' component='h5'>
          <strong>Comments</strong>
        </Typography>
        {state.comments?.map((comment, i) => {
          return (
            <Paper
              key={comment._id}
              className={classes.commentPaper}
              variant='outlined'>
              <div className={classes.commentUserInfo}>
                <AccountCircleIcon className={classes.icon} />
                <Typography>{comment.createdBy.name}</Typography>
              </div>
              <Typography className={classes.commentText}>
                {comment.text}
              </Typography>
              <IconButton>
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton>
                <ReplyIcon />
              </IconButton>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Paper>
          );
        })}
      </Box>
    );
  }

  return (
    <Box mx={30} my={4}>
      <Typography className={classes.title} variant='h2' gutterBottom>
        {state.title}
      </Typography>
      <div className={classes.userInfoWrapper}>
        <AccountCircleIcon className={classes.icon} />
        <div className={classes.userInfo}>
          <Typography>
            By {state.createdBy.name} on{" "}
            <i>{new Date(state.createdAt).toDateString()}</i>{" "}
            {state.comments ? `| ${state.comments.length} Comments` : ""}
          </Typography>
          {updateInfo}
        </div>
      </div>
      <div
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: state.content }}></div>
      {commentsInfo}
    </Box>
  );
};

export default StoryDetails;
