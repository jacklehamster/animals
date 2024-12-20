import type { Scene } from "../definition/scene";
import { CABANA_DEFINITION } from "./definitions/cabana";
import { COW_DEFINITION } from "./definitions/cow";
import { DOG_DEFINITION } from "./definitions/dog";
import { HOUSE_DEFINITION } from "./definitions/house";
import { RIVER_DEFINITION } from "./definitions/river";
import { SHEEP_DEFINITION } from "./definitions/sheep";
import { COW_MENU } from "./menu/cow-menu";
import { HOUSE_MENU } from "./menu/house-menu";
import { SHEEP_MENU } from "./menu/sheep-menu";
import { BEAVER_RESEARCH } from "./research/beaver";
import { BOVINE_RESEARCH } from "./research/bovine";
import { CANINE_RESEARCH } from "./research/canine";
import { ELEPHANT_RESEARCH } from "./research/elephant";
import { EAGLE_RESEARCH } from "./research/eagle";
import { GOAT_RESEARCH } from "./research/goat";
import { HORSE_RESEARCH } from "./research/horse";
import { LAMA_RESEARCH } from "./research/lama";
import { MONKEY_RESEARCH } from "./research/monkey";
import { OWL_RESEARCH } from "./research/owl";
import { PANDA_RESEARCH } from "./research/panda";
import { PIG_RESEARCH } from "./research/pig";
import { SKUNK_RESEARCH } from "./research/skunk";
import { SQUIRREL_RESEARCH } from "./research/squirrel";
import { TORTOISE_RESEARCH } from "./research/tortoise";
import { WOLVES_RESEARCH } from "./research/wolves";
import { BRAIN_RESOURCE } from "./resources/brain";
import { GOLD_RESOURCE } from "./resources/gold";
import { TRADE_RESOURCE } from "./resources/trade";
import { WHEAT_RESOURCE } from "./resources/wheat";
import { WOOD_RESOURCE } from "./resources/wood";
import { RABBIT_RESEARCH } from "./research/rabbit";
import { BLUE_ANIMATION, BLUE_SELECTED_ANIMATION, HOVER_ANIMATION, INDIC_ANIMATION, TRIANGLE_ANIMATION, WAIT_ICON, WAVE_ICON } from "./animations/indicators";
import { SHEEP_ANIMATION, SHEEP_JUMP_ANIMATION, SHEEP_WAIT_ANIMATION } from "./animations/sheep";
import { GRASS_ANIMATION, GRASSLAND_ANIMATION, LAKE_ANIMATION, MOUNTAIN_ANIMATION, PLAIN_ANIMATION, RIVER_ANIMATION, TREE_ANIMATION, TREE_LEAF_ANIMATION, WAVE_ANIMATION } from "./animations/terrain";
import { CLOUD_ANIMATION } from "./animations/cloud";
import { SHADOW_ANIMATION } from "./animations/shadow";
import { CABANA_ANIMATION, HOUSE_ANIMATION, HOUSE_EXPAND_ANIMATION, VILLAGE_ANIMATION } from "./animations/house";
import { DIGITS_ANIMATION } from "./animations/digits";
import { DOG_ANIMATION, DOG_JUMP_ANIMATION, DOG_WAIT_ANIMATION } from "./animations/dog";
import { COW_ANIMATION, COW_JUMP_ANIMATION, COW_SLEEP_ANIMATION, COW_WAIT_ANIMATION } from "./animations/cow";
import { BRAIN_ANIMATION, GOLD_ANIMATION, TRADE_ANIMATION, WHEAT_ANIMATION, WOOD_ANIMATION } from "./animations/resources";
import { CURSOR } from "./elems/cursor";
import { CLOUD } from "./elems/cloud";
import { GRASS } from "./elems/grass";
import { PLAIN } from "./elems/plain";
import { LAKE } from "./elems/lake";
import { TREE } from "./elems/tree";
import { MOUNTAIN } from "./elems/mountain";
import { HOBO_DEFINITION } from "./definitions/hobo";
import { SHEEP } from "./elems/sheep";
import { CABANA } from "./elems/cabana";
import { HOBO_ANIMATION, HOBO_JUMP_ANIMATION, HOBO_WAIT_ANIMATION } from "./animations/hobo";
import { SQUIRREL_ANIMATION, SQUIRREL_ATTACK_ANIMATION, SQUIRREL_JUMP_ANIMATION, SQUIRREL_SLEEP_ANIMATION, SQUIRREL_WAIT_ANIMATION } from "./animations/squirrel";
import { SQUIRREL_DEFINITION } from "./definitions/squirrel";
import { TEST_UNITS } from "./elems/test-units";
import { SOLDIER_ANIMATION } from "./animations/soldier";
import { SOLDIER_DEFINITION } from "./definitions/soldier";
import { NUT_ANIMATION } from "./animations/nut";
import { CROCODILE_RESEARCH } from "./research/crocodile";
import { OVICULTURE_RESEARCH } from "./research/oviculture";
import { BEAVER_ANIMATION, BEAVER_JUMP_ANIMATION, BEAVER_WAIT_ANIMATION } from "./animations/beaver";
import { BEAVER_DEFINITION } from "./definitions/beaver";
import { SQUIRREL_MENU } from "./menu/squirrel-menu";
import { BULL_ANIMATION, BULL_JUMP_ANIMATION, BULL_WAIT_ANIMATION } from "./animations/bull";
import { BULL_DEFINITION } from "./definitions/bull";
import { TAUROLOGY_RESEARCH } from "./research/taurology";
import { BEAVER_MENU } from "./menu/beaver-menu";
import { TURTLE_ANIMATION, TURTLE_JUMP_ANIMATION, TURTLE_WAIT_ANIMATION } from "./animations/turtle";
import { TREE_DEFINITION } from "./definitions/tree";
import { TURTLE_DEFINITION } from "./definitions/turtle";
import { FRUIT_DEFINITION } from "./definitions/fruit";
import { CORAL_ANIMATION, FRUIT_ANIMATION, POTGOLD_ANIMATION } from "./animations/goodies";
import { FRUIT } from "./elems/fruit";
import { POTGOLD_DEFINITION } from "./definitions/potgold";
import { CORAL_DEFINITION } from "./definitions/coral";
import { CORAL } from "./elems/coral";
import { POTGOLD } from "./elems/potgold";
import { EXPLORATION as EXPLORATION_RESEARCH, } from "./research/exploration";
import { PRODUCTIVITY_RESEARCH as PRODUCTIVITY_RESEARCH } from "./research/productivity";
import { EXPANSION_RESEARCH } from "./research/expansion";
import { VILLAGE_DEFINITION } from "./definitions/village";
import { VILLAGE_RESEARCH } from "./research/village";
import { VILLAGE_MENU } from "./menu/village-menu";
import { SPACESHIP_RESEARCH } from "./research/spaceship";
import { SPACESHIP_ANIMATION } from "./animations/spaceship";
import { TURTLE_MENU } from "./menu/turtle-menu";
import { HOBO } from "./elems/barbarian";
import { GOAT_ANIMATION, GOAT_JUMP_ANIMATION, GOAT_SLEEP_ANIMATION, GOAT_WAIT_ANIMATION } from "./animations/goat";
import { GOAT_DEFINITION } from "./definitions/goat";
import { PANDA_ANIMATION, PANDA_JUMP_ANIMATION, PANDA_WAIT_ANIMATION } from "./animations/panda";
import { PANDA_DEFINITION } from "./definitions/panda";
import { RABBIT_ANIMATION, RABBIT_JUMP_ANIMATION, RABBIT_WAIT_ANIMATION } from "./animations/rabbit";
import { RABBIT_DEFINITION } from "./definitions/rabbit";
import { PIG_ANIMATION, PIG_JUMP_ANIMATION, PIG_SLEEP_ANIMATION, PIG_WAIT_ANIMATION } from "./animations/pig";
import { PIG_DEFINITION } from "./definitions/pig";

