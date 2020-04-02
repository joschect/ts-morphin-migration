import * as React from 'react';
export function Button(props: any){
    return null;
}
const icon = "book";
export function ButtonWithIcon() {
    return (<>
        <Button icon={'some-string'}>
            asdf
        </Button>
        <Button icon={{name: 'play', outline: true }} content={"Play"} />
        <Button icon={{name: 'powerpoint', outline: true }} content={"PowerPoint"} />
        <Button icon={icon} content={"Click me"} />
        <Button icon={{name: icon, outline: true}} content={"Click me"} />
        <Button icon={{name: icon ? 'this' : 'that', outline: true}} content={"Click me"} />
        </>)
}
