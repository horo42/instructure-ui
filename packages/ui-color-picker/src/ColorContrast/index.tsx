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
import { Component, Fragment } from 'react'

import { withStyle, jsx } from '@instructure/emotion'
import { Text } from '@instructure/ui-text'

import { ColorContrastProps } from './props'
import generateStyle from './styles'
import generateComponentTheme from './theme'
import { getContrast2Dec as getContrast } from '@instructure/ui-color-utils/src/contrast'
import {
  hexToRgb,
  colorTohex8
} from '@instructure/ui-color-utils/src/conversions'
import type { RGBAType } from '../ColorMixer/props'

/**
---
category: components
---
@tsProps
**/
@withStyle(generateStyle, generateComponentTheme)
class ColorContrast extends Component<ColorContrastProps> {
  constructor(props: ColorContrastProps) {
    super(props)
  }

  static readonly componentId = 'ColorContrast'
  componentDidMount() {
    this.props.makeStyles?.()
  }

  componentDidUpdate() {
    this.props.makeStyles?.()
  }

  renderStatus = (pass: boolean, description: string) => {
    return (
      <div css={this.props.styles?.statusWrapper}>
        <div
          css={
            pass
              ? this.props.styles?.successDescription
              : this.props.styles?.failureDescription
          }
        >
          {description}
        </div>
        <div style={{ flex: 1 }}>
          <div
            css={
              pass
                ? this.props.styles?.successIndicator
                : this.props.styles?.failureIndicator
            }
          >
            {pass ? this.props.successLabel : this.props.failureLabel}
          </div>
        </div>
      </div>
    )
  }

  renderColorIndicator = (color: string, label: string) => (
    <Fragment>
      <div>
        <div
          css={this.props.styles?.colorIndicator}
          style={{
            backgroundColor: color
          }}
        />
      </div>

      <div>
        <div style={{ wordBreak: 'break-all' }}>{label}</div>
        <div style={{ color: '#6B7780' /* ash */ }}>{color}</div>
      </div>
    </Fragment>
  )
  calcBlendedColor = (c1: RGBAType, c2: RGBAType) => {
    // as decided by design
    const alpha = 1 - (1 - c1.a) * (1 - c2.a)
    return {
      r: (c2.r * c2.a) / alpha + (c1.r * c1.a * (1 - c2.a)) / alpha,
      g: (c2.g * c2.a) / alpha + (c1.g * c1.a * (1 - c2.a)) / alpha,
      b: (c2.b * c2.a) / alpha + (c1.b * c1.a * (1 - c2.a)) / alpha,
      a: 1
    }
  }
  /**
   * We project the first (c1) color into a solid white background and then we project the second (c2) color to
   * the projected forst color. We compare this two, projected colors after
   */
  calcContrast = (c1: string, c2: string) => {
    const c1RGBA = hexToRgb(c1)
    const c2RGBA = hexToRgb(c2)
    const c1OnWhite = this.calcBlendedColor(
      { r: 255, g: 255, b: 255, a: 1 },
      c1RGBA
    )
    const c2OnC1OnWhite = this.calcBlendedColor(c1OnWhite, c2RGBA)

    return getContrast(colorTohex8(c1OnWhite), colorTohex8(c2OnC1OnWhite))
  }
  render() {
    const contrast = this.calcContrast(
      this.props.firstColor,
      this.props.secondColor
    )
    return (
      <div css={this.props.styles?.colorContrast}>
        <Text weight="bold" as="div">
          {this.props.label}
        </Text>
        <Text weight="bold" size="x-large">
          {contrast}:1
        </Text>
        {!this.props.withoutColorpreview && (
          <div
            style={{
              display: 'flex',
              width: '272px',
              marginBottom: '12px',
              marginTop: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                marginRight: '30px'
              }}
            >
              {this.renderColorIndicator(
                this.props.firstColor,
                this.props.firstColorLabel || ''
              )}
            </div>
            <div
              style={{
                display: 'flex'
              }}
            >
              {this.renderColorIndicator(
                this.props.secondColor,
                this.props.secondColorLabel || ''
              )}
            </div>
          </div>
        )}
        {this.renderStatus(contrast >= 4.5, this.props.normalTextLabel)}
        {this.renderStatus(contrast >= 3.5, this.props.largeTextLabel)}
        {this.renderStatus(contrast >= 3.5, this.props.graphicsTextLabel)}
      </div>
    )
  }
}

export { ColorContrast }
export default ColorContrast
