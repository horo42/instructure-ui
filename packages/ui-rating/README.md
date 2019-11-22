---
category: packages
---

## ui-rating

[![npm][npm]][npm-url]
[![build-status][build-status]][build-status-url]
[![MIT License][license-badge]][LICENSE]
[![Code of Conduct][coc-badge]][coc]

A static Rating Component.

### Installation

```sh
yarn add @instructure/ui-rating
```
### Usage

```js
import React from 'react'
import { Rating } from '@instructure/ui-rating'

const MyAvatar = () => {
  return (
    <Rating
      label="Product rating"
      size="small"
      iconCount={5}
      valueNow={3.76}
      valueMax={5}
      margin="x-small medium xx-small none"
    />
  )
}
```

### Components
The `ui-rating` package contains the following:
- [Rating](#Rating)

### Contribute

See the [contributing guidelines](#contributing) for details.

### License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/@instructure/ui-rating.svg
[npm-url]: https://npmjs.com/package/@instructure/ui-rating

[build-status]: https://travis-ci.org/instructure/instructure-ui.svg?branch=master
[build-status-url]: https://travis-ci.org/instructure/instructure-ui "Travis CI"

[license-badge]: https://img.shields.io/npm/l/instructure-ui.svg?style=flat-square
[license]: https://github.com/instructure/instructure-ui/blob/master/LICENSE

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/instructure/instructure-ui/blob/master/CODE_OF_CONDUCT.md