const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');


// Mongoose 연결하기.
mongoose.connect('mongodb+srv://dongs:ehdgus1234@2023-yelp-camp.6h1bw49.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log('MongoDB Success'))
	.catch(error => console.log(error));

const app = express();

// Template을 ejs로 세팅.
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
	res.render('./home.ejs');
})

app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({ });

	res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/:id', async (req, res) => {
	const id = req.params.id;
	const campground = await Campground.findById(id);

	res.render('campgrounds/detail', { campground });
})

app.get('/makecampground', async (req, res) => {
	const camp = new Campground({ title: "My Backyard" });
	await camp.save();
	res.send(camp);
})


app.listen(3000, () => console.log('listening on port 3000'));