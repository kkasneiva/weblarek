import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface BasketData {
    items: HTMLElement[];
    total: number;
    canOrder: boolean;
}

export class Basket extends Component<BasketData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected titleElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.modal__title', this.container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(value: HTMLElement[]) {
        if (value.length === 0) {
            this.listElement.replaceChildren();
            return;
        }
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    set canOrder(value: boolean) {
        this.buttonElement.disabled = !value;
    }
}