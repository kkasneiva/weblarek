import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { API_URL } from './utils/constants';


const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// Products
productsModel.setItems(apiProducts.items);
console.log('Products.getItems():', productsModel.getItems());

const firstId = apiProducts.items[0]?.id;
if (firstId) {
    console.log('Products.getById(firstId):', productsModel.getById(firstId));
    productsModel.setSelected(productsModel.getById(firstId) ?? null);
    console.log('Products.getSelected():', productsModel.getSelected());
}

// Cart
const firstItem = apiProducts.items[0];
if (firstItem) {
    console.log('Cart.hasById(firstItem.id) before add:', cartModel.hasById(firstItem.id));
    cartModel.add(firstItem);
    console.log('Cart.getItems() after add:', cartModel.getItems());
    console.log('Cart.getCount():', cartModel.getCount());
    console.log('Cart.getTotal():', cartModel.getTotal());
    console.log('Cart.hasById(firstItem.id) after add:', cartModel.hasById(firstItem.id));

    cartModel.remove(firstItem);
    console.log('Cart.getItems() after remove:', cartModel.getItems());
    console.log('Cart.getCount() after remove:', cartModel.getCount());
    console.log('Cart.getTotal() after remove:', cartModel.getTotal());

    cartModel.clear();
    console.log('Cart.getItems() after clear:', cartModel.getItems());
}

// Buyer
console.log('Buyer.validate() empty:', buyerModel.validate());

buyerModel.setData({ payment: 'card' });
console.log('Buyer.validate() after payment:', buyerModel.validate());

buyerModel.setData({ address: 'Amsterdam, Damrak 1' });
console.log('Buyer.validate() after address:', buyerModel.validate());

buyerModel.setData({ email: 'test@example.com', phone: '+7 (999) 123-45-67' });
console.log('Buyer.validate() filled:', buyerModel.validate());
console.log('Buyer.getData():', buyerModel.getData());

buyerModel.clear();
console.log('Buyer.validate() after clear:', buyerModel.validate());

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts()
    .then((items) => {
        productsModel.setItems(items);
        console.log('Products.getItems() FROM SERVER:', productsModel.getItems());
    })
    .catch((err) => {
        console.error('Ошибка при загрузке каталога с сервера:', err);
    });