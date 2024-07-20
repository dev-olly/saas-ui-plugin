export const rgbToHex = (rgbColor) => {
  // Check if the input is in the correct format
  const rgbRegex = /^(rgba?\()(\d+(\.\d+)?),\s*(\d+(\.\d+)?),\s*(\d+(\.\d+)?)(\s*,\s*([\d.]+)\))?$/;
  const match = rgbColor.match(rgbRegex);

  if (!match) {
    console.error('Invalid RGB color format. Please provide a valid RGB or RGBA color.');
    return null;
  }

  // Extract RGB and alpha values
  const red = parseInt(match[2]);
  const green = parseInt(match[3]);
  const blue = parseInt(match[4]);
  const alpha = match[6] ? parseFloat(match[6]) : 1; // Default to full opacity if alpha is not provided

  // Convert RGB to hex
  const rgbHex = ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);

  // Convert alpha to hex
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase();

  // Combine RGB and alpha hex values
  const hexCode = `#${rgbHex}${alphaHex}`;

  return hexCode;
};

export const hexToRgb = (hexCode, includeAlpha = true) => {
  // Check if the hex code is in the correct format
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
  const match = hexCode.match(hexRegex);

  if (!match) {
    console.error('Invalid hex code format. Please provide a valid hex code.');
    return null;
  }

  // Extract RGB and alpha values
  const red = parseInt(match[1], 16);
  const green = parseInt(match[2], 16);
  const blue = parseInt(match[3], 16);
  const alpha = includeAlpha ? parseInt(match[4] || 'FF', 16) / 255 : undefined;

  const objColor = {
    blendMode: 'NORMAL',
    boundVariables: {},
    color: {
      r: red / 255,
      g: green / 255,
      b: blue / 255,
    },
    opacity: alpha,
    type: 'SOLID',
    visible: true,
  };

  return objColor;
};

export function traverse(node) {
  const obj = {
    id: node.id,
    name: node.name,
    type: node.type,
    children: node.children ? node.children.map((child) => traverse(child)) : undefined,
    width: node.width,
    height: node.height,
    x: node.x,
    y: node.y,
    rotation: node.rotation,
    constraints: node.constraints,
    fills: node.fills,
    strokes: node.strokes,
    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign,
    cornerRadius: node.cornerRadius,
    characters: node.characters,
    fontSize: node.fontSize,
    fontName: node.fontName,
    textAlignHorizontal: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    opacity: node.opacity,
    visible: node.visible,
    blendMode: node.blendMode,
    effects: node.effects,
    vectorNetwork: node.vectorNetwork,
    vectorPaths: node.vectorPaths,
    isMask: node.isMask,
    maskType: node.maskType,
    layoutAlign: node.layoutAlign,
    layoutGrow: node.layoutGrow,
    layoutMode: node.layoutMode,
    layoutPositioning: node.layoutPositioning,
    layoutSizingVertical: node.layoutSizingVertical,
    layoutSizingHorizontal: node.layoutSizingHorizontal,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    counterAxisAlignItems: node.counterAxisAlignItems,
    counterAxisAlignContent: node.counterAxisAlignContent,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    itemSpacing: node.itemSpacing,
  };
  return obj;
}

export const NODE_TYPES = {
  TEXT: 'TEXT',
  FRAME: 'FRAME',
  GROUP: 'GROUP',
  COMPONENT: 'COMPONENT',
  VECTOR: 'VECTOR',
  RECTANGLE: 'RECTANGLE',
};

export function clone(val) {
  return JSON.parse(JSON.stringify(val));
}
