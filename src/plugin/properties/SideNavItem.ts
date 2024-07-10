import { hexToRgb } from '../utils';

export const SideNavText = () => ({
  fills: [hexToRgb('#ffffff')],
  // fontSize: 14,
  characters: 'Home',
  x: 48,
  y: 9.5,
});

export const SideNavIcon = () => ({
  fills: [hexToRgb('#ffffff')],
  x: 8,
  y: 8,
});

export const SideNavItem = () => ({
  fills: [hexToRgb('#000000')],
});
