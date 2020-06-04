import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template'
import { $ } from '@core/dom'
import { resizeHandler } from './table.resize'
import { shouldResize, isCell, matrix, nextSelector } from './table.fucntions'
import { TableSelection } from './TableSelection'

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        })
    }

    toHTML() {
        return createTable(20)
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()

        const $cell = this.$root.find('[data-id="0:0"]')
        this.selectCell($cell)
        this.$on('formula:input', text => {
          this.selection.current.text(text)
        })

        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
    }

    onMousedown(event) {
       if (shouldResize(event)) {
            resizeHandler(event, this.$root)
       } else if (isCell(event)) {
           // eslint-disable-next-line no-undef
           const $target = $(event.target)
           if (event.shiftKey) {
               // eslint-disable-next-line no-unused-vars
               const $cells = matrix($target, this.selection.current)
               .map(id=> this.$root.find(`[data-id="${id}"]`))
               this.selection.selectGroup($cells)
           } else {
               this.selection.select($target)
           }
       }
    }

    onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'ArrowDown',
            'ArrowUp'
        ]

        const {key} = event

        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault()
            const id = this.selection.current.id(true)
            const $next = this.$root.find(nextSelector(key, id))
            this.selection.select($next)
            this.selectCell($next)
        }
    }

    onInput(event) {
        this.$emit('table:input', $(event.target))
    }
}

