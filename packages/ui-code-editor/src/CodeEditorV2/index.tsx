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
import { Component } from 'react'
import { merge, cloneDeep } from 'lodash'

import { EditorState, StateEffect } from '@codemirror/state'
import type { Transaction, TransactionSpec } from '@codemirror/state'
import {
  EditorView,
  highlightSpecialChars,
  highlightActiveLine,
  drawSelection,
  dropCursor,
  keymap
} from '@codemirror/view'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { foldGutter, foldKeymap } from '@codemirror/fold'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { history, historyKeymap } from '@codemirror/history'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import {
  rectangularSelection,
  crosshairCursor
} from '@codemirror/rectangular-selection'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
  indentSelection,
  defaultKeymap,
  indentWithTab
} from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { lintKeymap } from '@codemirror/lint'
import { indentOnInput, indentUnit } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { markdown } from '@codemirror/lang-markdown'
import { json } from '@codemirror/lang-json'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { StreamLanguage } from '@codemirror/stream-parser'

import { testable } from '@instructure/ui-testable'
import { debounce } from '@instructure/debounce'
import type { Debounced } from '@instructure/debounce'
import { withDeterministicId } from '@instructure/ui-react-utils'
import { requestAnimationFrame } from '@instructure/ui-dom-utils'
import type { RequestAnimationFrameType } from '@instructure/ui-dom-utils'

import { ScreenReaderContent } from '@instructure/ui-a11y-content'

import { withStyle, jsx } from '@instructure/emotion'

import generateStyle from './styles'
import generateComponentTheme from './theme'

import { rtlHorizontalArrowKeymap } from './customKeybinding'

import { propTypes, allowedProps } from './props'
import type { CodeEditorV2Props } from './props'

/**
---
category: components
---
@tsProps
**/
@withDeterministicId()
@withStyle(generateStyle, generateComponentTheme)
@testable()
class CodeEditorV2 extends Component<CodeEditorV2Props> {
  static readonly componentId = 'CodeEditorV2'

  static propTypes = propTypes
  static allowedProps = allowedProps
  static defaultProps = {
    language: 'jsx',
    lineNumbers: false,
    highlightActiveLine: true,
    highlightActiveLineGutter: false,
    foldGutter: false,
    lineWrapping: false,
    autofocus: false,
    spellcheck: false,
    direction: 'ltr',
    rtlMoveVisually: false,
    indentOnLoad: false,
    indentOnInput: true,
    indentWithTab: false,
    value: ''
  }

  private readonly _id: string

  ref: HTMLDivElement | null = null

  private _containerRef?: HTMLDivElement
  private _editorView?: EditorView

  private _raf: RequestAnimationFrameType[] = []

  handleRef = (el: HTMLDivElement | null) => {
    const { elementRef } = this.props

    this.ref = el

    if (typeof elementRef === 'function') {
      elementRef(el)
    }
  }

  handleContainerRef = (el: HTMLDivElement | null) => {
    const { containerRef } = this.props

    this._containerRef = el || undefined

    if (typeof containerRef === 'function') {
      containerRef(el)
    }
  }

  public focus() {
    this._raf.push(
      requestAnimationFrame(() => {
        this._editorView?.focus()
      })
    )
  }

  public get hasFocus() {
    return this._editorView?.hasFocus
  }

  public selectAll() {
    if (this._editorView) {
      this.dispatchViewSelection({
        anchor: 0,
        head: this.currentDocValue?.length
      })
    }
  }

  public deselectAll() {
    if (this._editorView) {
      this.dispatchViewSelection({
        anchor: 0,
        head: 0
      })
    }
  }

  public indentAll() {
    this._raf.push(
      requestAnimationFrame(() => {
        if (this._editorView) {
          this.selectAll()

          indentSelection({
            state: this._editorView.state,
            dispatch: (transaction) => {
              this._editorView?.update([transaction])
            }
          })

          this.deselectAll()
        }
      })
    )
  }

