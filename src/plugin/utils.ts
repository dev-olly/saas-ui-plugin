export const rgbToHex = (rgbColor) => {
  // Check if the input is in the correct format
  const rgbRegex = /^(rgba?\()(\d+),\s*(\d+),\s*(\d+)(\s*,\s*([\d.]+)\))?$/;
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

  // Construct RGB or RGBA string
  const rgbString = `rgb(${red}, ${green}, ${blue})`;
  const rgbaString = includeAlpha ? `rgba(${red}, ${green}, ${blue}, ${alpha})` : undefined;

  return objColor;
};
