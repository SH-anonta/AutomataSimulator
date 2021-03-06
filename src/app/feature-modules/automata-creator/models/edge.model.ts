import {Node} from "./node.model"
import {Selectable} from './selectable.model';


export class Edge implements Selectable{
  readonly label: string= "";
  readonly source_node: Node;
  readonly destination_node: Node;


  constructor(label: string= '', src_node: Node, dest_node: Node){
    this.label = label;
    this.source_node = src_node;
    this.destination_node = dest_node;
  }


}

