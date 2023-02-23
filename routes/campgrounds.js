const { Router } = require("express");
const router = Router();

// Models
const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { isLoggedIn } = require("../middleware");

const { campgroundSchema } = require("../schema");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  // isLoggedIn,
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  return res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();

    // flash를 먼저 만들어준다.
    req.flash("success", "새로운 캠프를 만드는데 성공하였습니다.");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate("reviews");

    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);

    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
