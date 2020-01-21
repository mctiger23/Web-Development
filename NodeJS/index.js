//jshint esversion:6

const superheroes = require('superheroes');
const supervillains = require('supervillains');

var mySuperHeroName = superheroes.random();
var mySuperVillianName = supervillains.random();

console.log(mySuperHeroName + " VS " + mySuperVillianName);
