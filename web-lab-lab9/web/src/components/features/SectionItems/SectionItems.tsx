import React, {Dispatch, FC, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
import './SectionItems.scss';
import {defaultDoctor, IDoctor} from "../../../interfaces/doctorInterfaces";
import DoctorItem from "../../entities/DoctorItem/DoctorItem";
import PopUpDoctorForm from "../../entities/PopUpDoctorForm/PopUpDoctorForm";
import DoctorServices from "../../../services/DoctorServices";
import {ISearchOptions} from "../../../interfaces/commonInterfaces";

interface SectionItemsProps {
    searchOptions: ISearchOptions;
    setSearchOptions: Dispatch<React.SetStateAction<ISearchOptions>>;
    doctors: IDoctor[];
    setDoctors: Dispatch<React.SetStateAction<IDoctor[]>>;
}

const SectionItems: FC<SectionItemsProps> = ({ searchOptions, setSearchOptions, doctors, setDoctors }) => {
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [editedDoctor, setEditedDoctor] = useState<IDoctor>(defaultDoctor);
    const [active, setActive] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchTotalPrice = async (doctors: IDoctor[]) => {
        const response = await DoctorServices.getSum(doctors.map(doctor => doctor.doctor_id));
        setTotalPrice(response.data.total_price);
    }
    const fetchDoctors = useCallback(async () => {
        const { data } = await DoctorServices.getDoctors(searchOptions);
        setDoctors(data);
        if (data.length > 0) await fetchTotalPrice(data);
    }, [setDoctors, searchOptions])




    useEffect(() => {

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            fetchDoctors().then();
            // fetchTotalPrice().then();
        }, 500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [fetchDoctors]);

    const handleEditedDoctor  = async (e: FormEvent) => {
        e.preventDefault();
        if (!editedDoctor.name || !editedDoctor.description || !editedDoctor.price || !editedDoctor.picture) {
            setError('All fields are required');
            return;
        }

        // const foundDoctor = doctors.find(doctor => doctor.name === editedDoctor.name);
        // if (foundDoctor?.doctor_id === editedDoctor.doctor_id) {
        //     setError('Doctor name must be unique');
        //     return;
        // }
        const currentDate = new Date();
        const isoDate = currentDate.toISOString();
        const doctorToSend = {
            ...editedDoctor,
            updated_at: isoDate,
        };
        await DoctorServices.updateDoctor(doctorToSend);
        fetchDoctors().then();
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
                            order_by: e.target.value
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
                                    {` ${totalPrice} $`}
                                </span>
                            </output>
                        </label>
                    </form>
                </div>
            </div>

            <div id="ItemsWrappper" className="items-wrapper">
                {doctors.map((doctor: IDoctor) => (
                    <DoctorItem
                        key={doctor.doctor_id}
                        searchOptions={searchOptions}
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