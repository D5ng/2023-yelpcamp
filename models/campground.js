const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviews");

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // reviews배열에 있는 아이디를 모두 다 삭제
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews, // $in => 배열에 속하는 값 => 여기서는 doc.review에 id를 모두 삭제.
      },
    });
  }
  console.log(doc);
  // console.log("삭제 완료 후 실행");
});

module.exports = mongoose.model("Campground", CampgroundSchema);
