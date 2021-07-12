'use strict';

let isLarge = false;
let isDragging = false;

let coeffX = 1;
let coeffY = 1;
let canvasWidth = 0;
let canvasHeight = 0;
let smallMapX = 0;
let smallMapY = 0;
let mapWidth = 0;
let mapHeight = 0;

const imgSmall = new Image();
imgSmall.src = './images/D20-small.jpg';

const imgLarge = new Image();
//imgLarge.addEventListener('load', e => { console.log(`${imgLarge.src} loaded`) });
imgLarge.loading = 'lazy';
imgLarge.src = './images/D20.jpg';

const canvasMap = document.getElementById('map');

const ctx = canvasMap.getContext('2d');

imgSmall.addEventListener('load', () => {
    canvasWidth = imgSmall.naturalWidth;
    canvasHeight = imgSmall.naturalHeight;
    canvasMap.width = canvasWidth;
    canvasMap.height = canvasHeight;
    loadSmall();
})

imgLarge.addEventListener('load', () => {
    mapWidth = imgLarge.naturalWidth;
    mapHeight = imgLarge.naturalHeight;
    coeffX = mapWidth / canvasWidth;
    coeffY = mapHeight / canvasHeight;

    // this may happen on reloading
    if (imgLarge.loading === 'lazy') {
        imgLarge.loading = 'eager';
        return;
    }
    loadLarge();
})

canvasMap.addEventListener('click', e => {
    if (isLarge) return;
    smallMapX = e.offsetX;
    smallMapY = e.offsetY;
    if (imgLarge.loading !== 'eager') {
        ctx.fillStyle = "rgba(0, 0, 0, .5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        imgLarge.loading = 'eager'
    } else
        loadLarge();
})

const pLog = document.getElementById('log');

canvasMap.addEventListener('mousedown', e => {
    isDragging = isLarge;
})

canvasMap.addEventListener('mouseup', () => {
    isDragging = false;
})

canvasMap.addEventListener('mouseout', () => {
    isDragging = false;
})

canvasMap.addEventListener('mousemove', e => {
    if (!isDragging) return;
    smallMapX -= e.movementX / coeffX;
    smallMapY -= e.movementY / coeffY;
    loadLarge();
})

document.getElementById('small').addEventListener('click', loadSmall);

function loadSmall() {
    ctx.drawImage(imgSmall, 0, 0);
    isLarge = false;
    canvasMap.style = 'cursor: zoom-in;';
}

function loadLarge() {
    let largeMapX = smallMapX * coeffX;
    let largeMapY = smallMapY * coeffY;
    if (largeMapX < canvasWidth / 2) largeMapX = canvasWidth / 2;
    if (largeMapY < canvasHeight / 2) largeMapY = canvasHeight / 2;
    if (largeMapX > mapWidth - canvasWidth / 2) largeMapX = mapWidth - canvasWidth / 2;
    if (largeMapY > mapHeight - canvasHeight / 2) largeMapY = mapHeight - canvasHeight / 2;

    ctx.drawImage(imgLarge, largeMapX - canvasWidth / 2, largeMapY - canvasHeight / 2, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
    isLarge = true;
    canvasMap.style = 'cursor: grab;';
}