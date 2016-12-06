import {Component,ViewChild,ElementRef,Injectable} from '@angular/core';
import {GraphModel} from "./graph-model/graph-model";
import {GraphCanvasSettings, GraphCanvasModel} from "./graph-control/control";
import {GraphRenderer, StyleProcessor} from "./graph-control/renderer";

@Component({
  selector: 'graph-canvas',
  inputs: ['width', 'height'],
  template: `<canvas #_canvas [attr.width]="width" [attr.height]="height"></canvas>`,
})
export class GraphCanvas {
  private width:number = 640;
  private height:number = 480;
  @ViewChild('_canvas') _canvas:ElementRef;

  constructor(private provider:GraphCanvasModel, private settings:GraphCanvasSettings, private renderer:GraphRenderer) {
    provider.addModelListener(this.onModelChanged.bind(this))
  }

  get canvas() {
    return this._canvas;
  }

  get model() {
    return this.provider.model;
  }

  render():void {
    if (this._canvas)
    var canvas = <HTMLCanvasElement>this._canvas.nativeElement;
    var ctx = canvas.getContext("2d");
    if (ctx && this.model) {
      this.renderer.draw(this.model, ctx);
    }
  }

  onModelChanged(model) {
    this.render();
  }

  ngOnInit() {
    this.settings.width = this.width;
    this.settings.height = this.height;
  }

  ngAfterViewChecked():void {
    this.render();
  }
}
