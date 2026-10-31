/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const notes = ["C3", "C4", "C5"]; // the note played when the pointer goes down

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
// min funktion
let previousX;
let previousY;
let previousTime;
let speed = 0;
let lastNoteTime = 0;
let pointerX = 0.5;
let pointerY = 0.5;
let example;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.

function use() {
  example.setPosition(pointerX, pointerY);
  example.setSize(30 + speed * 5);
  setTimeout(use, 100);
} // call use() again in 100 milliseconds

  // Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(notes[1], "8n"); // play the note for an eighth note
}

//min funktion
function pointerMove(event) {

  pointerX = event.clientX / window.innerWidth;
  pointerY = event.clientY / window.innerHeight;

  if (previousX === undefined || previousY === undefined || previousTime === undefined) {
  previousX = event.clientX;
  previousY = event.clientY;
  previousTime = event.timeStamp;
  return;
}


let movementX = event.clientX - previousX;
let movementY = event.clientY - previousY;
let movementTime = event.timeStamp - previousTime;
let noteIndex = 1;
speed = Math.sqrt(movementX ** 2 + movementY ** 2) / movementTime;

previousX = event.clientX;
previousY = event.clientY;
previousTime = event.timeStamp;

console.log("Speed:", speed);


if (speed > 0.5) {
  noteIndex = 2;
} else if (Math.abs(movementY) > Math.abs(movementX)) {
  if (movementY < 0) {
    noteIndex = 2;
  } else if (movementY > 0) {
    noteIndex = 0;
  }
} else if (movementX !== 0) {
  noteIndex = 1;
}

let selectedNote;

for (let i = 0; i < notes.length; i++) {
  if (i === noteIndex) {
    selectedNote = notes[i];
  }
}

if (event.timeStamp - lastNoteTime >= 150) {
  synth.triggerAttackRelease(selectedNote, "8n");
  lastNoteTime = event.timeStamp;
}

}


// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {

  // Example: a shape near the middle of the window. Replace it with your own.
  example = createShape("example");
  example.setPosition(0.5, 0.5);


 update(); // start the update loop
  use(); // start the use loop
 // min funktion // Put your event listener code here
  window.addEventListener("pointermove", pointerMove)
  window.addEventListener("pointerdown", pointerDown);
}



setup(); // Always remember to call setup()!
