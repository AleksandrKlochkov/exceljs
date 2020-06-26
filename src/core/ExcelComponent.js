import {DomListener} from '@core/DomListener'

export class ExcelComponent extends DomListener {
    constructor($root, options={}) {
        super($root, options.listeners)
        this.name = options.name || ''
        this.emitter = options.emitter
        this.subscribe = options.subscribe || []
        this.store = options.store
        this.unsubscribers = []
        this.storeSub = null

        this.prepare()
    }

    // Возвращаем шаблон
    toHTML() {
        return ''
    }

    // Уведомляем слушателей про события event
    $emit(event, ...args) {
        this.emitter.emit(event, ...args)
    }

    // Подписаться на событие event
    $on(event, fn) {
        const unsub = this.emitter.subscribe(event, fn)
        this.unsubscribers.push(unsub)
    }

    $dispatch(action) {
        this.store.dispatch(action)
    }

    storeChange() {}

    isWatching(key) {
        return this.subscribe.includes(key)
    }

    // $subscribe(fn) {
    //     this.storeSub = this.store.subscribe(fn)
    // }

    // Настраеваеи компонент до init
    prepare() {}

    // Инициалихация компонента
    init() {
        this.initDOMListeners()
    }

    // Удаляем компонент
    destroy() {
        this.removeDOMListeners()
        this.unsubscribers.forEach(unsub => unsub())
        // this.storeSub.unsubscribe()
    }
}
