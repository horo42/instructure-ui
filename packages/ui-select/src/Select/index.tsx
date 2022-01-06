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
import React, { Children, Component } from 'react'

import { createChainedFunction } from '@instructure/ui-utils'
import { testable } from '@instructure/ui-testable'
import { uid } from '@instructure/uid'
import {
  matchComponentTypes,
  omitProps,
  getInteraction
} from '@instructure/ui-react-utils'
import {
  getBoundingClientRect,
  isActiveElement
} from '@instructure/ui-dom-utils'

import { View } from '@instructure/ui-view'
import { Selectable } from '@instructure/ui-selectable'
import { Popover } from '@instructure/ui-popover'
import { TextInput } from '@instructure/ui-text-input'
import { Options } from '@instructure/ui-options'
import {
  IconArrowOpenDownLine,
  IconArrowOpenUpLine
} from '@instructure/ui-icons'

import type { ViewProps } from '@instructure/ui-view'
import type { TextInputProps } from '@instructure/ui-text-input'
import type {
  OptionsItemProps,
  OptionsSeparatorProps
} from '@instructure/ui-options'
import type {
  SelectableProps,
  SelectableRender
} from '@instructure/ui-selectable'

import { withStyle, jsx } from '@instructure/emotion'

import generateStyle from './styles'
import generateComponentTheme from './theme'

import { Group } from './Group'
import { Option } from './Option'

import type { RenderSelectOptionLabel } from './Option/props'

import type { SelectProps } from './props'
import { allowedProps, propTypes } from './props'

/**
---
category: components
tags: autocomplete, typeahead, combobox, dropdown, search, form
---
@tsProps
**/
@withStyle(generateStyle, generateComponentTheme)
@testable()
class Select extends Component<SelectProps> {
  static readonly componentId = 'Select'

  static allowedProps = allowedProps
  static propTypes = propTypes

  static defaultProps = {
    inputValue: '',
    isShowingOptions: false,
    size: 'medium',
    // Leave interaction default undefined so that `disabled` and `readOnly` can also be supplied
    interaction: undefined,
    isRequired: false,
    isInline: false,
    visibleOptionsCount: 8,
    placement: 'bottom stretch',
    constrain: 'window',
    shouldNotWrap: false
  }

  static Option = Option
  static Group = Group

  componentDidMount() {
    this.props.makeStyles?.()
  }

  componentDidUpdate() {
    this.props.makeStyles?.()

    // scroll option into view if needed
    this.scrollToOption(this.highlightedOptionId)
  }

  state = {
    hasInputRef: false
  }

  ref: HTMLInputElement | null = null

  private _defaultId = uid('Select')
  private _inputContainer: HTMLSpanElement | null = null
  private _listView: Element | null = null
  // temporarily stores actionable options
  private _optionIds: string[] = []
  // best guess for first calculation of list height
  private _optionHeight = 36

  focus() {
    this.ref && this.ref.focus()
  }

  get _input() {
    console.warn(
      '_input property is deprecated and will be removed in v9, please use ref instead'
    )

    return this.ref
  }

  get focused() {
    return this.ref ? isActiveElement(this.ref) : false
  }

  get id() {
    return this.props.id || this._defaultId
  }

  get width() {
    return this._inputContainer ? this._inputContainer.offsetWidth : undefined
  }

  get interaction() {
    return getInteraction({ props: this.props })
  }

  get highlightedOptionId(): string | undefined {
    let highlightedOptionId: string | undefined

    Children.toArray(this.props.children).forEach((child) => {
      if (matchComponentTypes(child, [Group])) {
        // group found
        ;(
          Children.toArray((child as Group).props.children) as Option[]
        ).forEach((option) => {
          // check options in group
          if (option.props.isHighlighted) {
            highlightedOptionId = option.props.id
          }
        })
      } else {
        // ungrouped option found
        if ((child as Option).props.isHighlighted) {
          highlightedOptionId = (child as Option).props.id
        }
      }
    })

    return highlightedOptionId
  }

