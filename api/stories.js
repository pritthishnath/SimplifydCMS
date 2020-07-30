const express = require("express");

const router = express.Router();

const Draft = require("../models/Draft");
const Publication = require("../models/Publication");

// @route  POST /api/stories/create-draft
// @desc   Create a Draft

router.post("/create-draft", async (req, res) => {
  const draft = {
    title: req.body.title,
    permalink: req.body.permalink,
    content: req.body.content,
    publicationId: req.body.publicationId ? req.body.publicationId : null,
    createdBy: req.session.userId,
    lastUpdatedBy: req.session.userId,
    type: "draft",
  };

  try {
    await Draft.create(draft, (err, story) => {
      res.status(200).json({
        _id: story._id,
        type: story.type,
        saveStatus: "Draft saved",
        msg: "New draft created",
      });
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// @route  PUT /api/stories/:id/edit
// @desc   Update a Draft

router.put("/:id/edit", async (req, res) => {
  const id = req.params.id;
  try {
    await Draft.findByIdAndUpdate(id, {
      $set: {
        title: req.body.title,
        permalink: req.body.permalink,
        content: req.body.content,
        publicationId: req.body.publicationId ? req.body.publicationId : null,
        lastUpdatedBy: req.session.userId,
        type: "draft",
      },
    });
    res.status(200).json({ saveStatus: "Draft saved" });
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// @route  POST /api/stories/publish/:id
// @desc   Publish a Draft AND Update a Publication

router.post("/publish/:id", async (req, res) => {
  // Get token payload
  const currentUserId = req.session.userId;

  // Get the draft to be published
  const draftId = req.params.id;
  try {
    const draft = await Draft.findById(draftId);
    const updatedPublication = {
      group: draft.group,
      title: draft.title,
      permalink: draft.permalink,
      content: draft.content,
      type: "publication",
    };

    // Checking if permalink exists in Publications
    const permalinkExist = await Publication.findOne({
      permalink: draft.permalink,
    });

    // Checking if previously published
    if (draft.publicationId) {
      await Publication.findOneAndUpdate(
        { _id: draft.publicationId },
        { $set: updatedPublication },
        (err, story) => {
          story.updateTimeline.unshift({
            updatedBy: currentUserId,
            updatedAt: Date.now(),
          });
          story.save();
        }
      );
      await Draft.findByIdAndRemove(draft._id);
      return res.status(200).json({ msg: "The publication is updated" });
    } else {
      // Creating new publication
      if (permalinkExist)
        return res.status(403).json({
          msg: "Permalink already exists, please create a unique permalink",
        });
      await Publication.create({
        ...updatedPublication,
        createdBy: currentUserId,
        createdAt: Date.now(),
      });
      await Draft.findByIdAndRemove(draft._id);
      return res.status(200).json({ msg: "Your story is published" });
    }
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// @route  GET /api/stories/get-draft/:id
// @desc   Get a Draft for edit

router.get("/get-draft/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const story = await Draft.findById(id);
    res.status(200).json(story);
  } catch (err) {
    res.status(500).json({
      msg: "Server Error",
    });
  }
});

// @route  GET /api/stories/get-publication/:id
// @desc   Get a Publication for edit

router.get("/get-publication/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const story = await Publication.findOne({ _id: id });
    const updatedStory = {
      ...story._doc,
      publicationId: story._id,
    };
    res.status(200).json(updatedStory);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  GET /api/stories/get-drafts
// @desc   Get All Drafts

router.get("/get-drafts", async (req, res) => {
  try {
    const drafts = await Draft.find()
      .populate("createdBy", ["name"])
      .populate("lastUpdatedBy", ["name"]);
    res.status(200).json(drafts);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  GET /api/stories/get-publications
// @desc   Get All Publications

router.get("/get-publications", async (req, res) => {
  try {
    const publications = await Publication.find()
      .populate("createdBy", "name")
      .populate({
        path: "updateTimeline",
        populate: { path: "updatedBy", select: "name" },
      })
      .populate({
        path: "comments",
        populate: { path: "createdBy", select: "name" },
      });
    res.status(200).json(publications);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  DELETE /api/stories/delete-draft/:id
// @desc   Delete a Draft

router.delete("/delete-draft/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Draft.findByIdAndRemove(id);
    res.status(200).json({ msg: "Draft Removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  DELETE /api/stories/delete-pubication/:id
// @desc   Delete a Publication

router.delete("/delete-publication/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Publication.findByIdAndRemove(id);
    res.status(200).json({ msg: "Publication Removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route  PUT /api/stories/:publicationId/add-comment
// @desc   Add comment to a publication

router.put("/:publicationId/add-comment", async (req, res) => {
  const newComment = {
    text: req.body.text,
    createdBy: req.session.userId,
  };
  try {
    await Publication.findOneAndUpdate(
      { _id: req.params.publicationId },
      { $push: { comments: newComment } }
    );
    res.status(200).json({ msg: "Comment Created" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
