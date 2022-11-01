var express = require('express');
var router = express.Router();
//Fetch doesn't exist on server-side JavaScript, so we impoort a package which implements the functionality.
var fetch = require('node-fetch');
var fs = require('fs');

var loadedFiles = false;

//Make sure to set the redirect URI in the Spotify app you create!
var redirect_uri = 'http://localhost:8888/callback';
var my_client_id = null;
var my_client_secret = null;

var access_token = null;
var refresh_token = null;
var client_uri = 'http://localhost:4200';

function refresh() {
	const params = new URLSearchParams();
	params.append('refresh_token', refresh_token);
	params.append('grant_type', 'refresh_token');

	var headers = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
	};

	return fetch('https://accounts.spotify.com/api/token', {method: 'POST', body: params, headers: headers}).then(response => {
		if(response.ok) {
			return response.json();
		} else {
			throw "Error refreshing token";
		}
	}).then(json => {
		access_token = json.access_token;
		refresh_token = json.refresh_token;
		fs.writeFile('tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}), () => {
			return Promise.resolve();
		});
	}).catch(err => console.error(err));
}

function makeAPIRequest(url, res) {
	var headers = {
		'Content-Type':'application/x-www-form-urlencoded',
		'Authorization': 'Bearer ' + access_token
	};

	fetch(url, {method: 'GET', headers: headers}).then(response => {
		if(response.ok) {
			return response.json();
		} else {
			if(response.status == 401) {
				refresh().then(() => {
					return fetch(url, {method: 'GET', headers: headers}).then(response => {
						if(response.ok) {
							return response.json();
						} else {
							console.log(response);
							res.status(response.status).end();
						}
					});
				});
			} else {
				console.log(response);
				res.status(response.status).end();
			}
			return null;
		}
	}).then(json => {
		res.json(json);
	}).catch(err => {
		console.error(err);
	});
}

router.get('*', function(req, res, next) {
	if(!loadedFiles) {
		//This chains two promises together. First, client_secret.json will be read and parsed. Once it completes, tokens.json will be read and parsed.
		//Promise.all() could be used to conduct these two file reads asynchronously, which is more efficient.
		fs.readFile('client_secret.json', (err, data) => {
			data = JSON.parse(data);
			my_client_id = data.client_id;
			my_client_secret = data.client_secret;
			fs.readFile('tokens.json', (err, data) => {
			data = JSON.parse(data);
			access_token = data.access_token;
			refresh_token = data.refresh_token;
			next();
			});
		});
	}
	else {
		next();
	}
});

router.get('/login', function(req, res, next) {
	var scopes = 'user-read-private user-read-email';
	res.redirect('https://accounts.spotify.com/authorize' +
	  '?response_type=code' +
	  '&client_id=' + my_client_id +
	  (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
	  '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

router.get('/callback', function(req, res, next) {
	var code = req.query.code || null;
	var error = req.query.error || null;

	if(error) {
		console.error(error);
	} else {
		//we're probably good
		const params = new URLSearchParams();
		params.append('code', code);
		params.append('redirect_uri', redirect_uri);
		params.append('grant_type', 'authorization_code');

		var headers = {
			'Content-Type':'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + Buffer.from(my_client_id + ':' + my_client_secret).toString('base64')
		};

		fetch('https://accounts.spotify.com/api/token', {method: 'POST', body: params, headers: headers}).then(response => {
			if(response.ok) {
				return response.json();
			} else {
				//Could be better to redirect to an error page, but we'll go back to the client.
				res.redirect(client_uri);
			}
		}).then(json => {
			access_token = json.access_token;
			refresh_token = json.refresh_token;
			fs.writeFile('tokens.json', JSON.stringify({access_token: access_token, refresh_token: refresh_token}), () => {
				res.redirect(client_uri);
			});
		}).catch(err => console.error(err));
	}
});

router.get('/me', function(req, res, next) {
	makeAPIRequest('https://api.spotify.com/v1/me', res);
});

router.get('/search/:category/:resource', function(req, res, next) {
	var resource = req.params.resource;
	var category = req.params.category;
	var params = new URLSearchParams();
	params.append('q', resource);
	params.append('type', category);
	makeAPIRequest('https://api.spotify.com/v1/search?' + params, res);
});

router.get('/artist/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id, res);
});

router.get('/artist-related-artists/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/related-artists', res);
});

router.get('/artist-albums/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/albums', res);
});

router.get('/artist-top-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/artists/' + id + '/top-tracks?country=US', res);
});

router.get('/album/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/albums/' + id, res);
});

router.get('/album-tracks/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/albums/' + id + '/tracks', res);
});

router.get('/track/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/tracks/' + id, res);
});

router.get('/track-audio-features/:id', function(req, res, next) {
	var id = req.params.id;
	makeAPIRequest('https://api.spotify.com/v1/audio-features/' + id, res);
});

module.exports = router;
