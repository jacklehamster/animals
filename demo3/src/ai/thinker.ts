import type { GameObject } from "../core/objects/game-object";
import type { Manager } from "../core/manager";

interface Action {
  time: number;
  turnAround?: boolean;
  moveTo?: [number, number];
  talkTo?: [number, number];
  attack?: [number, number];
}

export class Thinker {
  constructor(private manager: Manager) {
  }

  async think(gameObject: GameObject) {
    const actions = await this.prepareScript(gameObject);
    await this.executeScript(gameObject, actions);
    gameObject.clearMoves();
    gameObject.doneMoving();
  }

  private async prepareScript(gameObject: GameObject): Promise<Action[]> {
    const actions: Action[] = [];

    // Search for prey
    const preys = await gameObject.findNearby((obj) => {
      if (obj.elem?.owner !== gameObject.elem?.owner) {
        return true;
      }
      return false;
    }, 2);

    // Search for friends
    const friends = await gameObject.findNearby((obj) => {
      if (obj !== gameObject && obj.elem?.type === "unit" && obj.elem?.owner === gameObject.elem?.owner) {
        return true;
      }
      return false;
    }, 3);
    console.log(preys, friends)

    const nextActionTime = preys.size || friends.size ? 0 : 1000;

    // Look around
    if (nextActionTime) {
      for (let i = 0; i < 4; i++) {
        actions.push({ time: nextActionTime / 4 * i, turnAround: true });
      }
    }

    let didMove = false;
    if (preys.size && (gameObject?.elem?.attack?.range ?? 1) === 2) {
      // find furthest target
      let target: { obj: GameObject | undefined, distance: number } = { obj: undefined, distance: 0 };
      preys.forEach((obj) => {
        const dx = obj.px - gameObject.px;
        const dy = obj.py - gameObject.py;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (!target || distance > target.distance) {
          target = { obj, distance };
        }
      });
      const targetObj = target.obj;
      if (targetObj) {
        actions.push({
          time: nextActionTime,
          attack: [targetObj.px ?? 0, targetObj.py ?? 0],
        });
        didMove = true;
      }
    } else if (preys.size && (gameObject?.elem?.attack?.range ?? 1) < 2) {
      //  move towards closest prey
      let target: { obj: GameObject | undefined, distance: number } = { obj: undefined, distance: 0 };
      preys.forEach((obj) => {
        const dx = obj.px - gameObject.px;
        const dy = obj.py - gameObject.py;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        if (!target || distance > target.distance) {
          target = { obj, distance };
        }
      });
      if (target.obj) {
        const dx = Math.sign(target.obj?.px - gameObject.px) || Math.floor(Math.random() * 3) - 1;
        const dy = Math.sign(target.obj?.py - gameObject.py) || Math.floor(Math.random() * 3) - 1;
        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 || this.manager.isEmptySpot(gameObject.px + dx, gameObject.py + dy)) {
          actions.push({
            time: nextActionTime,
            attack: [gameObject.px + dx, gameObject.py + dy],
          });
          didMove = true;
        }
      }
    } else if (friends.size) {
      //  move towards any friends at distance > 1
      let target: { obj: GameObject | undefined, distance: number } = { obj: undefined, distance: 1 };
      friends.forEach((obj) => {
        if (obj === gameObject) {
          return;
        }
        const dx = obj.px - gameObject.px;
        const dy = obj.px - gameObject.py;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        if (!target || distance > target.distance) {
          target = { obj, distance };
        }
      });
      if (target.obj) {
        const dx = Math.sign(target.obj.px - gameObject.py) || Math.floor(Math.random() * 3) - 1;
        const dy = Math.sign(target.obj.py - gameObject.py) || Math.floor(Math.random() * 3) - 1;
        if (this.manager.isEmptySpot(gameObject.px + dx, gameObject.py + dy)) {
          actions.push({
            time: nextActionTime,
            moveTo: [gameObject.px + dx, gameObject.py + dy],
          });
          didMove = true;
        }
      }
    }
    if (!didMove) {
      //  move to any empty spot
      const spots = this.manager.findEmptySpotsAround(gameObject.px, gameObject.py);
      if (spots.length) {
        const spot = spots[Math.floor(Math.random() * spots.length)];
        actions.push({
          time: nextActionTime,
          moveTo: [spot.x, spot.y],
        });
      }
    }
    return actions;
  }

  private async executeScript(gameObject: GameObject, actions: Action[]): Promise<void> {
    // sort actions by time (descending)
    actions.sort((a, b) => b.time - a.time);
    return new Promise((resolve) => {
      const startTime = Date.now();
      const loop = () => {
        if (!actions.length) {
          if (!gameObject.moving) {
            resolve();
          }
          return;
        }
        const time = Date.now() - startTime;
        if (time < actions[actions.length - 1].time) {
          requestAnimationFrame(loop);
        } else if (actions.length) {
          // execute last action
          const action = actions.pop();
          if (action?.turnAround) {
            gameObject.turnAround();
          } else if (action?.moveTo) {
            gameObject.simpleMoveTo(action.moveTo[0], action.moveTo[1]);
          } else if (action?.attack) {
            gameObject.attackTowards(action.attack[0], action.attack[1]);
          }
          requestAnimationFrame(loop);
        }
      };
      requestAnimationFrame(loop);

    });
  }
}
