import React, { FC, FormEvent, useState } from 'react';
import './SectionMenu.scss';
import { defaultDoctor, IDoctor } from "../../../intefaces/doctorInterfaces";
import PopUpDoctorForm from "../../entities/PopUpDoctorForm/PopUpDoctorForm";
import { useDoctors } from "../../context/DoctorsContext";

interface SectionMenuProps {
    setSearchOptions: React.Dispatch<React.SetStateAction<{ term: string, sort: string, price: number, rating: number, country: string }>>;
}

const SectionMenu: FC<SectionMenuProps> = ({ setSearchOptions }) => {
    const { doctors, setDoctors } = useDoctors();
    const [active, setActive] = useState<boolean>(false);
    const [newDoctor, setNewDoctor] = useState<IDoctor>(defaultDoctor);
    const [error, setError] = useState<string>('')

    const handleNewDoctor = (e: FormEvent) => {
        e.preventDefault();
        if (!newDoctor.name || !newDoctor.description || !newDoctor.price || !newDoctor.picture) {
            setError('All fields are required');
            return;
        }

        const isNameUnique = !doctors.some(doctor => doctor.name === newDoctor.name);
        if (!isNameUnique) {
            setError('Doctor name must be unique');
            return;
        }

        const maxId = doctors.length > 0 ? Math.max(...doctors.map(doctor => doctor.doctor_id)) : 0;
        setDoctors([...doctors, { ...newDoctor, doctor_id: maxId + 1 }]);
        setActive(false);
        setError('');
        setNewDoctor(defaultDoctor);

        console.log(newDoctor);
    }

    return (
        <section className="section-menu">
            <div className="create">
                <button className="create-button" onClick={() => setActive(true)}>Create a doctor</button>
            </div>
            <div className="search-menu" id="search-menu">
                <form className='filter-form'>

                    <label>
                        Price:
                        <select onChange={(e) => setSearchOptions(prev => ({...prev, price: Number(e.target.value)}))}>
                            <option value="">Select a price</option>
                            <option value="50">{'< '}50</option>
                            <option value="100">{'< '}100</option>
                            <option value="200">{'< '}200</option>
                            <option value="400">{'< '}400</option>
                        </select>
                    </label>
                    <label>
                        Rating:
                        <select onChange={(e) => setSearchOptions(prev => ({...prev, rating: Number(e.target.value)}))}>
                            <option value="">Select a rating</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </label>
                    <label>
                        Country:
                        <select onChange={(e) => setSearchOptions(prev => ({...prev, country: e.target.value}))}>
                            <option value="">Select a country</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="Poland">Poland</option>
                            <option value="USA">USA</option>
                        </select>
                    </label>
                    <label className="input-buttons-menu">
                        <input placeholder="Type something..."
                               onChange={(e) => setSearchOptions(prev => ({...prev, term: e.target.value}))}
                        />
                    </label>
                </form>
            </div>

            <PopUpDoctorForm
                doctor={newDoctor}
                setDoctor={setNewDoctor}
                handleSubmit={handleNewDoctor}
                error={error}
                headText="Add new doctor"
                active={active}
                setActive={setActive}
            />
        </section>
    );
};

export default SectionMenu;