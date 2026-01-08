import { Card, CardActions } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap } from '../../../utils/constants';
import { IProduct } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

export type CardCatalogData = Pick<
    IProduct,
    'title' | 'price' | 'image' | 'category'
>;

export class CardCatalog extends Card<CardCatalogData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions?: CardActions) {
        super(container, actions);

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            this.container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            this.container
        );
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
}