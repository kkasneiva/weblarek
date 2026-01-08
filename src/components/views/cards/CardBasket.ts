import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

export type CardBasketData = Pick<IProduct, 'title' | 'price' | 'id'> & {
    index: number;
};

export class CardBasket extends Card<CardBasketData> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onDelete?: () => void }) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.onDelete?.();
            });
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}