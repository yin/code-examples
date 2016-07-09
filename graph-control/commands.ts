import {NodeId,GraphEdge,GraphNode,GraphModel,GraphEdit} from "../graph-model/graph-model";
import {CanvasControl} from "./control";
import {GraphSelection} from "./selection";

/** EditFunction's are command callbacks, which change the graph _model somehow. */
type EditFunction = (GraphControlEdit)=>void;

/**
 * Provides easy access to common commands, this is to provide undo/redo functionality
 * in the future. Commands are actions done in the commands, which change its state (like
 * creating a node, changing selection) with loss of arbitrary data. Changing selected
 * tool does not fall to this category.
 */
export interface Commands {
  /** Sets current selection, how things get selected (stack cycling) is not part of this state */
  select(selection:GraphSelection);
  /** Handles node and edge creation and removal, moving nodes around */
  updateModel(transform:(GraphControlEdit) => void);
  /** Executes an arbitrary command and places in into undo stack */
  execute(command:ICommand);
}

/** Interface for execution and rollback of commands */
export interface ICommand {
  /**
   * Stores internally all information needed for undoing the action and executes the command.
   */
  redo();
  /**
   * Undoes the changes made by this command. redo() function must be called before this.
   * There's no guaranteed this function is properly implemented for each command properly.
   */
  undo();
}

export class CommandsImpl implements Commands {
  private control:CanvasControl;

  setControl(control:CanvasControl) {
    this.control = control;
  }

  select(selection:GraphSelection) {
    this.execute(new SetSelectionCommand(this.control, selection))
  }

  updateModel(transform:EditFunction) {
    this.execute(new EditCommand(this.control, transform))
  }

  execute(command:ICommand) {
    // TODO: yin: Push the command into the undo stack/graph
    command.redo()
  }
}

class SetSelectionCommand implements ICommand {
  private before:GraphSelection;
  constructor(private control:CanvasControl, private after:GraphSelection) {}
  redo() {
    this.before = this.control.selection;
    this.control.setSelection(this.after);
  }
  undo() {
    this.control.setSelection(this.before);
  }
}

class EditCommand {
  constructor(private control:CanvasControl, private transform:EditFunction) {}

  redo() {
    // TODO yin: For undo to work, we need to wap GraphEdit into a recording proxy.
    this.transform(this.control.edit);
  }
  undo() {
    // TODO yin: Undo function should use the proxy to restore affected parts of the _model
  }
}

class RecordingGraphEditProxy implements GraphEdit {
  dirty:boolean = false;
  private edit:GraphEdit;

  setModel(model:GraphModel) {
    this.edit = model.edit;
  }

  createNode(properties:Object):GraphNode {
    var ret = this.edit.createNode(properties);
    ret && this.markDirty();
    return ret;
  }

  removeNode(node:NodeId):boolean {
    var ret = this.edit.removeNode(node);
    ret && this.markDirty();
    return ret;
  }

  mergeNode(node:GraphNode, properties:Object) {
    this.edit.mergeNode(node, properties);
    this.markDirty();
  }

  createEdge(start:NodeId, end:NodeId, properties:Object):boolean {
    var ret = this.edit.createEdge(start, end, properties);
    ret && this.markDirty();
    return ret;
  }

  removeEdge(start:NodeId, end:NodeId):boolean {
    var ret = this.edit.removeEdge(start, end);
    ret && this.markDirty();
    return ret;
  }

  mergeEdge(edge:GraphEdge, properties:Object) {
    this.edit.mergeEdge(edge, properties);
    this.markDirty();
  }

  private markDirty() {
    this.dirty = true;
  }

  public unmarkDirty() {
    this.dirty = false;
  }
}
