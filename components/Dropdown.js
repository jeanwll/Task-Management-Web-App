import { reactive, html } from '../js/arrow.js'
import { generateId } from '../js/generateId.js'

export class Dropdown {
    elId = `dropdown_${generateId()}`
    
    clickHandler = e => this.onClick(e)
    keyHandler = e => this.onKey(e)

    data = reactive({
        isOpen: false
    })

    constructor(items) {
        this.items = items
    }

    toggle() {
        if (this.data.isOpen) this.close()
        else this.open()
    }

    open() {
        this.data.isOpen = true

        addEventListener('pointerdown', this.clickHandler, true)
        addEventListener('keydown', this.keyHandler, true)
    }

    close() {
        removeEventListener('pointerdown', this.clickHandler, true)
        removeEventListener('keydown', this.keyHandler, true)

        this.data.isOpen = false
    }

    onClick(e) {
        if (e.target.closest(`#${this.elId}`)) return

        this.close()
    }

    onKey(e) {
        if (e.key != 'Escape') return
        
        this.close()
        
        e.preventDefault()
    }

    render() {
        return html`
        
        <div class="dropdown" id="${this.elId}">
            <button class="dropdown__toggle"
                type="button"
                aria-haspopup="true"
                aria-expanded="${() => this.data.isOpen}"
                @click="${() => this.toggle()}">
                
                <span class="visually-hidden">Toggle menu</span>
            </button>
            
            ${() => this.renderMenu()}
        </div>

        `
    }

    renderMenu() {
        if (!this.data.isOpen) return ''

        return html`
        
        <menu class="dropdown__menu"
            aria-labelledby="${this.elId}">
            
            ${this.renderItems()}
        </menu>

        `
    }

    renderItems() {
        return this.items.map(({ text, style, action }) => {
            const className = style ? ` dropdown__item--${style}` : ''

            return html`
            
            <li class="dropdown__item${className} | text text--l">
                <button class="dropdown__btn" type="button"
                    @click="${() => { action(); this.close() }}">
                    
                    ${text}
                </button>
            </li>

            `
        })
    }
}