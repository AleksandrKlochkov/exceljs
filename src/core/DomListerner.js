export class DomListerner {
    constructor($root) {
        if (!$root) {
            throw new Error(`No $root provider for DomListener!`)
        }
        this.$root = $root
    }
}
