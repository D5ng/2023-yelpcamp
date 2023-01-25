const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// Mongoose 연결하기.
mongoose.connect('mongodb+srv://dongs:ehdgus1234@2023-yelp-camp.6h1bw49.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log('MongoDB Success'))
	.catch(error => console.log(error));


const sample = (array) => array[Math.floor(Math.random() * array.length )]

const seedDB = async () => {
	await Campground.deleteMany({});
	
	for(let i = 0; i < 50; i++){
		const random1000 = Math.floor(Math.random() * 1000);
		const camp =  new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`
		})

		await camp.save();
	}

}

seedDB().then(() => {
	mongoose.connection.close();
	console.log('mongoose Connection Close');
});