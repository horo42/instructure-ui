---
describes: CodeEditor
---

A wrapper around the popular [CodeMirror](https://codemirror.net/) text editor.

### json

```js
---
example: true
---
<CodeEditorV2
  label='json code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="json"
  value={`{
  "name": "@instructure/ui-code-editor",
  "version": "8.24.2",
  "description": "A UI component library made by Instructure Inc.",
  "author": "Instructure, Inc. Engineering and Product Design",
  "module": "./es/index.js",
  "main": "./lib/index.js",
  "types": "./types/index.d.ts",
  "repository": {
    "type": "git",
    "url": "https://github.com/instructure/instructure-ui.git"
  },
}`}
/>
```

### javascript

```js
---
example: true
---
<CodeEditorV2
  label='javascript code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="javascript"
  value={`const fruit: string = "apple"

function exampleMethod(props: Props) {
  return props ? props.value : null
}

/**
 * This is an example
 * @param {Object} props
 */
const Example = () => {
  return (
    <View as="div" padding={'large'}>
      <Position
        renderTarget={<GoodComponent />}
        placement='end center'
        offsetX='20px'
      >
        <span style={{ padding: '8px', background: 'white' }}>
          Positioned content
        </span>
      </Position>
    </View>
  )
}

render(<Example />)`}
/>
```

### html

```js
---
example: true
---
<CodeEditorV2
  label='html code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="html"
  value={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Example app</title>
  </head>
  <body>
    <div id="app">
      <button onclick="myFunction()">Click me</button>
    </div>

    <script src="script.js"></script>
  </body>
</html>`}
/>
```

### css

```js
---
example: true
---
<CodeEditorV2
  label='css code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="css"
  value={`a {
  text-decoration: none;

  &:hover { text-decoration: underline; }
}

a:link, a:visited, a:hover, a:active {
  background-color: green;
  color: white;
  padding: 10px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

.centertext { text-align: center; }

img { opacity: 0.5; filter: alpha(opacity=50); }`}
/>
```

### markdown

```js
---
example: true
---
<CodeEditorV2
  label='markdown code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="markdown"
  value={`#### The quarterly results look great!

> - Revenue was off the chart.
> - Profits were higher than ever.

*Everything* is going according to **plan**.

---
example: true
---`}
/>
```

### shell

```js
---
example: true
---
<CodeEditorV2
  label='shell code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="shell"
  value={`#!/bin/bash

# example of using arguments to a script
echo "My first name is $1"
echo "My surname is $2"
echo "Total number of arguments is $#"

________________________________________

$ chmod a+x name.sh
$ ./name.sh Hans-Wolfgang Loidl
My first name is Hans-Wolfgang
My surname is Loidl
Total number of arguments is 2`}
/>
```

### yml

```js
---
example: true
---
<CodeEditorV2
  label='yml code editor'
  lineNumbers
  lineWrapping
  highlightActiveLine
  highlightActiveLineGutter
  foldGutter
  spellcheck
  language="yml"
  value={`---
 doe: "a deer, a female deer"
 ray: "a drop of golden sun"
 pi: 3.14159
 xmas: true
 french-hens: 3
 calling-birds:
   - huey
   - dewey
   - louie
   - fred
 xmas-fifth-day:
   calling-birds: four
   french-hens: 3
   golden-rings: 5
   partridges:
     count: 1
     location: "a pear tree"
   turtle-doves: two`}
/>
```

### Playground

```js
---
example: true
render: false
---
class Example extends React.Component {
  state = {
    value: `const asd: string = "asdasd"

yarn install --asdasd

<button onclick="console.log('asd')">
  asdasd
</button>

asdasd {
  display: block;
  opacity: 0;
  margin: 10px
}

{
  "name": "@instructure/ui-code-editor",
  "version": "8.23.0",
  "description": "A UI component library made by Instructure Inc.",
}

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in aliquam erat, sit amet imperdiet arcu. Curabitur cursus et diam in pharetra. Phasellus in ultrices ante. Vestibulum tellus arcu, gravida ac eros eget, vulputate dignissim ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam in libero id felis accumsan tempor. Nulla varius rutrum mollis. Pellentesque enim erat, pellentesque sit amet enim quis, scelerisque imperdiet augue. Vestibulum purus ipsum, maximus sit amet risus quis, venenatis facilisis lacus. Nulla id sollicitudin nisl.'`,
    lang: 'jsx',
    editable: true,
    readOnly: false,
    attachment: 'none',
    lineNumbers: false,
    highlightActiveLine: true,
    highlightActiveLineGutter: false,
    lineWrapping: true,
    spellcheck: false,
    direction: 'ltr',
    rtlMoveVisually: false,
    indentOnLoad: false,
    indentOnInput: true,
    indentWithTab: false,
  }

