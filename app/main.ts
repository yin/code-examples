import { bootstrap }    from '@angular/platform-browser-dynamic';
import { GraphEditor } from './graph-editor';
import {GraphCanvas} from "./graph-canvas";
bootstrap(GraphEditor, [GraphCanvas]);
