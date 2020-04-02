import * as React from 'react';
export function ButtonGroup(props: any){
  return null;
}

const items = [
  { key: 'emoji', icon: 'emoji', iconOnly: true, title: 'Emoji' },
  { key: 'translation', icon: 'translation', iconOnly: true, title: 'Translation' },
  { key: 'play', icon: 'play', iconOnly: true, title: 'Play' },
];

export function ButtonGroupWithIcons() {
  return (<>
    {/*<ButtonGroup*/}
    {/*  buttons={[*/}
    {/*    { key: 'emoji', icon: 'emoji', iconOnly: true, title: 'Emoji' },*/}
    {/*    { key: 'translation', icon: 'translation', iconOnly: true, title: 'Translation' },*/}
    {/*    { key: 'play', icon: 'play', iconOnly: true, title: 'Play' },*/}
    {/*  ]}*/}
    {/*/>*/}
    {/*<ButtonGroup buttons={items} />*/}
    <ButtonGroup buttons={[{
      icon: {name: 'play', outline: true, tabindex: 0},
    }]} />
  </>)
}
