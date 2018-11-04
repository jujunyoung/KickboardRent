var express = require('express');
var app = express();
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var userSchema
var userModel
var kickboardSchema
var kickboardModel

app.use(bodyParser.urlencoded({extended:true}))

function connectDB() {
	var databaseUrl = "mongodb://localhost:27017/KickboardRentTestDB"
	mongoose.connect(databaseUrl)

	mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error.'))
	mongoose.connection.on('open', () => {
		userSchema = mongoose.Schema({
			name: String,
			username: String,
			email: String,
			password: String
		});

		kickboardSchema = mongoose.Schema({
			id: String,
			model_name: String,
			serial: String,
			state: String
		});

		userModel = mongoose.model("users", userSchema)
		kickboardModel = mongoose.model("kickboards", kickboardSchema)
		console.log("DB Connected")
	});
	mongoose.connection.on('disconnected', connectDB);
}

app.get('/users', (req, res) => {
	userModel.find({}, (err, result) => {
		if(err) console.error(err)

		res.send(result)
	})
})

app.post('/login', (req, res) => {
	req.on('data', data => {
		var user = JSON.parse(data)
		userModel.find({'email': user.email}, (err, result) => {
			if(err) console.error(err)

			if(result[0] != null) {
				if(user.password == result[0].password) {
					console.log("Matched!")
					res.statusCode = 200
					res.end()
				} else {
					console.log("UnMatched!")
					res.statusCode = 500
					res.send()
				}
		} else {
			console.log("UnMatched!")
			res.statusCode = 500
			res.send()
		}
	})
	})
})

app.post('/join', (req, res) => {
	req.on('data', data => {
		var user = JSON.parse(data)
		var newUser = new userModel(user)
		newUser.save(err => {
			if(err) {
				res.statusCode = 500
				res.send()
			}

			res.statusCode = 200
			res.send()
		})
	})
})

app.listen(5000, 'localhost', () => {
	console.log("Webserver started");
	connectDB()
});