  get selectedOptionId() {
    const selectedOptionId: string[] = []

    Children.toArray(this.props.children).forEach((child) => {
      if (matchComponentTypes(child, [Group])) {
        // group found
        ;(
          Children.toArray((child as Group).props.children) as Option[]
        ).forEach((option) => {
          // check options in group
          if (option.props.isSelected) {
            selectedOptionId.push(option.props.id)
          }
        })
      } else {
        // ungrouped option found
        if ((child as Option).props.isSelected) {
          selectedOptionId.push((child as Option).props.id)
        }
      }
    })

    if (selectedOptionId.length === 1) {
      return selectedOptionId[0]
    }
    if (selectedOptionId.length === 0) {
      return undefined
    }
    return selectedOptionId
  }

  handleInputRef = (node: HTMLInputElement | null) => {
    // ensures list is positioned with respect to input if list is open on mount
    if (!this.state.hasInputRef) {
      this.setState({ hasInputRef: true })
    }

    this.ref = node
    this.props.inputRef?.(node)
  }

  handleListRef = (node: HTMLUListElement | null) => {
    this.props.listRef?.(node)

    // store option height to calculate list maxHeight
    if (node && node.querySelector('[role="option"]')) {
      this._optionHeight = (
        node.querySelector('[role="option"]') as HTMLElement
      ).offsetHeight
    }
  }

  handleInputContainerRef = (node: HTMLSpanElement | null) => {
    this._inputContainer = node
  }

  scrollToOption(id?: string) {
    if (this._listView) {
      const option = this._listView.querySelector(`[id="${id}"]`)
      if (!option) return

      const listItem = option.parentNode
      const parentTop = getBoundingClientRect(this._listView).top
      const elemTop = getBoundingClientRect(listItem).top
      const parentBottom = parentTop + this._listView.clientHeight
      const elemBottom =
        elemTop + (listItem ? (listItem as Element).clientHeight : 0)

      if (elemBottom > parentBottom) {
        this._listView.scrollTop += elemBottom - parentBottom
      } else if (elemTop < parentTop) {
        this._listView.scrollTop -= parentTop - elemTop
      }
    }
  }

  highlightOption(event: React.SyntheticEvent, id: string) {
    const { onRequestHighlightOption } = this.props
    if (id) {
      onRequestHighlightOption?.(event, { id })
    }
  }

  getEventHandlers(): Partial<SelectableProps> {
    const {
      isShowingOptions,
      onRequestShowOptions,
      onRequestHideOptions,
      onRequestSelectOption
    } = this.props

    const highlightedOptionId = this.highlightedOptionId
    const selectedOptionId = this.selectedOptionId

    return this.interaction === 'enabled'
      ? {
          onRequestShowOptions: (event) => {
            onRequestShowOptions?.(event)
            if (selectedOptionId && !Array.isArray(selectedOptionId)) {
              // highlight selected option on show
              this.highlightOption(event, selectedOptionId)
            }
          },
          onRequestHideOptions: (event) => {
            onRequestHideOptions?.(event)
          },
          onRequestHighlightOption: (
            event,
            { id, direction }: { id?: string; direction?: number }
          ) => {
            if (!isShowingOptions) return
            // if id exists, use that
            let highlightId = this._optionIds.indexOf(id!) > -1 ? id : undefined
            if (!highlightId) {
              if (!highlightedOptionId) {
                // nothing highlighted yet, highlight first option
                highlightId = this._optionIds[0]
              } else {
                // find next id based on direction
                const index = this._optionIds.indexOf(highlightedOptionId)
                highlightId =
                  index > -1 ? this._optionIds[index + direction!] : undefined
              }
            }
            if (highlightId) {
              // only highlight if id exists as a valid option
              this.highlightOption(event, highlightId)
            }
          },
          onRequestHighlightFirstOption: (event) => {
            this.highlightOption(event, this._optionIds[0])
          },
          onRequestHighlightLastOption: (event) => {
            this.highlightOption(
              event,
              this._optionIds[this._optionIds.length - 1]
            )
          },
          onRequestSelectOption: (event, { id }) => {
            if (id && this._optionIds.indexOf(id) !== -1) {
              // only select if id exists as a valid option
              onRequestSelectOption?.(event, { id })
            }
          }
        }
      : {}
  }

