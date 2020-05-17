import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template'
import { resizeHandler } from './table.resize'
import { shouldResize } from './table.fucntions'


export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            listeners: ['mousedown']
        //   listeners: ['click', 'mousedown', 'mousemove', 'mouseup']
        })
    }

    toHTML() {
        return createTable(20)
    }

    onMousedown(event) {
       if (shouldResize(event)) {
        resizeHandler(event, this.$root)
       }
    }

    // onClick(event) {
    //     console.log('click', event.target)
    // }

    // onMousemove() {
    //     console.log('mousemove')
    // }

    // onMouseup() {
    //     console.log('mouseup')
    // }
}
