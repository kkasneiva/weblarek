import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

export interface CardActions {
    onClick?: () => void;
    onButtonClick?: () => void;
}

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement?: HTMLElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: CardActions) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            this.container
        );

        this.priceElement = this.container.querySelector('.card__price') ?? undefined;
        this.buttonElement = this.container.querySelector('.card__button') ?? undefined;

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }

        if (this.buttonElement && actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                actions.onButtonClick?.();
            });
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (!this.priceElement) return;

        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
            this.buttonElement?.setAttribute('disabled', 'true');
        } else {
            this.priceElement.textContent = `${value} синапсов`;
            this.buttonElement?.removeAttribute('disabled');
        }
    }
}