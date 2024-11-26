import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const ChatInactive = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M9.333 11.668h.012m4.655 0h.012m4.655 0h.011m-8.178 7H5.833A2.334 2.334 0 0 1 3.5 16.335V7a2.333 2.333 0 0 1 2.333-2.333h16.334A2.333 2.333 0 0 1 24.5 7.001v9.334a2.333 2.333 0 0 1-2.333 2.333h-5.834L10.5 24.501v-5.833Z"
    />
  </Svg>
);

export default ChatInactive;
