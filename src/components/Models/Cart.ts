import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];

    constructor(private events?: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    add(item: IProduct): void {
        if (this.hasById(item.id)) return;

        this.items = [...this.items, item];
        this.events?.emit('cart:changed');
    }

    remove(item: IProduct): void {
        const prevLen = this.items.length;
        this.items = this.items.filter((i) => i.id !== item.id);
        if (this.items.length !== prevLen) {
            this.events?.emit('cart:changed');
        }
    }

    clear(): void {
        if (this.items.length === 0) return;
        this.items = [];
        this.events?.emit('cart:changed');
    }


    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasById(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}