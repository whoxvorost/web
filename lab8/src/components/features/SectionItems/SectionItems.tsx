import React, { Dispatch, FC, FormEvent, useEffect, useState } from 'react';
import './SectionItems.scss';
import { defaultDoctor, IDoctor } from "../../../intefaces/doctorInterfaces";
import DoctorItem from "../../entities/DoctorItem/DoctorItem";
import PopUpDoctorForm from "../../entities/PopUpDoctorForm/PopUpDoctorForm";
import { useDoctors } from "../../context/DoctorsContext";

interface SectionItemsProps {
    searchOptions: { term: string, sort: string, price: number, rating: number, country: string };
    setSearchOptions: Dispatch<React.SetStateAction<{ term: string, sort: string, price: number, rating: number, country: string }>>;
}

const filterDoctorsBySearchOptions = (doctors: IDoctor[], searchOptions: { term: string, sort: string, price: number, rating: number, country: string }) => {
    const { term, sort, price, rating, country } = searchOptions;

    const filteredDoctors = doctors.filter(doctor =>
        (doctor.name.toLowerCase().trim().includes(term.toLowerCase().trim()) ||
            doctor.description.toLowerCase().trim().includes(term.toLowerCase().trim())) &&
        (price ? doctor.price <= price : true) &&
        (rating ? doctor.rating >= rating : true) &&
        (country ? doctor.location.toLowerCase().trim() === country.toLowerCase().trim() : true)
    );

    return filteredDoctors.sort((a, b) => {
        if (sort === 'price') {
            return a.price - b.price;
        } else if (sort === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });
}

const SectionItems: FC<SectionItemsProps> = ({ searchOptions, setSearchOptions }) => {
    const { doctors, setDoctors } = useDoctors();
    const [editedDoctor, setEditedDoctor] = useState<IDoctor>(defaultDoctor);
    const [active, setActive] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [filteredDoctors, setFilteredDoctors] = useState(filterDoctorsBySearchOptions(doctors, searchOptions));

    useEffect(() => {
        setFilteredDoctors(filterDoctorsBySearchOptions(doctors, searchOptions));
    }, [doctors, searchOptions]);

    const handleEditedDoctor = (e: FormEvent) => {
        e.preventDefault();
        if (!editedDoctor.name || !editedDoctor.description || !editedDoctor.price || !editedDoctor.picture) {
            setError('All fields are required');
            return;
        }

        const isNameUnique = !doctors.some(doctor => doctor.name === editedDoctor.name);
        if (!isNameUnique) {
            setError('Doctor name must be unique');
            return;
        }

        const updatedDoctors = doctors.map(doctor =>
            doctor.doctor_id === editedDoctor.doctor_id ? editedDoctor : doctor
        );
        setDoctors(updatedDoctors);
        setActive(false);
        setError('');
        setEditedDoctor(defaultDoctor);
    }

    return (
        <section className="section-items">
            <div className="item-manager">
                <div className="sort-div">
                    <h1>Manage Doctors</h1>
                    <form>
                        <label htmlFor="sort"> Sort by: </label>
                        <select className="sort-select" name="sort" id="sort" onChange={(e) => setSearchOptions(prev => ({
                            ...prev,
                            sort: e.target.value
                        }))}>
                            <option value='price'>Price</option>
                            <option value='name'>Name</option>
                        </select>
                    </form>
                </div>
                <hr />
                <div className="count-div">
                    <h2>Count price</h2>
                    <form>
                        <label>
                            <output>Total:
                                <span id="total_price">
                                    {` ${filteredDoctors.reduce((total, doctor) => total + doctor.price, 0)} $`}
                                </span>
                            </output>
                        </label>
                    </form>
                </div>
            </div>

            <div id="ItemsWrappper" className="items-wrapper">
                {filteredDoctors.map((doctor: IDoctor) => (
                    <DoctorItem
                        key={doctor.doctor_id}
                        doctor={doctor}
                        setDoctors={setDoctors}
                        setEditedDoctor={setEditedDoctor}
                        setActive={setActive}
                    />
                ))}
            </div>
            <PopUpDoctorForm
                doctor={editedDoctor}
                setDoctor={setEditedDoctor}
                handleSubmit={handleEditedDoctor}
                error={error}
                headText="Edit doctor"
                active={active}
                setActive={setActive}
            />
        </section>
    );
};

export default SectionItems;