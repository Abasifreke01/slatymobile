import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const Close = (props: SvgProps) => (
  <Svg width={16} height={16} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M8.003 1.332a6.66 6.66 0 0 1 6.666 6.667 6.66 6.66 0 0 1-6.666 6.666A6.66 6.66 0 0 1 1.336 8a6.66 6.66 0 0 1 6.667-6.667Zm2.393 3.333L8.003 7.06 5.609 4.665l-.94.94L7.063 8l-2.394 2.393.94.94 2.394-2.393 2.393 2.393.94-.94-2.393-2.393 2.393-2.394-.94-.94Z"
    />
  </Svg>
);
export default Close;
