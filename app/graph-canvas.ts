import {Component,ViewChild,ElementRef,Injectable} from '@angular/core';
import {GraphModel} from "./graph-model/graph-model";
import {GraphControlSettings, GraphProvider} from "./graph-control/control";
import {GraphRenderer, StyleProcessor} from "./graph-control/renderer";

@Component({
  selector: 'graph-canvas',
  inputs: ['width', 'height'],
  template: `<canvas #canvas [attr.width]="width" [attr.height]="height"></canvas>`,
})
export class GraphCanvas {
  private width:number = 640;
  private height:number = 480;
  @ViewChild('canvas') canvas:ElementRef;

  constructor(private provider:GraphProvider, private renderer:GraphRenderer) {
    provider.addModelListener(this.onModelChanged.bind(this))
  }

  get model() {
    return this.provider.model;
  }

  render():void {
    if (this.canvas)
    var canvas = <HTMLCanvasElement>this.canvas.nativeElement;
    var ctx = canvas.getContext("2d");
    if (ctx && this.model) {
      this.renderer.draw(this.model, ctx);
      console.log(this.model);
    }
  }

  onModelChanged(model) {
    this.render();
  }

  ngAfterViewChecked():void {
    this.render();
  }
}
