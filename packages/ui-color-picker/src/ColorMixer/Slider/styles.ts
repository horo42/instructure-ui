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

import type { SliderStyle, SliderProps } from './props'
import type { SliderTheme } from '@instructure/shared-types'

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
  componentTheme: SliderTheme,
  props: SliderProps,
  state: any
): SliderStyle => {
  const sliderBackground = props.isColorSlider
    ? {
        background:
          'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
      }
    : {
        background: `linear-gradient(45deg, #C7CDD1 25%, transparent 25%),
      linear-gradient(-45deg, #C7CDD1 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #C7CDD1 75%),
      linear-gradient(-45deg, transparent 75%, #C7CDD1 75%)`,
        backgroundSize: '6px 6px',
        backgroundPosition: '0 0, 0 3px, 3px -3px, -3px 0px'
      }

  return {
    colorSlider: {
      label: 'colorMixerSlider',
      marginTop: 10,
      width: props.width,
      height: props.height,
      position: 'relative'
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
      top: -3,
      left:
        state?.calcSliderPositionFromValue?.(props.value) -
        props.indicatorRadius,
      zIndex: 1
    },
    canvas: {
      borderRadius: props.height,
      width: props.width,
      height: props.height,
      boxSizing: 'border-box',
      ...sliderBackground
    }
  }
}

export default generateStyle
