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
 * The above copyrigfht notice and this permission notice shall be included in all
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
import React, { Component } from 'react'
import { withStyle, jsx } from '@instructure/emotion'
import { View } from '@instructure/ui-view'
import shallowCompare from '../utils/shallowCompare'
import { ColorPaletteProps, ColorPaletteState } from './props'
import { HSVType } from '../props'
import generateStyle from './styles'

/**
@tsProps
**/
@withStyle(generateStyle)
class ColorPalette extends Component<ColorPaletteProps, ColorPaletteState> {
  constructor(props: ColorPaletteProps) {
    super(props)
    this.state = {
      colorPosition: { x: 0, y: 0 }
    }
  }
  paletteRef: HTMLDivElement | null = null

  componentDidMount() {
    this.props.makeStyles?.(this.state)
    this.setState({
      colorPosition: this.calcPositionFromColor(this.props.color)
    })
  }

  componentDidUpdate(prevProps: ColorPaletteProps) {
    this.props.makeStyles?.(this.state)

    if (shallowCompare(prevProps.color, this.props.color)) {
      this.setState({
        colorPosition: this.calcPositionFromColor(this.props.color)
      })
    }
  }
  componentWillUnmount() {
    this.removeEventListeners()
  }

  calcSaturation = (position: number) =>
    Math.round((position / this.props.width) * 100) / 100
  calcLuminance = (position: number) =>
    Math.round(((this.props.height - position) / this.props.height) * 100) / 100

  calcPositionFromColor(hsv: HSVType) {
    const { s, v } = hsv
    return {
      x: s * this.props.width,
      y: this.props.height - v * this.props.height
    }
  }
  //TODO remove any
  handlePaletteMouseDown(e: React.MouseEvent<any, MouseEvent>) {
    this.handleChange(e)
    //TODO remove any
    window.addEventListener('mousemove', this.handleChange as any)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.removeEventListeners()
  }

  removeEventListeners() {
    //TODO remove any
    window.removeEventListener('mousemove', this.handleChange as any)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  calcColorPosition(clientX: number, clientY: number) {
    const { x, y } = this.paletteRef!.getBoundingClientRect()

    return this.applyBoundaries(clientX - x, clientY - y)
  }

  applyBoundaries(x: number, y: number) {
    let newXPosition = x
    let newYPosition = y
    if (x > this.props.width) {
      newXPosition = this.props.width
    }
    if (x < 0) {
      newXPosition = 0
    }
    if (y > this.props.height) {
      newYPosition = this.props.height
    }
    if (y < 0) {
      newYPosition = 0
    }
    return { newXPosition, newYPosition }
  }

  handleChange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e
    const { newXPosition, newYPosition } = this.calcColorPosition(
      clientX,
      clientY
    )
    this.setState({
      colorPosition: { x: newXPosition, y: newYPosition }
    })

    this.props.onChange({
      h: this.props.hue,
      s: this.calcSaturation(newXPosition),
      v: this.calcLuminance(newYPosition)
    })
  }
  //TODO remove any
  handleKeyDown(e: React.KeyboardEvent<any>) {
    const { key } = e
    if (key === 'Tab') return
    e.preventDefault()
    let deltaX = 0
    let deltaY = 0
    if (key === 'ArrowLeft' || key === 'a') {
      deltaX = -2
    }
    if (key === 'ArrowRight' || key === 'd') {
      deltaX = 2
    }
    if (key === 'ArrowUp' || key === 'w') {
      deltaY = -2
    }
    if (key === 'ArrowDown' || key === 's') {
      deltaY = 2
    }

    const { newXPosition, newYPosition } = this.applyBoundaries(
      this.state.colorPosition.x + deltaX,
      this.state.colorPosition.y + deltaY
    )

    this.setState({
      colorPosition: { x: newXPosition, y: newYPosition }
    })
    this.props.onChange({
      h: this.props.hue,
      s: this.calcSaturation(newXPosition),
      v: this.calcLuminance(newYPosition)
    })
  }

  render() {
    return (
      <View
        position="relative"
        width={this.props.width}
        height={this.props.height}
        background="transparent"
        margin="xx-small"
        display="inline-block"
        borderRadius="medium"
        borderWidth="0"
        padding="0"
        as="button"
        onKeyDown={(e) => this.handleKeyDown(e)}
        onMouseDown={(e) => this.handlePaletteMouseDown(e)}
      >
        <div css={this.props.styles?.indicator} />
        <div
          css={this.props.styles?.palette}
          ref={(ref) => {
            this.paletteRef = ref
          }}
        />
      </View>
    )
  }
}

export default ColorPalette
