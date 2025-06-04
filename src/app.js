/* Main animation loop will be implemented here */

// Placeholder for global time variable
let time = 0;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function gameLoop() {
    time += 0.1; // TODO: replace with performance.now based timer

    // TODO: clear canvas, update waves, render pixels

    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
