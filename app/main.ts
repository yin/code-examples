import { bootstrap }    from '@angular/platform-browser-dynamic';
import { GraphEditor } from './graph-editor';
import {GraphCanvas} from "./graph-canvas";
import {GraphRenderer, StyleProcessor} from "./graph-control/renderer";
import {GraphControlSettings, GraphProvider} from "./graph-control/control";

bootstrap(GraphEditor, [ GraphProvider, GraphControlSettings, StyleProcessor, GraphRenderer ]);
