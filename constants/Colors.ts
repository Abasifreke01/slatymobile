/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#1DE9B6';
const tintColorDark = '#1DE9B6';

export const Colors = {
  primary: '#151320',
  muted: '#3A5A92',
  background: '#151320',
  text: '#fff',
  tint: '#E6F6F4',
  gray: '#6E6E73',
  lightGray: '#DCDCE2',
  green: '#4FEE57',
  lightGreen: '#DBFFCB',
  red: '#EF0827',
  yellow: '#FCC70B',
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#1DE9B6',
    tabIconDefault: '#7A797B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#1DE9B6',
    tabIconDefault: '#7A797B',
    tabIconSelected: tintColorDark,
  },
};
