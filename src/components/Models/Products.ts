import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class Products {
    private items: IProduct[] = [];
    private selected: IProduct | null = null;

    constructor(private events?: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events?.emit('catalog:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getById(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelected(item: IProduct | null): void {
        this.selected = item;
        this.events?.emit('product:selected');
    }


    getSelected(): IProduct | null {
        return this.selected;
    }
}