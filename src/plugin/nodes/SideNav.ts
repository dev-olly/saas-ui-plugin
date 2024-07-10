import { SideNavIcon, SideNavItem, SideNavText } from '../properties/SideNavItem';

const NAV_ITEM_HEIGHT = 40;
const NAV_ITEM_WIDTH = 200;

export const CreateSideNavItem = async () => {
  const container = figma.createFrame();
  container.resize(NAV_ITEM_WIDTH, NAV_ITEM_HEIGHT);
  Object.assign(container, SideNavItem());

  const iconNode = figma.createRectangle();
  iconNode.resize(24, 24);
  Object.assign(iconNode, SideNavIcon());

  try {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  } catch (error) {
    console.log('here', error);
  }

  const textNode = figma.createText();
  textNode.resize(64, 21);
  textNode.fontName = { family: 'Inter', style: 'Regular' };
  Object.assign(textNode, SideNavText());

  container.appendChild(textNode);
  return container;
};
