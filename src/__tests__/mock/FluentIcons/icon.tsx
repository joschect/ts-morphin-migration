import * as React from 'react';
export function Icon(props: any){
  return null;
}

export function ButtonWithIcon() {
  return (<>
    <Icon name={'some-string'} outline xSpacing="none"/>
    <Icon name="some-string" outline={false} xSpacing="none"/>
    <Icon outline name="some-string" xSpacing="none"/>
    <Icon name="some-string" />
  </>)
}
