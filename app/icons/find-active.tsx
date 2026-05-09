import * as React from 'react';
import Svg, { G, Mask, Path, SvgProps } from 'react-native-svg';
const FindActive = (props: SvgProps) => (
  <Svg width={26} height={26} fill="none" {...props}>
    <Mask
      id="a"
      width={24}
      height={19}
      x={1}
      y={3}
      maskUnits="userSpaceOnUse"
      // style={{
      //   maskType: 'luminance',
      // }}
    >
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={2.5}
        d="M2.844 4.695 22.84 4.31M2.998 12.694l5.499-.106m-5.345 8.104 5.5-.106"
      />
      <Path
        fill="#fff"
        stroke="#fff"
        strokeWidth={2.5}
        d="M16.85 17.928a4.25 4.25 0 1 0-.164-8.498 4.25 4.25 0 0 0 .165 8.498Z"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeWidth={2.5}
        d="m19.578 16.875 3.567 3.457"
      />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="currentColor"
        d="M.773 1.234 24.77.771l.463 23.996-23.996.463L.773 1.234Z"
      />
    </G>
  </Svg>
);

export default FindActive;
