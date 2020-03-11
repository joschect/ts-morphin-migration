import * as React from "react";

import { Persona, IPersonaSharedProps, IPersonaProps } from "office-ui-fabric-react/lib/Persona";
import {IRenderFunction} from "office-ui-fabric-react/lib/Utilities"

const renderCoin: IRenderFunction<IPersonaSharedProps> = (props: IPersonaSharedProps | undefined) => {
    return <div>
        Foo
    </div>
}

export const RenderPersona = (props: any ) => {
  const propsTest = {onRenderCoin: renderCoin, primaryText: "ConstPersona"}
  return (
    <div>
      <Persona {...propsTest} id="d">Persona</Persona>
      {/* include self closing persona check */ }
      <Persona {...propsTest} id="d1"/>
    </div>
  );
};

export const RenderLetPersona = (props: any ) => {
  let propsTest = {onRenderCoin: renderCoin, primaryText: "LetPersona"}
  return (
    <div>
      <Persona {...propsTest}id="ld">Persona</Persona>
      {/* include self closing persona check */ }
      <Persona {...propsTest}/>
    </div>
  );
};

export const RenderPersonaProps = (props: IPersonaProps ) => {
  return (
    <div>
      <Persona {...props} id="pd">Persona</Persona>
      {/* include self closing persona check */ }
      <Persona {...props}/>
    </div>
  );
};