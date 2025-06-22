import $api from "../http";
import {AxiosResponse} from "axios";
import {ICart} from "../interfaces/commonInterfaces";


export default class CartServices {
    static async getCarts(): Promise<AxiosResponse<ICart[]>> {
        return $api.get('/cart');
    }

    static async addCart(doctor_id: number, quantity: number, doctor_type: string): Promise<AxiosResponse<ICart>> {
        return $api.post(`/cart?doctor_id=${doctor_id}&quantity=${quantity}&doctor_type=${doctor_type}`);
    }

    static async deleteCart(item_index: number): Promise<AxiosResponse<string>> {
        return $api.delete(`/cart/${item_index}`);
    }

}