# Master Specification Document

This document defines the complete system architecture for the **Psychedelic Wave Generator**. All subsequent development phases must adhere exactly to the definitions and behaviors contained here. Constants defined in this document are immutable.

## 1. File Structure

```
/                   Project root
├── index.html      Main application page
├── src/
│   ├── app.js      Application bootstrap and animation loop
│   ├── nodes.js    Node data structures and management
│   └── waves.js    Wave math and rendering helpers
├── README.md
└── MASTER_SPECIFICATION.md  This specification
```

## 2. HTML Layout

The HTML file shall contain a single canvas element with the identifier `canvas`. No other elements are required.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Psychedelic Waves</title>
    <style>
        html, body {
            margin: 0;
            height: 100%;
            background: black;
        }
        #canvas {
            display: block;
            margin: auto;
        }
    </style>
</head>
<body>
    <canvas id="canvas" width="800" height="800"></canvas>
    <script type="module" src="src/app.js"></script>
</body>
</html>
```

## 3. Global Constants

The following constants are defined and must not be altered by any other agent:

```javascript
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;
export const SPATIAL_FREQUENCY = 0.05; // radians per pixel
export const TEMPORAL_FREQUENCY = 0.005; // radians per millisecond
export const MAX_NODES = 10;
export const REMOVE_RADIUS = 5; // pixels

export const COLOR_STEPS = [
    { h: 0,   s: 100, l: 50 },
    { h: 60,  s: 100, l: 50 },
    { h: 120, s: 100, l: 50 },
    { h: 180, s: 100, l: 50 },
    { h: 240, s: 100, l: 50 },
    { h: 300, s: 100, l: 50 }
];
```

## 4. Node Data Structure

Nodes represent wave sources. Each node is an object with the following exact shape:

```javascript
export interface Node {
    x: number;            // X coordinate in pixels
    y: number;            // Y coordinate in pixels
    creationTime: number; // timestamp in milliseconds
    id: string;           // unique identifier
}
```

Nodes are stored in an array `nodes: Node[]` exported from `nodes.js`.

## 5. Function Signatures

The system exposes the following functions:

### `app.js`

```javascript
import { initNodes, addNode, removeNodeNearest } from './nodes.js';
import { renderFrame } from './waves.js';

export function init(): void;
export function animationLoop(timestamp: number): void;
```

### `nodes.js`

```javascript
import { Node } from './nodes.js';

export let nodes: Node[];
export function initNodes(): void;
export function addNode(x: number, y: number): Node;
export function removeNodeNearest(x: number, y: number): void;
export function findClosestNode(x: number, y: number): Node | null;
```

### `waves.js`

```javascript
import { Node } from './nodes.js';
import { nodes } from './nodes.js';

export function waveContribution(node: Node, x: number, y: number, t: number): number;
export function combinedWave(x: number, y: number, t: number): number;
export function amplitudeToColor(a: number): { r: number, g: number, b: number };
export function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number };
export function renderFrame(ctx: CanvasRenderingContext2D, t: number): void;
```

All helper functions are also exported so that they may be unit tested independently.

## 6. Mathematical Formulas

*Distance:* `d = sqrt((x - node.x)^2 + (y - node.y)^2)`

*Wave Contribution:* `w = sin(d * SPATIAL_FREQUENCY - t * TEMPORAL_FREQUENCY)`

*Combined Wave:* sum of contributions from all nodes divided by the number of nodes to normalize to the range [-1, 1].

*HSL to RGB:* the standard conversion formula from HSL space to RGB space. The function `hslToRgb` returns integer channel values (0–255).

## 7. Animation Loop

`animationLoop` uses `window.requestAnimationFrame`. It receives a high-resolution timestamp. A module-level variable `time` stores elapsed milliseconds. Each frame computes `delta = timestamp - lastTimestamp` and updates `time += delta`. The loop then calls `renderFrame(ctx, time)` and schedules the next frame.

```
let time = 0;
let lastTimestamp = 0;
function animationLoop(timestamp) {
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    time += delta;
    renderFrame(ctx, time);
    window.requestAnimationFrame(animationLoop);
}
```

## 8. Adding and Removing Nodes

*Adding:* On left mouse click, `addNode(x, y)` is called. If `nodes.length` equals `MAX_NODES`, the oldest node is removed before adding the new one.

*Removing:* On right mouse click, `removeNodeNearest(x, y)` is called. If the click lies within `REMOVE_RADIUS` of any node's center, that node is removed. If not, the node whose center is closest to the click position is removed.

## 9. Pixel Rendering Strategy

`renderFrame` constructs an `ImageData` object matching the canvas size. For each pixel `(x, y)` iterate over `y` outermost and `x` innermost:

1. Calculate `a = combinedWave(x, y, t)`.
2. Map `a` to a color: `color = amplitudeToColor(a)`.
3. Write `color.r`, `color.g`, `color.b`, and `255` (alpha) into the ImageData buffer.

After all pixels are processed, `ctx.putImageData()` draws the result.

## 10. Color Mapping

`amplitudeToColor` converts a normalized amplitude `a ∈ [-1, 1]` into an HSL step. The function computes `index = Math.floor((a + 1) / 2 * (COLOR_STEPS.length - 1) + 0.5)` and selects the corresponding step from `COLOR_STEPS`. It then converts that HSL value to RGB via `hslToRgb`.

## 11. Module Responsibilities

* **app.js** – sets up the canvas context, registers mouse event handlers, initializes modules, and runs the animation loop.
* **nodes.js** – maintains the `nodes` array and all logic for creation and removal of nodes.
* **waves.js** – implements all math and rendering utilities.

## 12. Event Handling Summary

```
canvas.addEventListener('click', (e) => addNode(e.offsetX, e.offsetY));
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    removeNodeNearest(e.offsetX, e.offsetY);
});
```

The standard context menu is suppressed on right-click.

## 13. Additional Notes

* The system uses ECMAScript modules (`type="module"`).
* Random number generation or external resources are not required.
* All rendering must occur using the 2D canvas context obtained from the single canvas element.
* The color palette and frequency constants defined here are fixed for all builds.

