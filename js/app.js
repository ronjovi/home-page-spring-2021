/*
*
* Roberto Sanchez - sanc735@usc.edu
* Animate ghosts on the HTML canvas
*
*/

'use strict';


// wait for page load
window.onload = function () {
    // constants
    var twoPi = Math.PI * 2;
    var canvas = document.getElementById('canvas');
    var canvasContext = canvas.getContext("2d");
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = document.documentElement.scrollHeight

    var ghosts = [];
    var numOfGhosts = Math.round((width + height) / 150);
    var mousePosition = {
        x: width/2,
        y: height/2
    }

    // generates random number between the minimum and maximum value
    function genRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // initializes all ghosts on canvas given random number generated
    function initGhosts() {
        for (var i = 0; i < numOfGhosts; i++) {
            // generate x,y position for ghost body
            var x = genRandomNumber(0, width);
            var y = genRandomNumber(0, height);

            var leftEye = {
                position: {
                    x: x - 10,
                    y: y - 10
                },
                irisPosition: {
                    x: x - 10,
                    y: y - 10
                },
                trackingRadius: 20,
                sizeRadius: 5
            }

            var rightEye = {
                position: {
                    x: x + 10,
                    y: y - 10
                },
                irisPosition: {
                    x: x + 10,
                    y: y - 10
                },
                trackingRadius: 20,
                sizeRadius: 5
            }

            // creates new ghost object and adds it to the collection of ghosts
            ghosts.push({
                position: {
                    x: x,
                    y: y
                },
                bounceAngle: genRandomNumber(0, 100),
                bounceDistance: 0.5,
                bounceSpeed: 0.05,
                velocityAngle: Math.random() * 2 + 1,
                velocityLength: Math.random() * twoPi,
                radius: 50,
                eyes: [
                    leftEye,
                    rightEye
                ],
                eyeDistance: 50,
            });
        }
    }

    // updates ghosts position on the canvas
    function updateGhost(ghost) {
        // Randomize speed of ghost for different bounce speeds
        if (Math.random() < 0.01) {
            ghost.velocityAngle = Math.random() * 2 + 1;
            ghost.velocityLength = Math.random() * twoPi;
        }

        var bounce = {
            x: 0,
            y: Math.sin(ghost.bounceAngle) * ghost.bounceDistance
        }

        // update ghost x,y values
        ghost.position = {
            x: ghost.position.x + bounce.x,
            y: ghost.position.y + bounce.y
        }

        // update bounce angle
        ghost.bounceAngle += ghost.bounceSpeed;

        for (var i = 0; i < ghost.eyes.length; i++) {
           ghost.eyes[i] = updateEyes(ghost.position, bounce, ghost.eyes[i]);
        }

        return ghost;
    }

    function updateEyes(ghostPos, ghostBounce, ghostEye) {
        var deltaX = mousePosition.x - ghostPos.x;
        var deltaY = mousePosition.y - ghostPos.y;
        var angle = Math.atan2(deltaY,deltaX);

        ghostEye.position = {
            x:  ghostEye.position.x + ghostBounce.x,
            y: ghostEye.position.y + ghostBounce.y
        }

         ghostEye.irisPosition.x = ghostEye.position.x + Math.cos(angle) * ghostEye.trackingRadius;
         ghostEye.irisPosition.y = ghostEye.position.y + Math.sin(angle) * ghostEye.trackingRadius;

        return ghostEye;
    }

    // update convas for redraw
    function update() {
        // iterates through ghost array to update its position
        for (var i = 0; i < ghosts.length; i++) {
            ghosts[i] = updateGhost(ghosts[i]);
        }
    }

    // redraw canvas objects
    function render() {
        // clear canvas of previous state
        canvasContext.clearRect(0, 0, width, height);

        // iterates through ghosts array to draw each ghost on canvas
        for (var i = 0; i < ghosts.length; i++) {
            canvasContext.fillStyle = "#fff";
            canvasContext.beginPath();
            canvasContext.arc(ghosts[i].position.x, ghosts[i].position.y, ghosts[i].radius, 0, twoPi);
            canvasContext.fill();


            for (var j = 0; j < ghosts[i].eyes.length; j++) {
                canvasContext.fillStyle = "#000";
                canvasContext.beginPath();
                canvasContext.arc(ghosts[i].eyes[j].irisPosition.x, ghosts[i].eyes[j].irisPosition.y, ghosts[i].eyes[j].sizeRadius, 0, twoPi);
                canvasContext.fill();
            }
        }
    }

    // main animation loop
    function loop() {
        update();
        render();

        // call loop - cpu friendly
        window.requestAnimationFrame(function () { loop() });
    }

    // Reinitializing canvas objects on page resize
    function resizeCanvasHandler() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;        height = height = window.innerHeight;
        numOfGhosts = Math.round((width + height) / 200);

        //Empty the previous container and fill it again with new Ghost objects
        ghosts = [];
        initGhosts();
    }

    function mouseMoveHandler(e) {
        mousePosition = {
            x: e.clientX,
            y: e.clientY
        }
    }

    // Create our ghosts
    initGhosts();

    // Resize listener for the canvas to fill browser window dynamically
    window.addEventListener('resize', () => resizeCanvasHandler(), false);

    // Mouse move listener - updates ghosts eyes on canvas to track user mouse movement
    window.addEventListener('mousemove', (e) => mouseMoveHandler(e), false);

    // Start animation loop
    loop();



}