  // Attach state effects
  private dispatchViewEffects(effects?: TransactionSpec['effects']) {
    if (!this._editorView || !effects) return

    this._editorView.dispatch({ effects })
  }

  // Dispatch changes to the document
  private dispatchViewChanges(changes?: TransactionSpec['changes']) {
    if (!this._editorView || !changes) return

    this._editorView.dispatch({ changes })
  }

  // Select a portion of the document
  private dispatchViewSelection(selection?: TransactionSpec['selection']) {
    if (!this._editorView || !selection) return

    this._editorView.dispatch({ selection })
  }

  get currentDocValue() {
    return this._editorView?.state.doc
  }

  constructor(props: CodeEditorV2Props) {
    super(props)
    this._id = props.deterministicId!()

    this.refreshEditorValue = debounce(this.refreshEditorValue)
  }

  componentDidMount() {
    const { value, autofocus, indentOnLoad } = this.props

    this.props.makeStyles?.()

    const state = EditorState.create({
      doc: value,
      extensions: this.extensions
    })
    this._editorView = new EditorView({
      state,
      parent: this._containerRef
    })

    if (autofocus) {
      this.focus()
    }

    if (indentOnLoad) {
      this.indentAll()
    }
  }

  componentWillUnmount() {
    this._editorView = undefined

    this._raf.forEach((request) => request.cancel())
    this._raf = []
    ;(this.refreshEditorValue as Debounced).cancel()
  }

  componentDidUpdate(prevProps: CodeEditorV2Props) {
    const { value, indentOnLoad } = this.props

    this.props.makeStyles?.()

    if (this._editorView) {
      if (value !== prevProps.value) {
        this.refreshEditorValue(value)

        if (indentOnLoad) {
          this.indentAll()
        }
      }

      if (this.shouldUpdateEditor(prevProps)) {
        this.refreshExtensions()
      }
    }
  }

  shouldUpdateEditor(prevProps: CodeEditorV2Props) {
    const propsToObserve: (keyof CodeEditorV2Props)[] = [
      'language',
      'readOnly',
      'editable',
      'lineNumbers',
      'highlightActiveLineGutter',
      'foldGutter',
      'lineWrapping',
      'autofocus',
      'spellcheck',
      'direction',
      'rtlMoveVisually',
      'indentOnLoad',
      'indentOnInput',
      'indentWithTab',
      'indentUnit',
      'highlightActiveLine',
      'attachment'
    ]

    for (const prop of propsToObserve) {
      if (this.props[prop] !== prevProps[prop]) {
        return true
      }
    }

    return false
  }

  get extensions() {
    const extensions = [
      ...this.baseExtensions,

      // our custom extensions
      this.languageExtension,
      this.onChangeExtension,
      this.focusListenerExtension
    ]

    if (this.themeExtension) {
      extensions.push(this.themeExtension)
    }
    if (this.props.lineNumbers) {
      extensions.push(lineNumbers())
    }
    if (this.props.highlightActiveLine) {
      extensions.push(highlightActiveLine())
    }
    if (this.props.highlightActiveLineGutter) {
      extensions.push(highlightActiveLineGutter())
    }
    if (this.props.foldGutter) {
      extensions.push(foldGutter())
    }
    if (this.props.lineWrapping) {
      extensions.push(EditorView.lineWrapping)
    }
    if (this.props.editable === false) {
      extensions.push(EditorView.editable.of(false))
    }
    if (this.props.readOnly) {
      extensions.push(EditorState.readOnly.of(true))
    }
    if (this.props.spellcheck) {
      extensions.push(EditorView.contentAttributes.of({ spellcheck: 'true' }))
    }
    if (this.props.direction) {
      extensions.push(
        EditorView.contentAttributes.of({ dir: this.props.direction })
      )
    }
    if (this.props.indentOnInput) {
      extensions.push(indentOnInput())
    }
    if (this.props.indentUnit) {
      extensions.push(indentUnit.of(this.props.indentUnit))
    }

    return extensions
  }

