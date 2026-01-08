import { Card, CardActions } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { IProduct } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

export type CardPreviewData = Pick<
    IProduct,
    'title' | 'price' | 'image' | 'category' | 'description'
> & {
    buttonText?: string;
    buttonDisabled?: boolean;
};

export class CardPreview extends Card<CardPreviewData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, actions?: CardActions) {
        super(container, actions);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent ?? '');
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        if (this.buttonElement) this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        if (!this.buttonElement) return;
        this.buttonElement.disabled = value;
    }
}
