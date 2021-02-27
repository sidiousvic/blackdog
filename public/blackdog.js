import * as utils from "./scripts/utils.js";
import * as elements from "./scripts/elements.js";
import * as models from "./scripts/models.js";
import * as mechanics from "./scripts/mechanics.js";
import * as objects from "./scripts/objects.js";
import { engine } from "./scripts/engine.js";

/**
 *
 * @gamestate
 *
 */
const z = { utils, elements, models, mechanics, objects };

/**
 *
 * @start
 *
 */
engine(z);
