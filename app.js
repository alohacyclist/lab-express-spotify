require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving your access token', error));

// Our routes go here:
// Home Route
app.get('/',(req, res) => { res.render('home') })

// Search for Artist Route
app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log('data.body.artist.items', data.body);

    // Display Results Search Artist Route
      res.render('artist-search-results', {
        artists: data.body.artists.items,
      })
    })
    .catch(err => console.log('Error while retrieving your artist: ', err));
})

app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
      res.render('albums', {
        albums: data.body.items
      })
    })
    .catch(err => console.log('Error while retrieving this artists albums: ', err))
})

app.get('/album-tracks/:id', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(data => {
      res.render('album-tracks', {
        tracks: data.body.items
      })
    })
    .catch(err => console.log('Error while retrieving this artists albums: ', err))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
