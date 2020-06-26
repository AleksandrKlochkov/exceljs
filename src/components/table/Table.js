import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template'
import { $ } from '@core/dom'
import { resizeHandler } from './table.resize'
import { shouldResize, isCell, matrix, nextSelector } from './table.fucntions'
import { TableSelection } from './TableSelection'
import * as actions from '@/redux/actions'
import { defaultStyles } from '@/constants'
import {parse} from '@core/parse'

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        })
        console.log(this.store.getState());
    }

    toHTML() {
        return createTable(20, this.store.getState())
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()

        const $cell = this.$root.find('[data-id="0:0"]')

        this.selectCell($cell)

        this.$on('formula:input', value => {
            console.log(value)
          this.selection.current
            .attr('data-value', value)
            .text(parse(value))
          this.updateTextInStore(value)
        })

        this.$on('formula:done', () => {
            this.selection.current.focus()
        })

        this.$on('toolbar:applyStyle', value => {
            this.selection.applyStyle(value)
            this.$dispatch(actions.applyStyle({
                value,
                ids: this.selection.selectedIds
            }))
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
        const styles = $cell.getStyles(Object.keys(defaultStyles));
        console.log('styles', styles)
        this.$dispatch(actions.changeStyles(styles))
    }

    async resizeTable(event) {
        try {
            const data = await resizeHandler(event, this.$root)
            this.$dispatch(actions.tableResize(data))
        } catch (e) {
            console.warn('Resize error', e.message)
        }
    }

    onMousedown(event) {
       if (shouldResize(event)) {
            this.resizeTable(event)
       } else if (isCell(event)) {
           // eslint-disable-next-line no-undef
           const $target = $(event.target)
           if (event.shiftKey) {
               // eslint-disable-next-line no-unused-vars
               const $cells = matrix($target, this.selection.current)
               .map(id=> this.$root.find(`[data-id="${id}"]`))
               this.selection.selectGroup($cells)
           } else {
              this.selectCell($target) // this.selection.select($target)
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

    updateTextInStore(value) {
        this.$dispatch(actions.changeText({
            id: this.selection.current.id(),
            value
        }))
    }

    onInput(event) {
       this.updateTextInStore($(event.target).text())
    }
}

