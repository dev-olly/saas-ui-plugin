import { NODE_TYPES, clone, traverse } from './utils';

import ExampleNode from './example.json';

figma.showUI(__html__, { width: 400, height: 700 });

const createTextNode = (node) => {
  const { characters, fontSize, fontName, textAlignHorizontal, textAlignVertical, ...rest } = node;

  let textNode;

  try {
    (async () => {
      textNode = figma.createText();

      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      textNode.fontName = { family: 'Inter', style: 'Regular' };

      textNode.characters = characters;
      textNode.x = node.x;
      textNode.y = node.y;
      textNode.fills = node.fills;
      textNode.strokes = node.strokes;
      textNode.fontSize = fontSize;
      textNode.name = node.name;

      textNode.textAlignHorizontal = textAlignHorizontal;
      textNode.textAlignVertical = textAlignVertical;

      console.log('rest', rest);
      // assign other properties in the rest, including children
      Object.assign(textNode, rest);
    })();
  } catch (error) {
    console.error(error);
  }
  return textNode;
};

const cloneFills = (createdNodeFills, outgoingNodeFills) => {
  try {
    const fills = clone(createdNodeFills);
    console.log('fills', fills);
    if (!outgoingNodeFills.length || outgoingNodeFills[0].type !== 'SOLID') return [];
    fills[0] = figma.util.solidPaint(outgoingNodeFills[0].color, fills[0]);
    return fills;
  } catch (error) {
    console.log('Error cloning fills', error);
  }
};
const createFrameNode = (node) => {
  const { children, ...rest } = node;
  let frameNode = figma.createFrame();

  console.log('earlier', frameNode);
  frameNode.resize(node.width, node.height);
  frameNode.name = node.name;
  frameNode.x = node.x;
  frameNode.y = node.y;
  // frameNode.width = node.width;
  // frameNode.height = node.height;
  frameNode.rotation = node.rotation;
  frameNode.constraints = node.constraints;

  frameNode.strokes = [...node.strokes];
  frameNode.strokeWeight = node.strokeWeight;
  frameNode.strokeAlign = node.strokeAlign;
  frameNode.cornerRadius = node.cornerRadius;
  frameNode.opacity = node.opacity;
  frameNode.visible = node.visible;
  frameNode.blendMode = node.blendMode;
  frameNode.effects = [...node.effects];
  if (frameNode.fills[0].type === 'SOLID') {
    frameNode.fills = cloneFills(frameNode.fills, node.fills);
  }

  if (children) {
    children.forEach((child) => {
      const childNode = createNode(child);
      if (childNode) {
        frameNode.appendChild(childNode);
      }
    });
  }

  console.log('FrameNode', frameNode);
  return frameNode;
};

const createVectorNode = (node) => {
  const { width, height, vectorPaths, vectorNetwork, ...rest } = node;
  let vectorNode = figma.createVector();
  vectorNode.resize(width, height);
  vectorNode.x = node.x;
  vectorNode.y = node.y;
  // vectorNode.fills = node.fills;
  vectorNode.strokes = node.strokes;
  vectorNode.strokeWeight = node.strokeWeight;
  vectorNode.strokeAlign = node.strokeAlign;
  vectorNode.cornerRadius = node.cornerRadius;
  vectorNode.opacity = node.opacity;
  vectorNode.visible = node.visible;
  vectorNode.blendMode = node.blendMode;
  vectorNode.effects = node.effects;

  // if (vectorNode.fills[0].type === 'SOLID') {
  //   vectorNode.fills = cloneFills(vectorNode.fills, node.fills);
  // }

  if (vectorPaths) {
    vectorNode.vectorPaths = vectorPaths;
  }

  if (vectorNetwork) {
    vectorNode.vectorNetwork = vectorNetwork;
  }

  return vectorNode;
};

