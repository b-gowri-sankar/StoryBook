const express = require("express");
const { route } = require(".");

const router = express.Router();

const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

//@desc show add page for story
//@route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
	res.render("stories/add");
});

//@desc process add form
//@route POST /stories

router.post("/add", ensureAuth, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.redirect("/dashboard");
	} catch (err) {
		console.error(err);
		res.render("error/500");
	}
});

module.exports = router;
