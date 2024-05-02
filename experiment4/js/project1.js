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
  setTimeout(() => {
    if (tileStates[key]) {
      tileImageIndices[key] = -1;
      redraw(); 
      setTimeout(() => {
        tileImageIndices[key] = images.length - 1;
        redraw(); 
      }, 1000); 
    }
  }, 1000); 
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  if ((i + j) % 2 == 0) {
    fill(255, 122, 117); 
  } else {
    fill(255); 
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // generate a key for this tile's image index
  let key = `${i}_${j}`;
  let hash = XXH.h32("tile:" + [i, j], worldSeed);

  // threshold value to determine if the tile should be empty
  let threshold = 0.4; 

  if (hash / (2**32) < threshold) {
    // tile should remain empty, set index to -1
    tileImageIndices[key] = -1;
  } else {
    let index = floor(map(hash, 0, 2**32, 0, images.length));
    tileImageIndices[key] = index;
  }
  if (tileImageIndices[key] !== -1) {
    // Lift the image if the tile is clicked
    if (tileStates[key]) {
      translate(0, -10); 
    }
    image(images[tileImageIndices[key]], -tw / 2, -th / 2, tw, th);
  }

  pop();
}
