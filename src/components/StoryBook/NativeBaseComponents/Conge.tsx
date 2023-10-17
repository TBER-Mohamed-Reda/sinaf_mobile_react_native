import React from "react";
import { Heading } from "native-base";

export function Example() {

  return <Heading fontSize="5xl" style={{
    textShadowColor: 'rgba(210, 210, 210, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    color: '#fff'
  }}>30</Heading>;
}
