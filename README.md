# Psychedelic Wave Generator

This project is an interactive web app that creates dynamic, psychedelic wave patterns on a canvas element. Users can add or remove "nodes" by clicking on the canvas. Each node acts as a source of concentric waves that interfere with one another, producing colorful, animated interference patterns reminiscent of the included design document.

The goal is to match the look and feel of the reference video featuring vibrant, smoothly-animated, dot-matrix style visuals. The core logic will be implemented in JavaScript and rendered using the HTML5 canvas.

## Getting Started

Open `index.html` in a modern browser to run the app. The current build only contains a basic animation loop; wave rendering will be implemented in subsequent stages.

## Directory Structure

```
/             Project root
├── index.html        Main application page
├── src/              JavaScript sources
│   └── app.js        Application entry point
└── README.md         This file
```

## Development Stages

1. Node placement on canvas
2. Single-node wave rendering
3. Animation loop and interference
4. Pixel-based rendering and color mapping
5. Performance tuning
