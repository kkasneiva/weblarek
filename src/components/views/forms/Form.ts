import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export interface FormData {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<FormData & Partial<T>> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.form = container instanceof HTMLFormElement
      ? container
      : ensureElement<HTMLFormElement>('form', container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.form);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.form);

    this.form.addEventListener('input', (evt) => {
      const target = evt.target as HTMLInputElement;
      if (!target.name) return;
      this.onInputChange(target.name, target.value);
    });

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  protected onInputChange(field: string, value: unknown) {
    this.events.emit(`${this.form.name}:change`, { field, value });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}