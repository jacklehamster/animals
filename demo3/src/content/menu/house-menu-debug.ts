import type { MenuItem } from "../../definition/menu";

export const HOUSE_MENU_DEBUG: MenuItem[] = [
  {
    name: "hobo",
    imageSource: "./assets/tiles.png",
    spriteSize: [64, 64] as [number, number],
    padding: [2, 2],
    frames: [86, 87],
    label: "spawn\nhobo",
    disabled: {
    },
    actions: [
      {
        deselect: true,
        create: {
          definition: "hobo",
          selfSelect: true,
        },
      },
    ],
    debug: true,
  },
];
