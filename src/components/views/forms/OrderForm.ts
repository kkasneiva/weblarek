import { ensureAllElements, ensureElement } from '../../../utils/utils';
import { TPayment } from '../../../types';
import { IEvents } from '../../base/Events';
import { Form } from './Form';

export interface OrderFormData {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<OrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>(
            '.order__buttons .button',
            this.container
        );
        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            this.container
        );

        this.paymentButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.payment = btn.name as TPayment;
                this.onInputChange('payment', btn.name as TPayment);
            });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentButtons.forEach((btn) => {
            btn.classList.toggle('button_alt-active', btn.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}