  textAreaRef = null

  render () {
    const booleanProps = [
      'editable',
      'readOnly',
      'lineNumbers',
      'highlightActiveLine',
      'highlightActiveLineGutter',
      'foldGutter',
      'lineWrapping',
      'spellcheck',
      'rtlMoveVisually',
      'indentOnLoad',
      'indentOnInput',
      'indentWithTab',
    ]
    const booleanPropsState = {}

    booleanProps.forEach(prop => { booleanPropsState[prop] = this.state[prop] })

    return (
      <div>
        <View display="block" margin="small none">
          <FormFieldGroup description="Settings" layout='columns' vAlign='top'>
            <RadioInputGroup
              name="language"
              value={this.state.lang}
              description="language"
              size="small"
              onChange={(e, lang) => {
                this.setState({lang})
              }}
            >
              {[
                'sh',
                'js',
                'json',
                'javascript',
                'jsx',
                'shell',
                'css',
                'html',
                'markdown',
                'yaml',
                'yml',
                'bash'
              ].map(lang => <RadioInput key={lang} label={lang} value={lang} />)}
            </RadioInputGroup>

            <FormFieldGroup
              description='Other props'
              name='Other props'
              rowSpacing='small'
            >
              {booleanProps.map((prop) => (
                <Checkbox
                  label={prop}
                  key={prop}
                  size='small'
                  defaultChecked={this.state[prop]}
                  onChange={() => {
                    this.setState({ [prop]: !this.state[prop] })
                  }}
                />
              ))}
            </FormFieldGroup>

            <FormFieldGroup
              description={<ScreenReaderContent>Other props</ScreenReaderContent>}
              name='Other props'
            >
              <RadioInputGroup
                name="attachment"
                value={this.state.attachment}
                description="attachment"
                size='small'
                onChange={(e, attachment) => {
                  this.setState({attachment})
                }}
              >
                <RadioInput label="none" value={'none'} />
                <RadioInput label="top" value={'top'} />
                <RadioInput label="bottom" value={'bottom'} />
              </RadioInputGroup>

              <RadioInputGroup
                name="direction"
                value={this.state.direction}
                description="direction"
                size="small"
                onChange={(e, direction) => {
                  this.setState({direction})
                }}
              >
                {[
                  'ltr',
                  'rtl',
                ].map(dir => <RadioInput key={dir} label={dir} value={dir} />)}
              </RadioInputGroup>
            </FormFieldGroup>

            <FormFieldGroup description='Value' name='Other props'>
              <TextArea
                label={<ScreenReaderContent>Change value</ScreenReaderContent>}
                height="22rem"
                textareaRef={(e) => { this.textAreaRef = e }}
                maxHeight='22rem'
              />
              <Button onClick={() => {
                this.setState({ value: this.textAreaRef.value })
              }}>
                Update value
              </Button>
            </FormFieldGroup>
          </FormFieldGroup>
        </View>

        <CodeEditorV2
          label='code editor'
          value={this.state.value}
          language={this.state.lang}
          {...booleanPropsState}
          attachment={
            this.state.attachment === 'none' ? undefined : this.state.attachment
          }
          direction={this.state.direction}
          onChange={(value) => {
            // No need to set value from `onChange`,
            // but it can be used as an event listener
            // or for transforming the value.
            // this.setState({ value: value.toUpperCase() })
          }}
        />
      </div>
    )
  }
}



render(<Example />)
```
