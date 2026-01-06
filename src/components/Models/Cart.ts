import type { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    add(item: IProduct): void {
        if (this.hasById(item.id)) return;
        this.items = [...this.items, item];
    }

    remove(item: IProduct): void {
        this.items = this.items.filter((i) => i.id !== item.id);
    }

    clear(): void {
        this.items = [];
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