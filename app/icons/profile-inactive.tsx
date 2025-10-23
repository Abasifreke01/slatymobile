import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const ProfileInactive = (props: SvgProps) => (
  <Svg width={30} height={30} fill="none" {...props}>
    <Path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 22.5a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5 2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 5 22.5Z"
    />
    <Path
      stroke="currentColor"
      strokeWidth={2.5}
      d="M15 12.5A3.75 3.75 0 1 0 15 5a3.75 3.75 0 0 0 0 7.5Z"
    />
  </Svg>
);

export default ProfileInactive;
