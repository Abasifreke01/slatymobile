import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const CameraInactive = (props: SvgProps) => (
  <Svg width={28} height={28} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M18.664 4.668a1.167 1.167 0 0 1 1.167 1.167v4.9l6.082-4.259a.583.583 0 0 1 .918.479v14.093a.582.582 0 0 1-.918.478l-6.082-4.258v4.9a1.167 1.167 0 0 1-1.167 1.167H2.331a1.167 1.167 0 0 1-1.167-1.167V5.835a1.167 1.167 0 0 1 1.167-1.167h16.333Zm-1.167 2.333h-14v14h14v-14Zm-8.866 3.3c.089 0 .176.026.25.073l5.081 3.233a.467.467 0 0 1 0 .788l-5.08 3.235a.468.468 0 0 1-.718-.397V10.77a.467.467 0 0 1 .467-.468Zm15.866.014-4.666 3.266v.838l4.666 3.267v-7.371Z"
    />
  </Svg>
);

export default CameraInactive;
