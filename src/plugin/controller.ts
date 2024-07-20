import { NODE_TYPES, clone, traverse } from './utils';

import ExampleNode from './example.json';

figma.showUI(__html__, { width: 400, height: 700 });

const createTextNode = (node, parent) => {
  const { characters, fontSize, fontName, textAlignHorizontal, textAlignVertical, ...rest } = node;

  let textNode;

  try {
    (async () => {
      textNode = figma.createText();

      parent.appendChild(textNode);

      await figma.loadFontAsync(node.fontName);
      textNode.fontName = node.fontName;

      textNode.characters = characters;
      textNode.x = node.x;
      textNode.y = node.y;
      textNode.strokes = node.strokes;
      textNode.fontSize = fontSize;
      textNode.name = node.name;

      textNode.textAlignHorizontal = textAlignHorizontal;
      textNode.textAlignVertical = textAlignVertical;

      if (textNode.fills[0].type === 'SOLID') {
        textNode.fills = cloneFills(textNode.fills, node.fills);
      }
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
    if (!outgoingNodeFills.length || outgoingNodeFills[0].type !== 'SOLID') return [];
    fills[0] = figma.util.solidPaint(outgoingNodeFills[0].color, fills[0]);
    return fills;
  } catch (error) {
    console.log('Error cloning fills', error);
  }
};
const createFrameNode = (node, parent = undefined) => {
  const { children } = node;
  let frameNode = figma.createFrame();
  if (parent) {
    parent.appendChild(frameNode);
  }

  frameNode.resize(node.width, node.height);
  frameNode.name = node.name;
  frameNode.x = node.x;
  frameNode.y = node.y;
  frameNode.rotation = node.rotation;
  frameNode.constraints = node.constraints;

  frameNode.strokes = [...node.strokes];
  if (node.strokeWeight) {
    frameNode.strokeWeight = node.strokeWeight;
  }
  frameNode.strokeAlign = node.strokeAlign;
  frameNode.opacity = node.opacity;
  frameNode.visible = node.visible;
  frameNode.blendMode = node.blendMode;
  frameNode.effects = [...node.effects];

  // layout properties
  frameNode.layoutAlign = node.layoutAlign;
  frameNode.layoutGrow = node.layoutGrow;
  frameNode.layoutMode = node.layoutMode;
  frameNode.layoutPositioning = node.layoutPositioning;
  frameNode.layoutSizingVertical = node.layoutSizingVertical;
  frameNode.primaryAxisAlignItems = node.primaryAxisAlignItems;
  frameNode.primaryAxisSizingMode = node.primaryAxisSizingMode;
  frameNode.counterAxisSizingMode = node.counterAxisSizingMode;
  frameNode.counterAxisAlignItems = node.counterAxisAlignItems;
  frameNode.counterAxisAlignContent = node.counterAxisAlignContent;

  // padding
  frameNode.paddingLeft = node.paddingLeft;
  frameNode.paddingRight = node.paddingRight;
  frameNode.paddingTop = node.paddingTop;
  frameNode.paddingBottom = node.paddingBottom;
  frameNode.itemSpacing = node.itemSpacing;

  // border radius
  frameNode.bottomLeftRadius = node.bottomLeftRadius;
  frameNode.bottomRightRadius = node.bottomRightRadius;
  frameNode.topLeftRadius = node.topLeftRadius;
  frameNode.topRightRadius = node.topRightRadius;

  if (parent) {
    frameNode.layoutSizingHorizontal = node.layoutSizingHorizontal;
  }
  if (frameNode.fills[0].type === 'SOLID') {
    frameNode.fills = cloneFills(frameNode.fills, node.fills);
  }

  if (children) {
    children.forEach((child) => {
      createNode(child, frameNode);
    });
  }

  return frameNode;
};

const createVectorNode = (node, parent) => {
  const { width, height, vectorPaths, vectorNetwork } = node;
  let vectorNode = figma.createVector();
  parent.appendChild(vectorNode);
  vectorNode.resize(width, height);
  vectorNode.x = node.x;
  vectorNode.y = node.y;
  vectorNode.strokes = node.strokes;
  vectorNode.strokeWeight = node.strokeWeight;
  vectorNode.strokeAlign = node.strokeAlign;
  vectorNode.cornerRadius = node.cornerRadius;
  vectorNode.opacity = node.opacity;
  vectorNode.visible = node.visible;
  vectorNode.blendMode = node.blendMode;
  vectorNode.effects = node.effects;

  // layout properties
  vectorNode.layoutAlign = node.layoutAlign;
  vectorNode.layoutGrow = node.layoutGrow;
  vectorNode.layoutPositioning = node.layoutPositioning;
  vectorNode.layoutSizingVertical = node.layoutSizingVertical;
  vectorNode.layoutSizingHorizontal = node.layoutSizingHorizontal;

  if (vectorPaths) {
    vectorNode.vectorPaths = vectorPaths;
  }

  if (vectorNetwork) {
    vectorNode.vectorNetwork = vectorNetwork;
  }

  return vectorNode;
};

const createRectangleNode = (node, parent) => {
  const { width, height } = node;
  let rectangleNode = figma.createRectangle();
  parent.appendChild(rectangleNode);
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

  // layout properties
  rectangleNode.layoutAlign = node.layoutAlign;
  rectangleNode.layoutGrow = node.layoutGrow;
  rectangleNode.layoutPositioning = node.layoutPositioning;
  rectangleNode.layoutSizingVertical = node.layoutSizingVertical;
  rectangleNode.layoutSizingHorizontal = node.layoutSizingHorizontal;

  if (rectangleNode.fills[0].type === 'SOLID') {
    rectangleNode.fills = cloneFills(rectangleNode.fills, node.fills);
  }

  return rectangleNode;
};

const createGroupNode = (node, parent) => {
  const { width, height } = node;
  const sampleNode = figma.createFrame();
  let groupNode = figma.group([sampleNode], figma.currentPage);
  node.children.map((child) => createNode(child, groupNode));
  sampleNode.remove();

  parent.appendChild(groupNode);
  groupNode.resize(width, height);
  groupNode.name = node.name;
  groupNode.x = node.x;
  groupNode.y = node.y;
  groupNode.rotation = node.rotation;
  groupNode.opacity = node.opacity;
  groupNode.visible = node.visible;
  groupNode.blendMode = node.blendMode;
  groupNode.effects = node.effects;
  // layout properties

  // layout properties
  groupNode.layoutAlign = node.layoutAlign;
  groupNode.layoutGrow = node.layoutGrow;
  groupNode.layoutPositioning = node.layoutPositioning;
  groupNode.layoutSizingVertical = node.layoutSizingVertical;
  groupNode.layoutSizingHorizontal = node.layoutSizingHorizontal;

  return groupNode;
};

const createComponentNode = (node, parent) => {
  const { children, width, height } = node;
  let componentNode = figma.createComponent();
  parent.appendChild(componentNode);
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

  // layout properties
  componentNode.layoutAlign = node.layoutAlign;
  componentNode.layoutGrow = node.layoutGrow;
  componentNode.layoutMode = node.layoutMode;
  componentNode.layoutPositioning = node.layoutPositioning;
  componentNode.layoutSizingVertical = node.layoutSizingVertical;
  componentNode.layoutSizingHorizontal = node.layoutSizingHorizontal;
  componentNode.primaryAxisAlignItems = node.primaryAxisAlignItems;
  componentNode.primaryAxisSizingMode = node.primaryAxisSizingMode;

  // padding
  componentNode.paddingLeft = node.paddingLeft;
  componentNode.paddingRight = node.paddingRight;
  componentNode.paddingTop = node.paddingTop;
  componentNode.paddingBottom = node.paddingBottom;
  componentNode.itemSpacing = node.itemSpacing;

  if (componentNode.fills[0].type === 'SOLID') {
    componentNode.fills = cloneFills(componentNode.fills, node.fills);
  }

  if (children) {
    children.forEach((child) => {
      createNode(child, componentNode);
    });
  }

  return componentNode;
};

const createNode = (node, parent = undefined) => {
  const { type } = node;
  let newNode;
  switch (type) {
    case NODE_TYPES.TEXT:
      newNode = createTextNode(node, parent);
      break;
    case NODE_TYPES.FRAME:
      newNode = createFrameNode(node, parent);
      break;
    case NODE_TYPES.GROUP:
      newNode = createGroupNode(node, parent);
      break;
    case NODE_TYPES.COMPONENT:
      newNode = createComponentNode(node, parent);
      break;
    case NODE_TYPES.INSTANCE:
      newNode = createFrameNode(node, parent);
      break;
    case NODE_TYPES.RECTANGLE:
      newNode = createRectangleNode(node, parent);
      break;
    case NODE_TYPES.VECTOR:
      newNode = createVectorNode(node, parent);
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

    console.log(traverse(node));
  } else if (msg.type === 'convert-node-to-json') {
    const node = figma.currentPage.selection[0];
    const nodeJSON = JSON.stringify(traverse(node), null, 2);
    // copy to clipboard
    figma.ui.postMessage({
      type: 'copy-to-clipboard',
      message: nodeJSON,
    });
  } else if (msg.type === 'create-node') {
    let parentFrame;
    if (ExampleNode.type === NODE_TYPES.FRAME) {
      parentFrame = createFrameNode(ExampleNode);
    }

    parentFrame.layoutMode = ExampleNode.layoutMode;
    parentFrame.resizeWithoutConstraints(ExampleNode.width, ExampleNode.height);

    // createNode(ExampleNode, parentFrame);

    console.log('Node created');
  }
};
