const express = require('express');
const app = express();

// will be used in the future for controlling who can access our API
const cors = require('cors');

// specific env vars in the future
require('dotenv').config();

const PORT = process.env.PORT || 3000;

//currently anyone can access our API
app.use(cors());

app.get('/location', (request, response) => {
  // get location data from geo.json file
  try{
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData);
}
catch(error){
    console.error(error);
  response.status(500).send('Status Location: 500 something went wrong');
}
});

app.get('/weather', (request, response) => {
  try{
    const wetherData = getWeather();
    response.send(wetherData);
  }
  catch(error){
    console.error(error);
    response.status(500).send('STatus:500 something went wrong.');
  }
});

function getWeather(){
  const darkSky = require('./data/darksky.json');
  const weatherSummaries = [];
  darkSky.daily.data.forEach(day => {
    weatherSummaries.push(new Weather(day));
  });
  return weatherSummaries;
}

function Weather(day){
    this.forecast = day.summary;
    this.time = new Date(day.time * 1000).toDateString();
}

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  console.log('location in searchToLatLong',location );
  location.search_query = query;
  console.log('location in searchToLatLong',location );
  return location; 
}

function Location(data){
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
}

app.listen(PORT, () => {
  console.log(`listening to the port:${PORT}`);
});
