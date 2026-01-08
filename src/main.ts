import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';

import { CardCatalog } from './components/views/cards/CardCatalog';
import { CardPreview } from './components/views/cards/CardPreview';
import { CardBasket } from './components/views/cards/CardBasket';

import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/forms/OrderForm';
import { ContactsForm } from './components/views/forms/ContactsForm';
import { Success } from './components/views/Success';

import type { IProduct, TPayment } from './types';


const getImageUrl = (image: string) => {
  return `${CDN_URL}/${image}`;
};

import type { IBuyer, ValidationErrors } from './types';

const ORDER_STEP_FIELDS: Array<keyof IBuyer> = ['payment', 'address'];
const CONTACTS_STEP_FIELDS: Array<keyof IBuyer> = ['email', 'phone'];

function getStepValidation(
  errors: ValidationErrors<IBuyer>,
  fields: Array<keyof IBuyer>
): { valid: boolean; errorsText: string } {
  const messages = fields
    .map((f) => errors[f])
    .filter((v): v is string => Boolean(v));

  return {
    valid: messages.length === 0,
    errorsText: messages.join('. '),
  };
}

const events = new EventEmitter();

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketView = new Basket(events, cloneTemplate('#basket'));
const orderForm = new OrderForm(events, cloneTemplate('#order'));
const contactsForm = new ContactsForm(events, cloneTemplate('#contacts'));
const successView = new Success(events, cloneTemplate('#success'));

let orderStep: 1 | 2 = 1;

events.on('catalog:changed', () => {
  const items = productsModel.getItems();

  const cards = items.map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });

    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: getImageUrl(item.image),
    });
  });

  gallery.render({ catalog: cards });
});

events.on<IProduct>('product:selected', () => {
  const item = productsModel.getSelected();
  if (!item) return;

  const inCart = cartModel.hasById(item.id);

  const preview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onButtonClick: () => events.emit('product:toggle', item),
  });


  const buttonDisabled = item.price === null;
  const buttonText = buttonDisabled ? 'Недоступно' : (inCart ? 'Удалить из корзины' : 'Купить');

  modal.open();
  modal.render({
    content: preview.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: getImageUrl(item.image),
      description: item.description,
      buttonText,
      buttonDisabled,
    }),
  });
});

events.on('cart:changed', () => {
  header.render({ counter: cartModel.getCount() });
});

events.on('basket:open', () => {
  renderBasketModal();
});

events.on<IProduct>('card:select', (item) => {
  productsModel.setSelected(item);
});

events.on<IProduct>('product:toggle', (item) => {
  if (item.price === null) return;

  if (cartModel.hasById(item.id)) {
    cartModel.remove(item);
  } else {
    cartModel.add(item);
  }

  modal.close();
});

events.on<IProduct>('basket:item:remove', (item) => {
  cartModel.remove(item);
  renderBasketModal();
});

events.on('order:open', () => {
  orderStep = 1;

  buyerModel.clear();

  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const step = getStepValidation(errors, ORDER_STEP_FIELDS);

  modal.open();
  modal.render({
    content: orderForm.render({
      valid: step.valid,
      errors: step.errorsText,
      payment: buyer.payment,
      address: buyer.address,
    }),
  });
});

// изменения в форме заказа
events.on<{ field: string; value: unknown }>('order:change', ({ field, value }) => {
  if (field === 'payment') {
    buyerModel.setData({ payment: value as TPayment });
  }

  if (field === 'address') {
    buyerModel.setData({ address: String(value ?? '') });
  }

  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const step = getStepValidation(errors, ORDER_STEP_FIELDS);

  orderForm.render({
    valid: step.valid,
    errors: step.errorsText,
    payment: buyer.payment,
    address: buyer.address,
  });
});

events.on('order:submit', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const step = getStepValidation(errors, ORDER_STEP_FIELDS);

  if (!step.valid) {
    orderForm.render({
      valid: false,
      errors: step.errorsText,
      payment: buyer.payment,
      address: buyer.address,
    });
    return;
  }

  orderStep = 2;

  const contactsErrors = buyerModel.validate();
  const contactsStep = getStepValidation(contactsErrors, CONTACTS_STEP_FIELDS);

  modal.render({
    content: contactsForm.render({
      valid: contactsStep.valid,
      errors: contactsStep.errorsText,
      email: buyer.email,
      phone: buyer.phone,
    }),
  });
});

// изменения в контактах
events.on<{ field: string; value: unknown }>('contacts:change', ({ field, value }) => {
  if (field === 'email') buyerModel.setData({ email: String(value ?? '') });
  if (field === 'phone') buyerModel.setData({ phone: String(value ?? '') });

  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const step = getStepValidation(errors, CONTACTS_STEP_FIELDS);

  contactsForm.render({
    valid: step.valid,
    errors: step.errorsText,
    email: buyer.email,
    phone: buyer.phone,
  });
});

events.on('contacts:submit', () => {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const step = getStepValidation(errors, CONTACTS_STEP_FIELDS);

  if (!step.valid) {
    contactsForm.render({
      valid: false,
      errors: step.errorsText,
      email: buyer.email,
      phone: buyer.phone,
    });
    return;
  }

  const items = cartModel.getItems().map((p) => p.id);
  const total = cartModel.getTotal();
  if (items.length === 0) return;

  larekApi.postOrder({
    payment: buyer.payment as TPayment,
    address: buyer.address,
    email: buyer.email,
    phone: buyer.phone,
    total,
    items,
  })
    .then(() => {
      modal.render({
        content: successView.render({ total }),
      });

      cartModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      contactsForm.render({
        valid: true,
        errors: 'Ошибка оплаты. Попробуйте ещё раз.',
      });

      console.error('Ошибка при отправке заказа:', err);
    });
});

events.on('success:close', () => {
  modal.close();
});

events.on('modal:close', () => {
  if (orderStep !== 1 && orderStep !== 2) return;
  orderStep = 1;
});

function renderBasketModal() {
  const items = cartModel.getItems();

  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onDelete: () => events.emit('basket:item:remove', item),
    });

    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  const total = cartModel.getTotal();
  const canOrder = items.length > 0;

  modal.open();
  modal.render({
    content: basketView.render({
      items: cards,
      total,
      canOrder,
    }),
  });
}

larekApi.getProducts()
  .then((items) => productsModel.setItems(items))
  .catch((err) => console.error('Ошибка при загрузке каталога с сервера:', err));