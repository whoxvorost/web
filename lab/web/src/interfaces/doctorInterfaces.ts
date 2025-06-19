export interface IDoctor {
    name: string,
    description: string,
    updated_at: string,
    price: number,
    picture: string,
    country: string,
    rate: number,
    doctor_id: number

}

export const defaultDoctor: IDoctor = {
    name: '',
    description: '',
    updated_at: '',
    price: 0,
    picture: '',
    country: 'Ukraine',
    rate: 0,
    doctor_id: -1
}