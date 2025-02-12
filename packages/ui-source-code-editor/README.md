---
category: packages
---

## ui-source-code-editor

[![npm][npm]][npm-url]&nbsp;
[![MIT License][license-badge]][license]&nbsp;
[![Code of Conduct][coc-badge]][coc]

A code editor component.

### Components

The `ui-source-code-editor` package contains the following:

- [SourceCodeEditor](#SourceCodeEditor)

### Installation

```sh
yarn add @instructure/ui-source-code-editor
```

### Usage

```js
import React from 'react'
import { SourceCodeEditor } from '@instructure/ui-source-code-editor'

const MyCodeEditor = () => {
  return (
    <SourceCodeEditor
      label="code editor"
      defaultValue='{"foo": "bar"}'
      language="javascript"
      readOnly
    />
  )
}
```

[npm]: https://img.shields.io/npm/v/@instructure/ui-source-code-editor.svg
[npm-url]: https://npmjs.com/package/@instructure/ui-source-code-editor
[license-badge]: https://img.shields.io/npm/l/instructure-ui.svg?style=flat-square
[license]: https://github.com/instructure/instructure-ui/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/instructure/instructure-ui/blob/master/CODE_OF_CONDUCT.md
