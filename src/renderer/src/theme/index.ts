import { BrandVariants, createDarkTheme, createLightTheme, Theme } from '@fluentui/react-components'

const nexpict: BrandVariants = {
  10: '#010306',
  20: '#071927',
  30: '#002942',
  40: '#003554',
  50: '#004267',
  60: '#00507A',
  70: '#005D8E',
  80: '#156B9F',
  90: '#2D79AD',
  100: '#4287BB',
  110: '#5694C8',
  120: '#6BA2D3',
  130: '#80B1DD',
  140: '#96BFE6',
  150: '#ACCDEE',
  160: '#C3DBF5',
}

const lightTheme: Theme = {
  ...createLightTheme(nexpict),
}

const darkTheme: Theme = {
  ...createDarkTheme(nexpict),
}

darkTheme.colorBrandForeground1 = nexpict[110]
darkTheme.colorBrandForeground2 = nexpict[120]

export default {
  lightTheme,
  darkTheme,
}
