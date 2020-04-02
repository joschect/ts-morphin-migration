const componentsWithCollectionContainingIcon = [
  'ButtonGroup',
  'Button.Group',
  'Menu',
  'Toolbar',
  'ToolbarMenu',
  'Toolbar.Menu',
  'ReactionGroup',
  'Reaction.Group',
  'MenuButton',
  // tmp components
  'ContextMenu',
];

export const mapComponentToCollectionPropName: any = {
  'ButtonGroup': 'buttons',
  'Button.Group': 'buttons',
  'Menu': 'items',
  'Toolbar': 'items',
  'ReactionGroup': 'items',
  'Reaction.Group': 'items',
  'ToolbarMenu': 'items',
  'Toolbar.Menu': 'items',
  'MenuButton': 'menu',
  'ContextMenu': 'items'
};

export default componentsWithCollectionContainingIcon;

