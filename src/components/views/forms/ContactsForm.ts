import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';

export interface ContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<ContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(events, container);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container
        );
        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container
        );
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}