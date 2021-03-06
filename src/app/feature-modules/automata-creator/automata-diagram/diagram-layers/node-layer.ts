import {DiagramDirector} from '../diagram-director/diagram-director';
import * as createjs from "createjs-module";
import {NodeElement} from './node-element';
import {templateJitUrl} from '@angular/compiler';

export class DiagramNodesLayer extends createjs.Container{
  private nodes: NodeElement[]= [];
  private director: DiagramDirector;
  // selected_nodes: NodeElement[]= [];

  constructor(width: number, height: number) {
    super();

    let nodea = this.createNewNode('A',80,80);
    let nodeb = this.createNewNode('B', 500,100);


    let nodec = this.createNewNode('C',80,380);
    let noded = this.createNewNode('D', 500,400);

    // todo delete, only for debugging convenience
    setTimeout((e)=>{
      console.log('Time out exe');
      let edge = this.director.createNewEdge(nodea, nodeb);

      this.director.updateDiagram();
    }, 100);
  }

  createNewNode(label, x, y): NodeElement{
    let new_node = new NodeElement(label, x, y);
    this.nodes.push(new_node);
    this.addChild(new_node);

    this.setEventListenersToNode(new_node);

    return new_node
  }

  addNode(node: NodeElement) {
    // prevent same node from being inserted twice
    if(this.nodes.findIndex(x => {return x === node;}) == -1){
      this.nodes.push(node);
      this.addChild(node);
    }

  }

  addNodes(nodes: NodeElement[]) {
    for(let x of nodes){
      this.addNode(x);
    }
  }

  getAllNodes(): NodeElement[]{
    return this.nodes;
  }

  selectAllNodes(){
    this.nodes.forEach(x => x.is_selected = true);
  }

  deselectAllNodes(){
    this.nodes.forEach(x => x.is_selected = false);
  }

  deleteSelectedNodes(){
    for(let node of this.nodes){
      if(node.is_selected){
        this.removeChild(node);
      }
    }

    // only keep the nodes that were not selected before deletion
    this.nodes = this.nodes.filter((node: NodeElement)=> { return !node.is_selected} );
  }

  deleteNode(node: NodeElement) {
    let idx = this.nodes.findIndex(x => {return x === node});

    if(idx != -1){
      this.nodes.splice(idx, 1);
      this.removeChild(node);
    }

  }

  deleteNodes(nodes: NodeElement[]){
    for(let x of nodes){
      this.deleteNode(x);
    }
  }

  getSelectedNodes() {
    return this.nodes.filter(x => {return x.is_selected;});
  }

  translateSelectedNodes(tx: number, ty: number){
    for(let node of this.nodes){
      if(node.is_selected){
        node.translatePosition(tx, ty)
      }
    }
  }

  // todo: move this inside NodeElement class to ensure all nodes get listened to
  // all event response task is delegated to a mediator class (DirectorDefaultMode)
  setEventListenersToNode(node: NodeElement){
    // add click listener
    node.on('click', (event: any) => {
      // console.log('Node Click');
      this.director.nodeClicked(event);
    });

    node.on('dblclick', (event: any) => {
      // console.log('Node dbl Click');
      this.director.nodeDoubleClicked(event.currentTarget)
    });
    // node.on('pressup', (event) => {console.log('Node pressup')});


    // IMPORTANT: This method expects the target element to have drag_offset set to where mouse was first clicked (should be set by mousedown event handler)
    // enable drag and drop functionality
    node.on('pressmove', (event: any) =>{
      this.director.nodePressMove(event);
    });

    node.on('pressup', (event: any) =>{
      // console.log('mouse down');
      this.director.nodePressUp(event);
    });

    node.on('mousedown', (event: any) =>{
      // console.log('mouse down');
      this.director.nodeMouseDown(event);
    });
  }

  setDirector(director: DiagramDirector){
    this.director = director;
  }

  getNodeAtStagePosition(x: number, y: number):NodeElement | boolean{
    for(let node of this.nodes){
      let point = node.globalToLocal(x, y);

      if(node.hitTest(point.x, point.y)){

        return node;
      }
    }

    return false;
  }

  // x1, y1 -> top left
  // x2, y2 -> bottom right
  getNodesWithinRect(x1, y1, x2, y2): NodeElement[]{
    return this.nodes.filter((node: NodeElement) =>{
      return node.x >= x1 && node.x <= x2 && node.y >= y1 && node.y <= y2;
    });
  }

  selectNodes(nodes: NodeElement[]){
    for(let node of nodes){
      node.is_selected = true;
    }
  }

  getNodePositions(){
    return this.nodes.map((node: NodeElement)=>{
      return {x: node.x, y: node.y};
    });
  }


  getHorizontallyAlignedNodePositions(target_node: NodeElement, delta: number= 0){
    return this.nodes.filter((node: NodeElement) =>{
      return !this.pointsAreEqual(node, target_node) && Math.abs(node.y - target_node.y) <= delta;
    }).map((x =>{return x.getPosition();}))
  }

  getVerticallyAlignedNodePositions(target_node: NodeElement, delta: number= 0){
    return this.nodes.filter((node: NodeElement) =>{
      return !this.pointsAreEqual(node, target_node) && Math.abs(node.x - target_node.x) <= delta;
    }).map((x =>{return x.getPosition();}))
  }

  // return the position of nodes
  getAlmostAlignedNodePositions(target_node: NodeElement, delta: number= 0){
    return {
      horizontal: this.getHorizontallyAlignedNodePositions(target_node, delta),
      vertical: this.getVerticallyAlignedNodePositions(target_node, delta)
    }
  }

  private pointsAreEqual(a, b){
    return a.x == b.x && a.y == b.y;
  }
}
