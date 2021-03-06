import * as createjs from "createjs-module";
import {DFADiagram} from '../diagram';


import {DiagramSelectionLayer, SelectionOverlayLayer} from '../diagram-layers/selection-layer';
import {DiagramNodesLayer} from '../diagram-layers/node-layer';
import {DiagramEdgeLayer} from '../diagram-layers/edge-layer';
import {NodeElement} from '../diagram-layers/node-element';
import {ActionExecutor} from '../diagram-actions/action-executor';
import {DirectorDefaultMode, DirectorEdgeCreationMode} from './director-modes';
import {DiagramEventHandler} from './diagram-event-handler';
import {ExternalCommandsHandler} from './diagram-controls';
import {AlignmentGuidelineLayer} from '../diagram-layers/alignment-guideline-layer';

export class DiagramDirector implements DiagramEventHandler, ExternalCommandsHandler {
  private action_executor = new ActionExecutor();
  public readonly default_mode: DirectorDefaultMode;
  public readonly edge_creation_mode: DirectorEdgeCreationMode;

  private current_mode:DirectorDefaultMode;

  constructor(stage: createjs.Stage,
              diagram: DFADiagram,
              selection_layer: DiagramSelectionLayer,
              node_layer: DiagramNodesLayer,
              edge_layer: DiagramEdgeLayer,
              selection_overlay_layer: SelectionOverlayLayer,
              alignment_guideline_layer: AlignmentGuidelineLayer){

    // create default mode
    this.default_mode = new DirectorDefaultMode(this.action_executor,
                                                      stage,
                                                      diagram,
                                                      selection_layer,
                                                      node_layer,
                                                      edge_layer,
                                                      selection_overlay_layer,
                                                      alignment_guideline_layer);

    // create edge creation mode
    this.edge_creation_mode = new DirectorEdgeCreationMode(this.action_executor,
                                                                  stage,
                                                                  diagram,
                                                                  selection_layer,
                                                                  node_layer,
                                                                  edge_layer,
                                                                  selection_overlay_layer,
                                                                  alignment_guideline_layer);

    this.current_mode = this.default_mode;
  }

  switchMode(mode: DirectorDefaultMode){

    // this check is important, not for performance concerns
    // reloading the same mode can cause problems because
    // the onSwitch and beforeSwitch hooks change the state of the mode
    if(this.current_mode !== mode){
      this.current_mode.beforeSwitchHook();
      this.current_mode  = mode;
      this.current_mode.onSwitchHook();

      this.current_mode.updateDiagram();
    }
  }

  // methods for handling events that occur on different components of the dfa_diagram
  // all methods below should delegate the call to the current_mode mode object

  updateDiagram(){
    this.current_mode.updateDiagram();
  }

  // Selection layer action handlers
  selectionLayerClicked(event: any){
    this.current_mode.selectionLayerClicked(event);
  }

  selectionLayerDoubleClicked(event: any){
    this.current_mode.selectionLayerDoubleClicked(event);
  }

  selectionLayerMouseUp(event: any){
    this.current_mode.selectionLayerMouseUp(event);
  }
  selectionLayerPressDown(event: any){
    this.current_mode.selectionLayerPressDown(event);
  }
  selectionLayerPressMove(event: any){
    this.current_mode.selectionLayerPressMove(event);
  }

  // In response to actions performed on nodes
  nodeClicked(event: any){
    this.current_mode.nodeClicked(event);
  }

  nodeDoubleClicked(node: NodeElement){
    this.current_mode.nodeDoubleClicked(node);
  }

  nodeMouseDown(event: any){
    this.current_mode.nodeMouseDown(event);
  }

  // this method expects drag_offset property to be set on event, by mouseDown event handler
  nodePressMove(event: any){
    this.current_mode.nodePressMove(event);
  }

  nodePressUp(event: any){
    this.current_mode.nodePressUp(event);
  }

  // edge event action handlers
  edgeClicked(event: any){
    this.current_mode.edgeClicked(event);
  }

  edgeDoubleClicked(event: any){
    this.current_mode.edgeDoubleClicked(event);
  }

  edgeMouseDown(event: any){
    this.current_mode.edgeMouseDown(event)
  }

  edgeMouseUp(event: any){
    this.current_mode.edgeMouseUp(event)
  }

  // edge center control point events
  edgeCenterClicked(event: any){
   this.current_mode.edgeCenterClicked(event);
  }
  edgeCenterDoubleClicked(event: any){
    this.current_mode.edgeCenterDoubleClicked(event);
  }
  edgeCenterMouseDown(event: any){
    this.current_mode.edgeCenterMouseDown(event);
  }
  edgeCenterMouseUp(event: any){
    this.current_mode.edgeCenterMouseUp(event);
  }
  edgeCenterPressMove(event: any){
    this.current_mode.edgeCenterPressMove(event);
  }

  // todo delete
  createNewEdge(nodea: NodeElement, nodeb: NodeElement){
    return this.current_mode.createNewEdge(nodea, nodeb);
  }

  undoChanges(){
    this.current_mode.undoChanges();
  }

  redoChanges(){
    this.current_mode.redoChanges();
  }

  deleteSelectedNodesOrEdge(){
    this.current_mode.deleteSelectedNodesOrEdge();
  }

  switchToDefaultMode(){
    this.current_mode = this.default_mode;
  }

  switchToEdgeCreationMode(){
    this.current_mode = this.edge_creation_mode;
  }

  straightenSelectedEdge(){
    this.current_mode.straightenSelectedEdge();
  }

  renameSelectedNode(name: string) {
    this.current_mode.renameSelectedNode(name);
  }

  renameSelectedEdge(name: string){
    this.current_mode.renameSelectedEdge(name);
  }

  changeEdgeLabelPosition(){
    this.current_mode.changeEdgeLabelPosition();
  }
}
