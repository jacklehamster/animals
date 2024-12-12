import { TileInfo, vec2 } from "../lib/littlejs";
import type { Anim } from "../definition/animation";

export interface AnimationInfo {
  animation?: Anim;
  tileInfos: TileInfo[];
  airFramesSet?: Set<number>;
}

export class AnimationManager {
  private readonly animationInfos: Record<string, AnimationInfo> = {};
  readonly imageSources: string[] = [];

  constructor(animations: Anim[]) {
    this.saveImageSource(animations);
    this.registerAnimations(animations);
    this.registerTileInfos(animations);
    this.updateExtra(animations);
  }

  private saveImageSource(animations: Anim[]) {
    animations?.forEach((animation) => {
      if (animation.imageSource && !this.imageSources.includes(animation.imageSource)) {
        this.imageSources.push(animation.imageSource);
      }
    });
  }

  private ensureAnimationInfos(name: string) {
    if (!this.animationInfos[name]) {
      this.animationInfos[name] = {
        animation: undefined,
        tileInfos: [],
      };
    }
    return this.animationInfos[name];
  }

  private registerTileInfos(animations: Anim[]) {
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      const imgSource = animation.imageSource;
      if (imgSource) {
        const size = vec2(animation.spriteSize?.[0] ?? 0, animation.spriteSize?.[1] ?? 0);
        animation.frames?.forEach((frame) => {
          const mul = animation.mul ?? 1;
          for (let i = 0; i < mul; i++) {
            animInfo.tileInfos.push(new TileInfo(undefined,
              size,
              this.imageSources.indexOf(imgSource),
              2).frame(frame));
          }
        });
      }


    });
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      animation.children?.forEach((child) => {
        const childAnimInfo = this.getInfo(child);
        animInfo.tileInfos.push(...childAnimInfo.tileInfos);
      });
    });
  }

  private registerAnimations(animations: Anim[]) {
    animations?.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      animInfo.animation = animation;
    });
  }

  private updateExtra(animations: Anim[]) {
    animations.forEach((animation) => {
      const animInfo = this.ensureAnimationInfos(animation.name);
      if (animation.airFrames?.length) {
        let count = 0;
        animInfo.airFramesSet = new Set();
        animation.frames?.forEach((frame) => {
          const mul = animation.mul ?? 1;
          for (let i = 0; i < mul; i++) {
            if (animation.airFrames?.includes(frame)) {
              animInfo.airFramesSet?.add(count);
            }
            count++;
          }
        });
      }
    });
  }

  getInfo(name: string) {
    return this.animationInfos[name];
  }
}
