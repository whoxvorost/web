import $api from "../http";
import {AxiosResponse} from "axios";
import {IDoctor} from "../interfaces/doctorInterfaces";
import {ISearchOptions} from "../interfaces/commonInterfaces";


export default class DoctorServices {
    static async getDoctors(searchOptions: ISearchOptions | null): Promise<AxiosResponse<IDoctor[]>> {
        return $api.get('/doctors', {
            params: searchOptions
        });
    }

    static async getDoctorById(doctor_id: number): Promise<AxiosResponse<IDoctor>> {
        return $api.get(`/doctors/${doctor_id}`);
    }

    static async createDoctor(doctor: IDoctor): Promise<AxiosResponse<IDoctor>> {
        return $api.post('/doctors', doctor);
    }

    static async updateDoctor(doctor: IDoctor): Promise<AxiosResponse<{ total_price: number }>> {
        return $api.put(`/doctors/${doctor.doctor_id}`, doctor);
    }

    static async deleteDoctor(doctor_id: number): Promise<AxiosResponse<string>> {
        return $api.delete(`/doctors/${doctor_id}`);
    }

    static async getSum(ids: number[]): Promise<AxiosResponse<{ total_price: number }>> {
        const params = `?doctor_ids=${ids.join('&doctor_ids=')}`;
        return $api.get(`/doctors/sumto${params}`);
    }

    static async getCountries(): Promise<AxiosResponse<string[]>> {
        return $api.get('/countries');
    }
}