  renderOption(
    option: Option,
    data: Pick<SelectableRender, 'getOptionProps' | 'getDisabledOptionProps'>
  ) {
    const { getOptionProps, getDisabledOptionProps } = data
    const {
      id,
      isDisabled,
      isHighlighted,
      isSelected,
      renderBeforeLabel,
      renderAfterLabel,
      children
    } = option.props

    const getRenderOptionLabel = (
      renderOptionLabel: RenderSelectOptionLabel
    ): React.ReactNode => {
      return typeof renderOptionLabel === 'function'
        ? renderOptionLabel.bind(null, {
            id,
            isDisabled,
            isSelected,
            isHighlighted,
            children
          })
        : renderOptionLabel
    }

    let optionProps: Partial<OptionsItemProps> = {
      // passthrough props
      ...omitProps(option.props, [
        ...Option.allowedProps,
        ...Options.Item.allowedProps
      ]),
      // props from selectable
      ...getOptionProps({ id }),
      // Options.Item props
      renderBeforeLabel: getRenderOptionLabel(renderBeforeLabel),
      renderAfterLabel: getRenderOptionLabel(renderAfterLabel)
    }
    // should option be treated as highlighted or selected
    if (isSelected) {
      optionProps.variant = 'selected'
    } else if (isHighlighted) {
      optionProps.variant = 'highlighted'
    }
    // should option be treated as disabled
    if (isDisabled) {
      optionProps.variant = 'disabled'
      optionProps = { ...optionProps, ...getDisabledOptionProps() }
    } else {
      // track as valid option if not disabled
      this._optionIds.push(id)
    }

    return <Options.Item {...optionProps}>{children}</Options.Item>
  }

  renderGroup(
    group: Group,
    data: Pick<
      SelectableRender,
      'getOptionProps' | 'getDisabledOptionProps'
    > & {
      isFirstChild: boolean
      isLastChild: boolean
      afterGroup: boolean
    }
  ) {
    const {
      getOptionProps,
      getDisabledOptionProps,
      isFirstChild,
      isLastChild,
      afterGroup
    } = data
    const { id, renderLabel, children, ...rest } = group.props
    const groupChildren: (
      | React.ReactElement<OptionsItemProps>
      | React.ReactElement<OptionsSeparatorProps>
    )[] = []
    // add a separator above
    if (!isFirstChild && !afterGroup) {
      groupChildren.push(<Options.Separator />)
    }
    // create a sublist as a group
    // a wrapping listitem will be created by Options
    groupChildren.push(
      <Options
        id={id}
        as="ul"
        role="group"
        renderLabel={renderLabel}
        {...omitProps(rest, [...Options.allowedProps, ...Group.allowedProps])}
      >
        {Children.map(children as Option[], (child) => {
          return this.renderOption(child, {
            getOptionProps,
            getDisabledOptionProps
          })
        })}
      </Options>
    )
    // add a separator below
    if (!isLastChild) {
      groupChildren.push(<Options.Separator />)
    }

    return groupChildren
  }

  renderList(
    data: Pick<
      SelectableRender,
      'getListProps' | 'getOptionProps' | 'getDisabledOptionProps'
    >
  ) {
    const { getListProps, getOptionProps, getDisabledOptionProps } = data
    const { isShowingOptions, optionsMaxWidth, visibleOptionsCount, children } =
      this.props

    let lastWasGroup = false

    const viewProps: Partial<ViewProps> = isShowingOptions
      ? {
          display: 'block',
          overflowY: 'auto',
          maxHeight: this._optionHeight * visibleOptionsCount!,
          maxWidth: optionsMaxWidth || this.width,
          background: 'primary',
          elementRef: (node: Element | null) => (this._listView = node)
        }
      : { maxHeight: 0 }

    return (
      <View {...viewProps}>
        <Options
          {...getListProps({ as: 'ul', elementRef: this.handleListRef })}
        >
          {isShowingOptions
            ? Children.map(children, (child, index) => {
                if (!child || !matchComponentTypes(child, [Group, Option])) {
                  return // ignore invalid children
                }
                if (matchComponentTypes(child, [Option])) {
                  lastWasGroup = false
                  return this.renderOption(child as Option, {
                    getOptionProps,
                    getDisabledOptionProps
                  })
                }
                if (matchComponentTypes(child, [Group])) {
                  const afterGroup = lastWasGroup
                  lastWasGroup = true
                  return this.renderGroup(child as Group, {
                    getOptionProps,
                    getDisabledOptionProps,
                    // for rendering separators appropriately
                    isFirstChild: index === 0,
                    isLastChild: index === Children.count(children) - 1,
                    afterGroup
                  })
                }
                return
              })
            : null}
        </Options>
      </View>
    )
  }

