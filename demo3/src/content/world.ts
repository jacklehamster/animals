import type { Scene } from "../definition/scene";
import { CABANA } from "./definitions/cabana";
import { COW } from "./definitions/cow";
import { DOG } from "./definitions/dog";
import { HOUSE } from "./definitions/house";
import { RIVER } from "./definitions/river";
import { SHEEP } from "./definitions/sheep";
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
import { BLUE_ANIMATION, BLUE_SELECTED_ANIMATION, HOVER_ANIMATION, INDIC_ANIMATION, TRIANGLE_ANIMATION } from "./animations/indicators";
import { SHEEP_ANIMATION, SHEEP_JUMP_ANIMATION, SHEEP_WAIT_ANIMATION } from "./animations/sheep";
import { GRASS_ANIMATION, GRASSLAND_ANIMATION, LAKE_ANIMATION, MOUNTAIN_ANIMATION, PLAIN_ANIMATION, RIVER_ANIMATION, TREE_ANIMATION, TREE_LEAF_ANIMATION, WAVE_ANIMATION } from "./animations/terrain";
import { CLOUD_ANIMATION } from "./animations/cloud";
import { SHADOW_ANIMATION } from "./animations/shadow";
import { CABANA_ANIMATION, HOUSE_ANIMATION } from "./animations/house";
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

export const worldData: Scene = (window as any).worldData = {
  scale: 80,
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
    "cloud": 6,
    "cursor": 7,
  },
  colayers: {
    "house": 1,
    "decor": 2,
    "unit": 3,
  },
  definitions: [
    SHEEP,
    DOG,
    COW,
    RIVER,
    HOUSE,
    CABANA,
  ],
  animations: [
    TRIANGLE_ANIMATION,
    SHEEP_ANIMATION,
    SHEEP_WAIT_ANIMATION,
    SHEEP_JUMP_ANIMATION,
    HOVER_ANIMATION,
    INDIC_ANIMATION,
    BLUE_ANIMATION,
    GRASSLAND_ANIMATION,
    PLAIN_ANIMATION,
    GRASS_ANIMATION,
    TREE_ANIMATION,
    TREE_LEAF_ANIMATION,
    MOUNTAIN_ANIMATION,
    CLOUD_ANIMATION,
    SHADOW_ANIMATION,
    BLUE_SELECTED_ANIMATION,
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
  ],
  menu: [
    SHEEP_MENU,
    HOUSE_MENU,
    COW_MENU,
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
    WOLVES_RESEARCH,
    BOVINE_RESEARCH,
    TORTOISE_RESEARCH,
    GOAT_RESEARCH,
    SQUIRREL_RESEARCH,
    SKUNK_RESEARCH,
    HORSE_RESEARCH,
    MONKEY_RESEARCH,
    PANDA_RESEARCH,
    PIG_RESEARCH,
    ELEPHANT_RESEARCH,
    BEAVER_RESEARCH,
    OWL_RESEARCH,
    LAMA_RESEARCH,
    EAGLE_RESEARCH,
    RABBIT_RESEARCH,
  ],
};
