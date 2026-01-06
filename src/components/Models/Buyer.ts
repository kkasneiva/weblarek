import type { IBuyer, TPayment, ValidationErrors } from '../../types';

export class Buyer {
    private payment?: TPayment;
    private email = '';
    private phone = '';
    private address = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = undefined;
        this.email = '';
        this.phone = '';
        this.address = '';
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