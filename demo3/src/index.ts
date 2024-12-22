/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

'use strict';

import { Manager } from "./core/manager";
import { worldData } from "./content/world";
import { engineInit } from "./lib/littlejs";



const scene = worldData;

let manager = new Manager(scene);
(window as any).manager = manager;

function gameInit() {
}

function gameUpdate() {
  manager.update();
}

function postUpdate() {
}

function render() {
}

function renderPost() {
}

engineInit(
  gameInit,
  gameUpdate,
  postUpdate,
  render,
  renderPost,
  manager.animation.imageSources,
)
