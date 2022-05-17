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

/** @jsx jsx */
import { withStyle, jsx } from '@instructure/emotion'
import { Component } from 'react'
import ColorPalette from './ColorPalette'
import Slider from './Slider'
import RGBAInput from './RGBAInput'
import { ColorMixerProps, ColorMixerState, HSVType } from './props'
import generateStyle from './styles'
import {
  colorTohex8,
  hexToRgb,
  colorToHsva
} from '@instructure/ui-color-utils/src/conversions'

/**
---
category: components
---
@tsProps
**/
@withStyle(generateStyle)
class ColorMixer extends Component<ColorMixerProps, ColorMixerState> {
  constructor(props: ColorMixerProps) {
    super(props)
    this.state = {
      h: 0,
      s: 0,
      v: 0,
      a: 1,
      internalColor: '',
      test: '#00ffff'
    }
  }
  static readonly componentId = 'ColorMixer'

  static defaultProps = {
    withAlpha: false
  }

  private width = 272
  private paletteHeight = 160
  private sliderHeight = 8
  private sliderIndicatiorRadius = 6
  private paletteIndicatiorRadius = 6

  componentDidMount() {
    this.props.makeStyles?.()
    this.setState({
      h: colorToHsva(this.props.value).h,
      test: colorTohex8(this.props.value)
    })
  }

  componentDidUpdate(prevProps: ColorMixerProps, prevState: ColorMixerState) {
    this.props.makeStyles?.()
    const { h, s, v, a } = this.state
    if (
      prevState.h !== h ||
      prevState.s !== s ||
      prevState.v !== v ||
      prevState.a !== a
    ) {
      this.setState({ internalColor: colorTohex8({ h, s, v, a }) })
      this.props.onChange(colorTohex8({ h, s, v, a }))
    }
    if (
      prevProps.value !== this.props.value &&
      this.state.internalColor !== this.props.value
    ) {
      this.setState({
        ...colorToHsva(this.props.value)
      })
    }
  }

  // internalOnChange(hexColor: string) {
  //   this.setState({ internalColor: hexColor })
  //   this.onChange(hexColor)
  // }
  onOpacityChange = (opacity: number) => {
    this.setState({ a: opacity / 100 })
    // const hsvaColor = {
    //   ...colorToHsva(this.state.test),
    //   h: this.state.h,
    //   a: opacity / 100
    // }
    // console.log(hsvaColor)
    // this.onChange(colorTohex8(hsvaColor))
  }
  onChange(color: string, hue?: number) {
    const newHue = hue || this.state.h
    this.setState({ test: color, h: newHue })
    const newColor =
      color[7] === 'F' && color[8] === 'F' ? color.slice(0, -2) : color
    this.props.onChange(newColor)
  }
  render() {
    const { h, s, v, a } = this.state
    return (
      <div css={this.props.styles?.colorMixer}>
        <span aria-label={`${colorTohex8(this.state.test)}`} aria-live="polite">
          h:{h} s:{s} v:{v}
          <hr></hr>
          <ColorPalette
            width={this.width}
            height={this.paletteHeight}
            indicatorRadius={this.paletteIndicatiorRadius}
            hue={h}
            color={{
              h,
              s,
              v
            }}
            internalColor={{
              ...colorToHsva(this.state.internalColor),
              h
            }}
            onChange={(color: HSVType) => {
              this.setState({ s: color.s, v: color.v })
            }}
          />
          <Slider
            isColorSlider
            width={this.width}
            height={this.sliderHeight}
            indicatorRadius={this.sliderIndicatiorRadius}
            value={h}
            color={colorTohex8(this.state.test)}
            onChange={(hue: number) => {
              this.setState({ h: hue })
              // this.onChange(
              //   colorTohex8({
              //     ...colorToHsva(this.state.test),
              //     h: hue
              //   }),
              //   hue
              // )
            }}
          />
          {this.props.withAlpha && (
            <Slider
              width={this.width}
              height={this.sliderHeight}
              indicatorRadius={this.sliderIndicatiorRadius}
              color={colorTohex8({ h, s, v })}
              value={a}
              onChange={(opacity) => this.setState({ a: opacity / 100 })}
            ></Slider>
          )}
        </span>
        {/* <RGBAInput
          value={hexToRgb(this.state.test)}
          onChange={(color) => this.onChange(colorTohex8(color))}
          withAlpha={this.props.withAlpha}
        /> */}
      </div>
    )
  }
}

export { ColorMixer }
export default ColorMixer
