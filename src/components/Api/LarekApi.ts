import type {
    IApi,
    IProduct,
    ProductsResponse,
    OrderRequest,
    OrderResponse,
} from '../../types';

export class LarekApi {
    constructor(private readonly api: IApi) {}

    getProducts(): Promise<IProduct[]> {
        return this.api.get<ProductsResponse>('product/').then((data) => data.items);
    }

    postOrder(data: OrderRequest): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('order', data);
    }
}