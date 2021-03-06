
// methods that the dfa_diagram exposes to the outside
export interface ExternalCommandsHandler {
  undoChanges();
  redoChanges();
  deleteSelectedNodesOrEdge();

  switchToDefaultMode();
  switchToEdgeCreationMode();

  // node manipulations
  renameSelectedNode(name: string);

  // edge manipulations
  straightenSelectedEdge();
  renameSelectedEdge(name: string);
  changeEdgeLabelPosition();
}