  get baseExtensions() {
    return [
      // The extensions are based on '@codemirror-basic-setup'.
      // It is recommended by CodeMirror, that if we want to configure
      // our editor more precisely, we have to copy the source
      // and adjust it as desired.
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      defaultHighlightStyle.fallback,
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightSelectionMatches(),

      keymap.of(this.keymaps)
    ]
  }

  get keymaps() {
    const keymaps = [
      ...closeBracketsKeymap,
      ...this.commandKeybinding,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...commentKeymap,
      ...completionKeymap,
      ...lintKeymap
    ]

    if (this.props.indentWithTab) {
      keymaps.push(indentWithTab)
    }

    return keymaps
  }

  get commandKeybinding() {
    const { direction, rtlMoveVisually } = this.props

    if (direction === 'rtl' && rtlMoveVisually) {
      // we need to clone the original so that it doesn't get overridden
      return merge(cloneDeep(defaultKeymap), rtlHorizontalArrowKeymap)
    }

    return defaultKeymap
  }

  get themeExtension() {
    const { styles } = this.props

    if (!styles?.theme || !styles.highlightStyle) {
      return
    }

    // const theme = EditorView.theme(styles?.theme)
    // const highlightStyle = HighlightStyle.define(styles?.highlightStyle)

    const theme = EditorView.baseTheme(styles?.theme)
    const highlightStyle = defaultHighlightStyle

    return [theme, highlightStyle]
  }

  get languageExtension() {
    const { language } = this.props

    switch (language) {
      case 'json':
        return json()
      case 'js':
      case 'jsx':
      case 'javascript':
        return javascript({ jsx: true, typescript: true })
      case 'html':
        return html({ matchClosingTags: true, autoCloseTags: true })
      case 'css':
        return css()
      case 'markdown':
        return markdown()
      case 'sh':
      case 'shell':
      case 'bash': // ????
        return StreamLanguage.define(shell)
      case 'yml':
      case 'yaml':
        return StreamLanguage.define(yaml)
      default:
        return javascript({ jsx: true, typescript: true })
    }
  }

  get onChangeExtension() {
    const { onChange } = this.props

    return EditorState.changeFilter.of((transaction: Transaction) => {
      if (!this._editorView) {
        return false
      }

      if (transaction.docChanged) {
        this._raf.push(
          requestAnimationFrame(() => {
            const { value } = this.props
            const newDoc = transaction.newDoc.toString()

            // we call onChange in controlled and uncontrolled mode too
            if (typeof onChange === 'function' && newDoc !== value) {
              onChange(newDoc)
            }
          })
        )
      }

      return true
    })
  }

  get focusListenerExtension() {
    const { onFocus, onBlur } = this.props

    return EditorView.updateListener.of((update) => {
      if (update.focusChanged && this._editorView) {
        if (this.hasFocus && typeof onFocus === 'function') {
          onFocus()
        } else if (typeof onBlur === 'function') {
          onBlur()
        }
      }
    })
  }

  refreshExtensions() {
    this.dispatchViewEffects(StateEffect.reconfigure.of(this.extensions))
  }

  refreshEditorValue(value: CodeEditorV2Props['value']) {
    if (!this._editorView) return

    const currentValue = this.currentDocValue!.toString()

    if (currentValue !== value) {
      this.dispatchViewChanges({
        from: 0,
        to: currentValue.length,
        insert: value || ''
      })
    }
  }

  render() {
    const { label } = this.props

    return (
      <div ref={this.handleRef}>
        <label htmlFor={this._id}>
          <ScreenReaderContent>{label}</ScreenReaderContent>
          <div ref={this.handleContainerRef} />
        </label>
      </div>
    )
  }
}

export default CodeEditorV2
export { CodeEditorV2 }
