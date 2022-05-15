/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  ColorPaletteStyle,
  ColorPaletteProps,
  ColorPaletteState
} from './props'
import type { PaletteTheme } from '@instructure/shared-types'

/**
 * ---
 * private: true
 * ---
 * Generates the style object from the theme and provided additional information
 * @param  {Object} componentTheme The theme variable object.
 * @param  {Object} props the props of the component, the style is applied to
 * @param  {Object} state the state of the component, the style is applied to
 * @return {Object} The final style object, which will be used in the component
 */
const generateStyle = (
  componentTheme: PaletteTheme,
  props: ColorPaletteProps,
  state: ColorPaletteState
): ColorPaletteStyle => {
  return {
    ColorPalette: {
      label: 'ColorPalette'
    },
    indicator: {
      width: `${2 * props.indicatorRadius}px`,
      height: `${2 * props.indicatorRadius}px`,
      borderRadius: `${2 * props.indicatorRadius}px`,
      background: 'white',
      position: 'absolute',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: componentTheme.indicatorBorderColor,
      top: state?.colorPosition?.y - props.indicatorRadius,
      left: state?.colorPosition?.x - props.indicatorRadius
    },
    palette: {
      width: props.width,
      height: props.height,
      borderRadius: '5px',
      borderStyle: 'solid',
      borderWidth: '1px',
      boxSizing: 'border-box',
      borderColor: 'rgba(22,29,35,.6)',
      background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)),
      linear-gradient(to right, white, hsl(${props.hue},100%,50%))`
    }
  }
}

export default generateStyle
