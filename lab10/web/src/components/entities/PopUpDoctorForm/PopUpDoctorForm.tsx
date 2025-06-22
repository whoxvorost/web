import React, {Dispatch, FC, FormEvent, SetStateAction} from 'react';
import FormInput from "../../common/FormInput/FormInput";
import PopUpModalWindow from "../../common/PopUpModalWindow/PopUpModalWindow";
import {IDoctor} from "../../../interfaces/doctorInterfaces";

interface PopUpDoctorFormProps {
    doctor: IDoctor;
    setDoctor: (doctor: IDoctor) => void;
    handleSubmit: (e: FormEvent) => void;
    error: string;
    headText: string;
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const PopUpDoctorForm: FC<PopUpDoctorFormProps> = ({
                                                       doctor,
                                                       setDoctor,
                                                       handleSubmit,
                                                       error,
                                                       headText,
                                                       active,
                                                       setActive
                                                   }) => {
    return (
        <PopUpModalWindow headText={headText} active={active} setActive={setActive}>
            <form className='doctor-popup-form' onSubmit={handleSubmit}>
                <FormInput
                    label="Name"
                    value={doctor.name}
                    onChange={e => setDoctor({...doctor, name: e.target.value})}
                />
                <FormInput
                    label="Description"
                    value={doctor.description}
                    onChange={e => setDoctor({...doctor, description: e.target.value})}
                    isTextArea={true}
                />
                <FormInput
                    label="Price"
                    type="number"
                    value={doctor.price || ''}
                    onChange={e => setDoctor({...doctor, price: Number(e.target.value)})}
                />
                <FormInput
                    label="Picture's url"
                    value={doctor.picture}
                    onChange={e => setDoctor({...doctor, picture: e.target.value})}
                />
                <FormInput
                    label="Country"
                    value={doctor.country}
                    onChange={e => setDoctor({...doctor, country: e.target.value})}
                />
                <span className='error'>{error}</span>
                <button className={'blue-btn small'} type={'submit'}>Добавити</button>
            </form>
        </PopUpModalWindow>
    );
};

export default PopUpDoctorForm;