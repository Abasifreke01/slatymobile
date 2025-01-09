import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const ChatActive = (props: SvgProps) => {
  return (
    <Svg width={30} height={30} fill="none" {...props}>
      <Path
        fill="currentColor"
        fillRule="evenodd"
        d="m26.067 7.785.216 11.198a2.8 2.8 0 0 1-2.745 2.854l-7 .135-6.89 5.734-.108-5.6-2.8.055a2.8 2.8 0 0 1-2.853-2.746L3.671 8.217a2.8 2.8 0 0 1 2.746-2.853l16.797-.324a2.8 2.8 0 0 1 2.853 2.745Zm-15.316 4.497-2.8.054.054 2.8 2.8-.055-.054-2.8Zm2.8-.054 2.799-.054.054 2.8-2.8.053-.054-2.8Zm8.398-.162-2.8.054.054 2.8 2.8-.055-.054-2.8Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};

export default ChatActive;
