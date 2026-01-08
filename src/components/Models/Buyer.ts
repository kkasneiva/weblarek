import type { IBuyer, TPayment, ValidationErrors } from '../../types';
import type { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private email = '';
    private phone = '';
    private address = '';

    constructor(private events?: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        let changed = false;

        if (data.payment !== undefined && data.payment !== this.payment) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.email !== undefined && data.email !== this.email) {
            this.email = data.email;
            changed = true;
        }
        if (data.phone !== undefined && data.phone !== this.phone) {
            this.phone = data.phone;
            changed = true;
        }
        if (data.address !== undefined && data.address !== this.address) {
            this.address = data.address;
            changed = true;
        }

        if (changed) {
            this.events?.emit('buyer:changed');
        }
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        const hadData =
            this.payment !== null || this.email !== '' || this.phone !== '' || this.address !== '';
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        if (hadData) this.events?.emit('buyer:changed');
    }


    validate(): ValidationErrors<IBuyer> {
        const errors: ValidationErrors<IBuyer> = {};

        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address.trim()) errors.address = 'Введите адрес доставки';
        if (!this.email.trim()) errors.email = 'Укажите email';
        if (!this.phone.trim()) errors.phone = 'Укажите телефон';

        return errors;
    }
}