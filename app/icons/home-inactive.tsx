import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const HomeInactive = (props: SvgProps) => (
  <Svg width={25} height={24} fill="none" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M4.523 9.938V21a.75.75 0 0 0 .75.75h4.5v-6.375a1.125 1.125 0 0 1 1.125-1.125h3.75a1.125 1.125 0 0 1 1.125 1.125v6.375h4.5a.75.75 0 0 0 .75-.75V9.937"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="m23.273 12-9.99-9.563c-.233-.248-.781-.25-1.02 0l-9.99 9.562m17.25-3.61V3h-2.25v3.235"
    />
  </Svg>
);

export default HomeInactive;
