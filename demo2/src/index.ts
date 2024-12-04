/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

'use strict';

import { engineInit } from "littlejsengine"
import { hookupJsonEditor } from "./editor/json-editor";

let data = {}

hookupJsonEditor(document,
  () => data,
  (d: any) => {
    data = d;
  });
