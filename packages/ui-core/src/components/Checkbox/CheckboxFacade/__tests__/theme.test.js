import { contrast } from '@instructure/ui-themeable/lib/utils/color'
import CheckboxFacade from '../index'

describe('CheckboxFacade.theme', () => {
  describe('with the default theme', () => {
    const variables = CheckboxFacade.generateTheme()

    it('should ensure checkbox meets 3:1 contrast', () => {
      expect(contrast(variables.color, variables.checkedBackground))
        .to.be.above(3)
    })
  })

  describe('with the "canvas-a11y" theme', () => {
    const variables = CheckboxFacade.generateTheme('canvas-a11y')

    it('should ensure checkbox meets 4.5:1 contrast', () => {
      expect(contrast(variables.color, variables.checkedBackground))
        .to.be.above(4.5)
    })
  })
})
