import type { Medal as MedalType } from "../definition/medal";
import { newgroundsInit } from "../lib/external/newgrounds";
import { NewgroundsMedal, Medal, medalsInit } from "../lib/littlejs";
import CryptoJS from 'crypto-js';

export class Medals {
  villageMedal = new NewgroundsMedal(82136, 'First Village', 'You build your first village!', '🎖️');
  medals: Record<string, NewgroundsMedal> = {};
  mMedals: Record<string, Medal> = {};

  constructor(medals: MedalType[]) {
    newgroundsInit(
      "59435:yImSBHAv",
      "CgB6J4i3kfvQGILxQUF39g==",
      CryptoJS,
    );
    medals.forEach((medal) => {
      this.mMedals[medal.name] = new Medal(medal.id, medal.name, medal.description, medal.icon);
      if (!medal.id) {
        return;
      }
      this.medals[medal.name] = new NewgroundsMedal(medal.id, medal.name, medal.description, medal.icon);
    });
    medalsInit("medals");
  }

  isUnlocked(medal: string) {
    return this.mMedals[medal]?.unlocked || this.medals[medal]?.unlocked;
  }

  unlock(medal: string) {
    if (!this.isUnlocked(medal)) {
      this.mMedals[medal].unlock();
    }
    if (!this.medals[medal].unlocked) {
      this.medals[medal].unlock();
    }
  }
}
