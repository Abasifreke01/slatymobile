import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const FindInactive = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2.5}
      d="M2 3.5h20m-20 8h5.5m-5.5 8h5.5"
    />
    <Path
      stroke="currentColor"
      strokeWidth={2.5}
      d="M15.75 17a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Z"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={3}
      d="m18.5 16 3.5 3.525"
    />
  </Svg>
);
export default FindInactive;
