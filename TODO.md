Project: Psychedelic Wave Interference Visualizer (Solo Agent)
Phase 1: Project Setup & Core Structure
1.1. Create Project Directory & Files:
index.html
style.css (optional, for basic page styling if needed beyond canvas)
app.js (or a similar main JavaScript file)
1.2. Basic HTML Structure (index.html):
Standard HTML boilerplate (doctype, head, body).
Add a <canvas> element with a specific ID (e.g., waveCanvas).
Link style.css (if using).
Link app.js at the end of the <body>.
1.3. Initial JavaScript Setup (app.js):
Add 'use strict';
Get canvas element by ID.
Get 2D rendering context (ctx).
Set canvas dimensions (e.g., canvas.width = 800; canvas.height = 800; or make it responsive).
Define placeholder for global parameters/constants.
Phase 2: Node Management
2.1. Define Node Data Structure:
Decide on properties (e.g., x, y, id, creationTime).
2.2. Implement Node Storage:
Create an array to store active nodes (e.g., let activeNodes = [];).
2.3. Implement addNode(x, y) function:
Creates a new node object.
Adds it to activeNodes.
(Optional) Consider MAX_NODES limit.
2.4. Implement removeNode(clickX, clickY) function:
Calculates distance from (clickX, clickY) to each node in activeNodes.
Finds the closest node.
Removes the closest node from activeNodes.
2.5. Implement Click Event Handlers:
Add click event listener to the canvas for left-clicks.
Get mouse coordinates relative to the canvas.
Call addNode() with coordinates.
Add contextmenu event listener to the canvas for right-clicks.
event.preventDefault().
Get mouse coordinates relative to the canvas.
Call removeNode() with coordinates.
2.6. (Initial Test) Draw Nodes:
Temporarily add code to draw small circles on the canvas where nodes are, to verify adding/removing works.
Phase 3: Wave Generation & Animation Core
3.1. Define Wave & Animation Parameters:
SPATIAL_FREQUENCY
TEMPORAL_FREQUENCY
(Optional) INITIAL_PHASE_MODE
animationSpeedFactor (if using performance.now())
3.2. Implement Wave Function (calculateSingleWaveValue):
Takes (px, py, node, currentTime, params) as input.
Calculates Euclidean distance d from (px, py) to node.(x,y).
Implements Math.sin(d * spatialFrequency - currentTime * temporalFrequency + phaseOffset).
3.3. Implement Main Animation Loop (animationLoop):
Define a global currentTime variable.
Function animationLoop():
Increment currentTime (e.g., currentTime += 0.1; or currentTime = performance.now() / 1000 * animationSpeedFactor;).
(Placeholder for rendering logic)
requestAnimationFrame(animationLoop);
Start the loop: animationLoop();
Phase 4: Rendering & Color Mapping
4.1. Implement Color Mapping Function (mapWaveValueToRGB):
Takes (totalWaveValue, numNodes, colorParams) as input.
Normalize totalWaveValue (e.g., to 0-1 or -1 to 1 range).
Map normalized value to Hue (e.g., (normalizedValue * 360) % 360).
Set fixed Saturation and Lightness/Value (e.g., S=100%, L=50%).
Implement HSL/HSV to RGB conversion.
(Refinement) Consider specific color band logic from design doc (blue-green base, yellow-red hotspots).
4.2. Implement Pixel Rendering Logic (within animationLoop or a dedicated renderFrame function called by it):
ctx.clearRect(0, 0, canvas.width, canvas.height); (if not using putImageData to overwrite fully).
Create ImageData object: let imageData = ctx.createImageData(canvas.width, canvas.height);.
Loop y from 0 to canvas.height - 1.
Loop x from 0 to canvas.width - 1.
Initialize totalWaveValue = 0; for the current pixel (x, y).
Loop through each node in activeNodes:
Call calculateSingleWaveValue(x, y, node, currentTime, params)
Add result to totalWaveValue.
Call mapWaveValueToRGB(totalWaveValue, activeNodes.length, colorParams) to get r, g, b.
Calculate ImageData array index = (y * canvas.width + x) * 4.
Set imageData.data[index] = r;
Set imageData.data[index + 1] = g;
Set imageData.data[index + 2] = b;
Set imageData.data[index + 3] = 255; (alpha).
After loops, ctx.putImageData(imageData, 0, 0);.
4.3. (Initial Test) Render with one static node:
Manually add one node to activeNodes and observe the pattern.
Phase 5: Refinement & Tuning
5.1. Tune Wave Parameters:
Adjust SPATIAL_FREQUENCY for wave density.
Adjust TEMPORAL_FREQUENCY for animation speed.
5.2. Tune Color Mapping:
Adjust parameters in mapWaveValueToRGB to match the reference video's color progression, vibrancy, and hotspot appearance.
Experiment with HSL/HSV values and mapping formulas.
5.3. Verify "Dot" Appearance:
Ensure the ImageData rendering creates the desired pixelated/dot-matrix look.
5.4. Test Interactivity:
Thoroughly test adding multiple nodes and removing them to see interference patterns and ensure stability.
5.5. Review Visual Fidelity Checklist (from design doc):
Check against each item.
Phase 6: Performance & Finalization
6.1. Performance Check:
Test with a reasonable number of nodes (e.g., 5-9).
Observe frame rate (browser developer tools).
If sluggish, consider optimizations:
Optimize math in loops.
Ensure efficient ImageData handling.
(Advanced) If still slow, only then consider Web Workers or WebGL as a major refactor.
6.2. Code Cleanup & Organization:
Ensure code is readable and well-commented.
Group related functions.
Make constants and parameters easy to find and modify.
6.3. Final Testing:
Test in different browsers (if required).
Test edge cases (no nodes, max nodes, rapid clicking).
