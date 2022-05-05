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

import { tags } from '@lezer/highlight'

import type { CodeEditorTheme } from '@instructure/shared-types'
import type { CodeEditorV2Props, CodeEditorV2Style } from './props'

/**
 * ---
 * private: true
 * ---
 * Generates the style object from the theme and provided additional information
 * @param  {Object} componentTheme The theme variable object.
 * @param  {Object} props the props of the component, the style is applied to
 * @return {Object} The final style object, which will be used in the component
 */
const generateStyle = (
  componentTheme: CodeEditorTheme,
  props: CodeEditorV2Props
): CodeEditorV2Style => {
  const { attachment } = props

  const attachmentVariants = {
    top: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginTop: '0.25rem',
      marginBottom: 0
    },
    bottom: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      marginBottom: '0.25rem'
    }
  }

  return {
    codeEditorContainer: {
      label: 'codeEditorContainer',
      borderRadius: componentTheme.borderRadius,
      border: componentTheme.border,
      marginBottom: '1rem',
      overflow: 'hidden',
      ...(attachment && attachmentVariants[attachment])
    },
    theme: {
      '&': {
        direction: 'ltr',
        position: 'relative',
        overflow: 'hidden',
        background: componentTheme.background,
        height: 'auto',
        fontFamily: componentTheme.fontFamily,
        fontSize: componentTheme.fontSize,
        margin: 0,
        borderRadius: 0,
        border: 0,
        color: componentTheme.color,
        lineHeight: 1.4375,
        minHeight: '1.4375rem'
      },

      '.cm-lines': {
        padding: `${componentTheme.verticalPadding} 0`,
        cursor: 'text',
        minHeight: '0.0625rem'
      },

      '.cm-scroller': {
        fontFamily: componentTheme.fontFamily,
        lineHeight: 1.4375
      }
    },

    highlightStyle: [
      {
        tag: tags.keyword,
        color: componentTheme.keywordColor,
        fontWeight: 'bold'
      },
      { tag: tags.atom, color: componentTheme.atomColor },
      { tag: tags.number, color: componentTheme.numberColor },
      {
        tag: tags.definition(tags.variableName),
        color: componentTheme.defColor
      },
      { tag: tags.tagName, color: componentTheme.tagColor },
      {
        tag: [tags.typeName, tags.namespace],
        color: componentTheme.typeColor
      },
      {
        tag: tags.link,
        color: componentTheme.linkColor,
        fontStyle: 'italic',
        textDecoration: 'none'
      },
      { tag: tags.heading, color: componentTheme.headerColor },
      { tag: tags.emphasis, fontStyle: 'italic' },
      { tag: tags.strong, fontWeight: 'bold' },
      { tag: tags.strikethrough, textDecoration: 'line-through' },
      {
        tag: [tags.variableName, tags.attributeValue],
        color: componentTheme.variableColor
      },
      {
        tag: tags.propertyName,
        color: componentTheme.propertyColor
      },
      {
        tag: tags.comment,
        color: componentTheme.commentColor,
        fontWeight: 'normal'
      },
      { tag: tags.string, color: componentTheme.stringColor },
      {
        tag: [
          tags.regexp,
          tags.escape,
          tags.deleted,
          tags.special(tags.string)
        ],
        color: componentTheme.secondaryStringColor
      },
      { tag: tags.meta, color: componentTheme.metaColor },
      { tag: tags.contentSeparator, color: componentTheme.hrColor },
      { tag: tags.invalid, color: componentTheme.errorColor },
      { tag: tags.attributeName, color: componentTheme.attributeColor }

      // { tag: tags.link,
      //   textDecoration: "underline" },
      // { tag: tags.heading,
      //   textDecoration: "underline",
      //   fontWeight: "bold" },
      // { tag: tags.emphasis,
      //   fontStyle: "italic" },
      // { tag: tags.strong,
      //   fontWeight: "bold" },
      // { tag: tags.strikethrough,
      //   textDecoration: "line-through" },
      // { tag: tags.keyword,
      //   color: "#708" },
      // { tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
      //   color: "#219" },
      // { tag: [tags.literal, tags.inserted],
      //   color: "#164" },
      // { tag: [tags.string, tags.deleted],
      //   color: "#a11" },
      // { tag: [tags.regexp, tags.escape, /*@__PURE__*/tags.special(tags.string)],
      //   color: "#e40" },
      // { tag: /*@__PURE__*/tags.definition(tags.variableName),
      //   color: "#00f" },
      // { tag: /*@__PURE__*/tags.local(tags.variableName),
      //   color: "#30a" },
      // { tag: [tags.typeName, tags.namespace],
      //   color: "#085" },
      // { tag: tags.className,
      //   color: "#167" },
      // { tag: [/*@__PURE__*/tags.special(tags.variableName), tags.macroName],
      //   color: "#256" },
      // { tag: /*@__PURE__*/tags.definition(tags.propertyName),
      //   color: "#00c" },
      // { tag: tags.comment,
      //   color: "#940" },
      // { tag: tags.meta,
      //   color: "#7a757a" },
      // { tag: tags.invalid,
      //   color: "#f00" }
    ]
  }
}

export default generateStyle
