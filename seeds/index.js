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
		const price = Math.floor(Math.random() * 20) + 10;
		const camp =  new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: 'https://source.unsplash.com/random/700x400?camp',
			description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex velit minus, nisi earum beatae quidem minima voluptatum excepturi corporis. Odio nostrum culpa suscipit est sunt veniam, at voluptatum possimus architecto.',
			price,
		})

		await camp.save();
	}

}

seedDB().then(() => {
	mongoose.connection.close();
	console.log('mongoose Connection Close');
});