export const worldData: Scene = {
  scale: 80,
  // clearFogOfWar: true,
  endTurnAnim: {
    name: "anim",
    imageSource: "./assets/bookie.png",
    spriteSize: [400, 400] as [number, number],
    frames: [0, 1, 2, 3, 4],
  },
  quickActions: [
    {
      name: "wait",
      icon: WAIT_ICON,
      description: "Leave the animal idle until it encounters a human.",
    },
    {
      name: "abandon",
      icon: WAVE_ICON,
      description: "Release the animal into the wild.",
    },
  ],
  turn: {
    player: 1,
    turn: 1,
  },
  players: [
    {
      tax: 50,
      resources: {
        brain: 0,
        gold: 0,
      },
    },
  ],
  layers: {
    "tile": 0,
    "tile_overlay": 1,
    "road": 3,
    "house": 4,
    "unit": 4,
    "decor": 4,
    "goodies": 4,
    "cloud": 6,
    "cursor": 7,
  },
  colayers: {
    "house": 1,
    "decor": 2,
    "goodies": 3,
    "unit": 4,
  },
  definitions: [
    HOBO_DEFINITION,
    SHEEP_DEFINITION,
    DOG_DEFINITION,
    COW_DEFINITION,
    RIVER_DEFINITION,
    HOUSE_DEFINITION,
    CABANA_DEFINITION,
    SQUIRREL_DEFINITION,
    SOLDIER_DEFINITION,
    BEAVER_DEFINITION,
    BULL_DEFINITION,
    TREE_DEFINITION,
    TURTLE_DEFINITION,
    FRUIT_DEFINITION,
    POTGOLD_DEFINITION,
    CORAL_DEFINITION,
    VILLAGE_DEFINITION,
    GOAT_DEFINITION,
    PANDA_DEFINITION,
    RABBIT_DEFINITION,
    PIG_DEFINITION,
  ],
  animations: [
    TRIANGLE_ANIMATION,
    SHEEP_ANIMATION,
    SHEEP_WAIT_ANIMATION,
    SHEEP_JUMP_ANIMATION,
    HOVER_ANIMATION,
    INDIC_ANIMATION,
    BLUE_ANIMATION,
    BLUE_SELECTED_ANIMATION,
    GRASSLAND_ANIMATION,
    PLAIN_ANIMATION,
    GRASS_ANIMATION,
    TREE_ANIMATION,
    TREE_LEAF_ANIMATION,
    MOUNTAIN_ANIMATION,
    CLOUD_ANIMATION,
    SHADOW_ANIMATION,
    LAKE_ANIMATION,
    WAVE_ANIMATION,
    RIVER_ANIMATION,
    HOUSE_ANIMATION,
    CABANA_ANIMATION,
    ...DIGITS_ANIMATION,
    DOG_ANIMATION,
    DOG_WAIT_ANIMATION,
    DOG_JUMP_ANIMATION,
    COW_ANIMATION,
    COW_WAIT_ANIMATION,
    COW_JUMP_ANIMATION,
    COW_SLEEP_ANIMATION,
    WHEAT_ANIMATION,
    WOOD_ANIMATION,
    BRAIN_ANIMATION,
    GOLD_ANIMATION,
    TRADE_ANIMATION,
    HOBO_ANIMATION,
    HOBO_JUMP_ANIMATION,
    HOBO_WAIT_ANIMATION,
    SQUIRREL_ANIMATION,
    SQUIRREL_WAIT_ANIMATION,
    SQUIRREL_JUMP_ANIMATION,
    SQUIRREL_ATTACK_ANIMATION,
    SQUIRREL_SLEEP_ANIMATION,
    ...Object.values(SOLDIER_ANIMATION),
    NUT_ANIMATION,
    BEAVER_ANIMATION,
    BEAVER_WAIT_ANIMATION,
    BEAVER_JUMP_ANIMATION,
    BULL_ANIMATION,
    BULL_WAIT_ANIMATION,
    BULL_JUMP_ANIMATION,
    TURTLE_ANIMATION,
    TURTLE_WAIT_ANIMATION,
    TURTLE_JUMP_ANIMATION,
    FRUIT_ANIMATION,
    POTGOLD_ANIMATION,
    CORAL_ANIMATION,
    HOUSE_EXPAND_ANIMATION,
    VILLAGE_ANIMATION,
    SPACESHIP_ANIMATION,
    GOAT_ANIMATION,
    GOAT_JUMP_ANIMATION,
    GOAT_WAIT_ANIMATION,
    GOAT_SLEEP_ANIMATION,
    PANDA_ANIMATION,
    PANDA_JUMP_ANIMATION,
    PANDA_WAIT_ANIMATION,
    RABBIT_ANIMATION,
    RABBIT_WAIT_ANIMATION,
    RABBIT_JUMP_ANIMATION,
    PIG_ANIMATION,
    PIG_WAIT_ANIMATION,
    PIG_JUMP_ANIMATION,
    PIG_SLEEP_ANIMATION,
  ],
  elems: [
    CURSOR,
    CLOUD,
    SHEEP,
    GRASS,
    PLAIN,
    LAKE,
    TREE,
    MOUNTAIN,
    CABANA,
    FRUIT,
    POTGOLD,
    CORAL,
    HOBO,
    ...TEST_UNITS,
  ],
  menu: [
    SHEEP_MENU,
    HOUSE_MENU,
    COW_MENU,
    SQUIRREL_MENU,
    BEAVER_MENU,
    VILLAGE_MENU,
    TURTLE_MENU,
  ],
  resources: {
    wheat: WHEAT_RESOURCE,
    wood: WOOD_RESOURCE,
    brain: BRAIN_RESOURCE,
    gold: GOLD_RESOURCE,
    trade: TRADE_RESOURCE,
  },
  research: [
    CANINE_RESEARCH,
    BOVINE_RESEARCH,
    SQUIRREL_RESEARCH,
    OVICULTURE_RESEARCH,
    TAUROLOGY_RESEARCH,
    BEAVER_RESEARCH,
    TORTOISE_RESEARCH,
    EXPLORATION_RESEARCH,
    PRODUCTIVITY_RESEARCH,
    EXPANSION_RESEARCH,
    VILLAGE_RESEARCH,
    SPACESHIP_RESEARCH,
    GOAT_RESEARCH,
    PANDA_RESEARCH,
    RABBIT_RESEARCH,
    PIG_RESEARCH,

    // WOLVES_RESEARCH,
    // SKUNK_RESEARCH,
    // HORSE_RESEARCH,
    // MONKEY_RESEARCH,
    // ELEPHANT_RESEARCH,
    // OWL_RESEARCH,
    // LAMA_RESEARCH,
    // EAGLE_RESEARCH,
    // CROCODILE_RESEARCH,
  ],
};
(window as any).worldData = worldData;