const createRectangleNode = (node) => {
  const { width, height, children, ...rest } = node;
  let rectangleNode = figma.createRectangle();
  rectangleNode.resize(width, height);
  rectangleNode.x = node.x;
  rectangleNode.y = node.y;
  rectangleNode.strokes = node.strokes;
  rectangleNode.strokeWeight = node.strokeWeight;
  rectangleNode.strokeAlign = node.strokeAlign;
  rectangleNode.cornerRadius = node.cornerRadius;
  rectangleNode.opacity = node.opacity;
  rectangleNode.visible = node.visible;
  rectangleNode.blendMode = node.blendMode;
  rectangleNode.effects = node.effects;
  rectangleNode.isMask = node.isMask;
  rectangleNode.maskType = node.maskType;

  if (rectangleNode.fills[0].type === 'SOLID') {
    rectangleNode.fills = cloneFills(rectangleNode.fills, node.fills);
  }

  return rectangleNode;
};

const createGroupNode = (node) => {
  const { width, height, children, ...rest } = node;
  const childrenNodes = node.children.map((child) => createNode(child));
  let groupNode = figma.group(childrenNodes, figma.currentPage);
  groupNode.resize(width, height);
  groupNode.name = node.name;
  groupNode.x = node.x;
  groupNode.y = node.y;
  groupNode.rotation = node.rotation;
  groupNode.opacity = node.opacity;
  groupNode.visible = node.visible;
  groupNode.blendMode = node.blendMode;
  groupNode.effects = node.effects;

  // if (groupNode.fills[0].type === 'SOLID') {
  //   groupNode.fills = cloneFills(groupNode.fills, node.fills);
  // }

  return groupNode;
};

const createComponentNode = (node) => {
  const { children, width, height, ...rest } = node;
  let componentNode = figma.createComponent();
  componentNode.resize(width, height);
  componentNode.name = node.name;
  componentNode.x = node.x;
  componentNode.y = node.y;
  componentNode.rotation = node.rotation;
  componentNode.opacity = node.opacity;
  componentNode.visible = node.visible;
  componentNode.blendMode = node.blendMode;
  componentNode.effects = node.effects;
  componentNode.strokes = node.strokes;
  componentNode.strokeWeight = node.strokeWeight;
  componentNode.strokeAlign = node.strokeAlign;
  componentNode.cornerRadius = node.cornerRadius;

  if (componentNode.fills[0].type === 'SOLID') {
    componentNode.fills = cloneFills(componentNode.fills, node.fills);
  }

  if (children) {
    children.forEach((child) => {
      const childNode = createNode(child);
      if (childNode) {
        componentNode.appendChild(childNode);
      }
    });
  }

  return componentNode;
};

const createNode = (node) => {
  const { type, name, children, ...rest } = node;
  console.log('called');
  let newNode;
  switch (type) {
    case NODE_TYPES.TEXT:
      newNode = createTextNode(node);
      break;
    case NODE_TYPES.FRAME:
      newNode = createFrameNode(node);
      break;
    case NODE_TYPES.GROUP:
      newNode = createGroupNode(node);
      break;
    case NODE_TYPES.COMPONENT:
      newNode = createComponentNode(node);
      break;
    case NODE_TYPES.RECTANGLE:
      newNode = createRectangleNode(node);
      break;
    case NODE_TYPES.VECTOR:
      newNode = createVectorNode(node);
      break;

    default:
      break;
  }

  return newNode;
};

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Created ${msg.count} Rectangles`,
    });
  } else if (msg.type === 'log-node') {
    const node = figma.currentPage.selection[0];
    if (node.type === NODE_TYPES.VECTOR) {
      console.log('Vector node', node.vectorNetwork);
    }
    console.log(traverse(figma.currentPage.selection[0]));
    console.log('isMask', node.isMask, node.maskType);
  } else if (msg.type === 'convert-node-to-json') {
    const node = figma.currentPage.selection[0];
    const nodeJSON = JSON.stringify(traverse(node), null, 2);
    // copy to clipboard
    figma.ui.postMessage({
      type: 'copy-to-clipboard',
      message: nodeJSON,
    });
  } else if (msg.type === 'create-node') {
    const node = createNode(ExampleNode);
    console.log('after created', node);
    figma.currentPage.appendChild(node);
    figma.currentPage.selection = [node];
    console.log('Node created');
  }
};
