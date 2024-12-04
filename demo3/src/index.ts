/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

'use strict';

import { engineInit } from "littlejsengine"
import { Manager } from "./manager";
import { worldData } from "./content/world";

const manager = new Manager(worldData);
(window as any).manager = manager;

function gameInit() {
}

function gameUpdate() {
  manager.refresh();
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
