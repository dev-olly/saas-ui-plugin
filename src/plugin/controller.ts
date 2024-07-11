import { CreateSideNavItem } from './nodes/SideNav';
import { traverse } from './utils';

figma.showUI(__html__, { width: 400, height: 700 });

figma.ui.onmessage = async (msg) => {
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
    console.log(figma.currentPage.selection[0]);
  } else if (msg.type === 'create-component') {
    console.log('Create a component');
    const componentNode = await CreateSideNavItem();
    figma.currentPage.appendChild(componentNode);

    figma.currentPage.selection = [componentNode];
    figma.viewport.scrollAndZoomIntoView([componentNode]);
  } else if (msg.type === 'convert-node-to-json') {
    const node = figma.currentPage.selection[0];
    const nodeJSON = JSON.stringify(traverse(node), null, 2);
    // copy to clipboard
    figma.ui.postMessage({
      type: 'copy-to-clipboard',
      message: nodeJSON,
    });
  }
};
