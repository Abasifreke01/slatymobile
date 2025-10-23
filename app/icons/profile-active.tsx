import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const ProfileActive = (props: SvgProps) => (
  <Svg width={30} height={30} fill="none" {...props}>
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M10 8.75a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm0 7.5a6.25 6.25 0 0 0-6.25 6.25 3.75 3.75 0 0 0 3.75 3.75h15a3.75 3.75 0 0 0 3.75-3.75A6.25 6.25 0 0 0 20 16.25H10Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default ProfileActive;
