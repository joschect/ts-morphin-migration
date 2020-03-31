import * as React from 'react';
export function Button(props: any){
    return null;
}

export function ButtonWithIcon() {
    return (<>
        <Button icon={'some-string'}>
            asdf
        </Button>
        <Button icon={{name: 'play', outline: true }} content={"Play"} />
        <Button icon={{name: 'powerpoint', outline: true }} content={"PowerPoint"} />
        </>)
}
