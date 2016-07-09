import { Component, OnInit, ViewChild } from '@angular/core';
import { GraphCanvas } from "./graph-canvas";
import {GraphModel} from "./graph-model/graph-model";
import {Vector2} from "./graph-control/util/vector2";
import {GraphOrientation} from "./graph-model/graph-model";

@Component({
  selector: 'graph-editor',
  inputs: ['width', 'height'],
  template: `
    <div>
      <graph-canvas #qqwwee>Graph display loading...</graph-canvas>
      <p>WARNING: Graph editting not yet implmented!</p>
      <p>Use <strong>CTRL</strong>-key or <strong>ALT</strong>-key to create
      graph edges.</p>
      <p><button id="new-directed">New directed</button> - Reset graph</p>
      <p><button id="new-undirected">New undirected</button> - Reset graph</p>
      <p><button id="find-path">Path</button> - Find shortest path in graph using
      Dijkstra's algorithm</p>
      <p><button id="reset-path">Remove path</button> - Reset path</p>
  </div>`,
  directives: [ GraphCanvas ]
})
export class GraphEditor {
  @ViewChild(GraphCanvas) private graphCanvas:GraphCanvas;
  constructor() {}

  ngAfterContentInit() {
    console.log("GraphEditor init: ", this.graphCanvas)
    var model = new GraphModel(GraphOrientation.Directed);
    var n1 = model.edit.createNode({position: new Vector2(100, 100)});
    var n2 = model.edit.createNode({position: new Vector2(200, 130)});
    var n3 = model.edit.createNode({position: new Vector2(140, 170)});
    var e12 = model.createEdge(n1.id, n2.id, {weight: 3.0});
    var e23 = model.createEdge(n2.id, n3.id, {weight: 2.0});
    var e31 = model.createEdge(n3.id, n1.id, {weight: 1.0});
    this.graphCanvas.setModel(model);
  }
}
