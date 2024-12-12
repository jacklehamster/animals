
export interface Research {
  name: string;
  description?: string;
  icon: {
    imageSource: string;
    spriteSize: [number, number];
    padding?: [number, number];
    frames: number[];
  };
  dependency: string[];
}
