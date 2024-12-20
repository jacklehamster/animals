import { newgroundsInit } from "../lib/external/newgrounds";
import { NewgroundsMedal } from "../lib/littlejs";
// import { Medal, medalsInit } from 'littlejsengine';
import CryptoJS from 'crypto-js';

export class Medals {
  villageMedal = new NewgroundsMedal(82136, 'First Village', 'You build your first village!', '🎖️');
  unlocked: Record<string, boolean> = {};
  medals: Record<string, NewgroundsMedal> = {};

  constructor() {
    newgroundsInit(
      "59435:yImSBHAv",
      "CgB6J4i3kfvQGILxQUF39g==",
      CryptoJS,
    );
    this.medals['First Village'] = this.villageMedal;
  }

  unlock(medal: string) {
    if (!this.unlocked[medal]) {
      this.unlocked[medal] = true;
      this.medals[medal].unlock();
    }
  }
}