  renderIcon() {
    const { styles, isShowingOptions } = this.props
    return (
      <span css={styles?.icon}>
        {isShowingOptions ? (
          <IconArrowOpenUpLine inline={false} />
        ) : (
          <IconArrowOpenDownLine inline={false} />
        )}
      </span>
    )
  }

  renderInput(
    data: Pick<SelectableRender, 'getInputProps' | 'getTriggerProps'>
  ) {
    const { getInputProps, getTriggerProps } = data
    const {
      renderLabel,
      inputValue,
      placeholder,
      isRequired,
      shouldNotWrap,
      size,
      isInline,
      width,
      htmlSize,
      messages,
      renderBeforeInput,
      renderAfterInput,
      onFocus,
      onBlur,
      onInputChange,
      onRequestHideOptions,
      ...rest
    } = this.props

    const { interaction } = this
    const passthroughProps = omitProps(rest, Select.allowedProps)
    const { ref, ...triggerProps } = getTriggerProps({ ...passthroughProps })
    const isEditable = typeof onInputChange !== 'undefined'

    // props to ensure screen readers treat uneditable selects as accessible
    // popup buttons rather than comboboxes.
    const overrideProps: Partial<TextInputProps> = !isEditable
      ? {
          role: 'button',
          title: inputValue,
          'aria-autocomplete': undefined
        }
      : {}

    // backdoor to autocomplete attr to work around chrome autofill issues
    if (passthroughProps['autoComplete']) {
      overrideProps.autoComplete = passthroughProps['autoComplete']
    }

    const inputProps: Partial<TextInputProps> = {
      id: this.id,
      renderLabel,
      placeholder,
      size,
      width,
      htmlSize,
      messages,
      value: inputValue,
      inputRef: createChainedFunction(ref, this.handleInputRef),
      inputContainerRef: this.handleInputContainerRef,
      interaction:
        interaction === 'enabled' && !isEditable
          ? 'readonly' // prevent keyboard cursor
          : interaction,
      isRequired,
      shouldNotWrap,
      display: isInline ? 'inline-block' : 'block',
      renderBeforeInput,
      renderAfterInput: renderAfterInput || this.renderIcon(),

      // If `inputValue` is provided, we need to pass a default onChange handler,
      // because TextInput `value` is a controlled prop,
      // and onChange is not required for Select
      // (before it was handled by TextInput's defaultProp)
      onChange:
        typeof onInputChange === 'function'
          ? onInputChange
          : inputValue
          ? () => {}
          : undefined,

      onFocus,
      onBlur: createChainedFunction(onBlur, onRequestHideOptions),
      ...overrideProps
    }

    return <TextInput {...triggerProps} {...getInputProps(inputProps)} />
  }

  render() {
    const {
      constrain,
      placement,
      mountNode,
      assistiveText,
      isShowingOptions,
      styles
    } = this.props
    // clear temporary option store
    this._optionIds = []

    const highlightedOptionId = this.highlightedOptionId
    const selectedOptionId = this.selectedOptionId

    return (
      <Selectable
        highlightedOptionId={highlightedOptionId}
        isShowingOptions={isShowingOptions}
        selectedOptionId={selectedOptionId}
        {...this.getEventHandlers()}
      >
        {({
          getRootProps,
          getInputProps,
          getTriggerProps,
          getListProps,
          getOptionProps,
          getDisabledOptionProps,
          getDescriptionProps
        }) => (
          <span {...getRootProps({ css: styles?.select })}>
            {this.renderInput({ getInputProps, getTriggerProps })}
            <span {...getDescriptionProps()} css={styles?.assistiveText}>
              {assistiveText}
            </span>
            <Popover
              constrain={constrain}
              placement={placement}
              mountNode={mountNode}
              positionTarget={this._inputContainer}
              isShowingContent={isShowingOptions}
              shouldReturnFocus={false}
              withArrow={false}
            >
              {this.renderList({
                getListProps,
                getOptionProps,
                getDisabledOptionProps
              })}
            </Popover>
          </span>
        )}
      </Selectable>
    )
  }
}

export default Select
export { Select }
