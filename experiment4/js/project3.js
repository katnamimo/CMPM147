"use strict";

/* global XXH, loadImage */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let images = []; 
let tileImageIndices = {}; 
let tileStates = {}; 

function p3_preload() {
  for (let i = 1; i <= 15; i++) {
    let img = loadImage(`https://cdn.glitch.global/e7715c7e-dc9c-46f2-a838-80c3ae5a62b6/${i}.png?v=1714538908333`);
    images.push(img);
  }
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = `${i}_${j}`;
  clicks[key] = 1 + (clicks[key] | 0);

  tileStates[key] = !tileStates[key];

  if (tileStates[key]) {
  
    let index = floor(random(images.length));
    tileImageIndices[key] = index;
  } else {

    tileImageIndices[key] = undefined;
  }

  redraw(); 
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  if ((i + j) % 2 == 0) {
    fill(255); 
  } else {
    let tileNoise = noise(i * 0.1, j * 0.1, worldSeed); // generate noise based on position and worldSeed
    let tileSize = map(tileNoise, 0, 1, 10, 50); // map noise to tile size
    rectMode(CENTER);
    rect(0, 0, tileSize, tileSize);
  }

  // generate a key for this tile's image index
  let key = `${i}_${j}`;

  if (tileImageIndices[key] !== undefined) {
    // if there's an image draw it
    image(images[tileImageIndices[key]], -tw / 2, -th / 2, tw, th);
  }
}
