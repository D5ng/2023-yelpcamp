const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Model
const Campground = require("./models/campground");
const Reivew = require("./models/reviews");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema } = require("./schema");

// Mongoose 연결하기.
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://dongs:ehdgus1234@2023-yelp-camp.6h1bw49.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Success"))
  .catch((error) => console.log(error));

const app = express();

// Template을 ejs로 세팅.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("./home.ejs");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);

    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.post(
  "/campgrounds/:id/reviews",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    campground.reviews.push(review);

    await review.save();
    await campground.save();
  })
);

app.all("*", (req, res, next) => next(new ExpressError("Page Not Found", 404)));

app.use((err, req, res, next) => {
  const { message = "Something went wrong!", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => console.log("listening on port 3000"));

/**
 * POST /campgrounds/:id/reviews
 *
 */
