import { bootstrap }    from '@angular/platform-browser-dynamic';
import { GraphEditor } from './graph-editor';
import {GraphCanvas} from "./graph-canvas";
import {GraphRenderer, StyleProcessor} from "./graph-control/renderer";
import {GraphCanvasSettings, GraphCanvasModel} from "./graph-control/control";
import {EditorInputHandler} from "./graph-control/input";
import {CommandsImpl} from "./graph-control/commands";

bootstrap(GraphEditor, [
  // GraphCanvas
  GraphCanvasModel, GraphCanvasSettings, StyleProcessor, GraphRenderer,
  //GraphEditor
  EditorInputHandler, CommandsImpl ]);
