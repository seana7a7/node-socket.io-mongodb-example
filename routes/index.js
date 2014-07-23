// index
exports.getMessages = function(req, res) {
	var db = req.db;
	// select collection
	var collection = db.collection('messageDB');
	// get all records
	collection.find().toArray(function(err, msgArray) {
		// return index.jade with these values
		res.render('index', {
			title : 'Socket.io Example',
			path : req.path,
			messages : msgArray
		});
	});
};

// create a new message
exports.createMessage = function(req, res) {
	var db = req.db;
	// select collection
	var collection = db.collection('messageDB');
	// post parameters
	var post = req.body;
	// insert post
	collection.insert(post, {
		safe : true
	}, function(error, result) {
		// function was called by ajax so redirects would not apply
	});
};

// delete all messages
exports.deleteMessages = function(req, res) {
	var db = req.db;
	// select collection
	var collection = db.collection('messageDB');
	// remove all records
	collection.remove({}, {
		safe : true
	}, function(error, result) {
		if (error) {
			res.render('error', {
				title : 'Messages Delete Failed!'
			});
		} else {
			res.redirect("/");
		}
	});
};
