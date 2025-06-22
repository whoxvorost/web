import React, {FC, FormEvent, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import './SectionItems.scss';
import {defaultDoctor, IDoctor} from "../../../interfaces/doctorInterfaces";
import DoctorItem from "../../entities/DoctorItem/DoctorItem";
import PopUpDoctorForm from "../../entities/PopUpDoctorForm/PopUpDoctorForm";
import DoctorServices from "../../../services/DoctorServices";
import {AppDispatch, getDoctors, RootState, setSearchOption} from "../../../store";
import Loader from "../../common/Loader/Loader";

const SectionItems: FC = () => {
    const {
        doctors,
        searchOptions,
        status
    } = useSelector((state: RootState) => state.doctorsReducer);

    const dispatch = useDispatch<AppDispatch>();

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [editedDoctor, setEditedDoctor] = useState<IDoctor>(defaultDoctor);
    const [active, setActive] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchTotalPrice = async (doctors: IDoctor[]) => {
        const response = await DoctorServices.getSum(doctors.map(doctor => doctor.doctor_id));
        setTotalPrice(response.data.total_price);
    }

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            dispatch(getDoctors(searchOptions));
        }, 500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [dispatch, searchOptions]);

    useEffect(() => {
        if (doctors && doctors.length > 0) {
            fetchTotalPrice(doctors).then();
        } else {
            setTotalPrice(0);
        }
    }, [doctors]);

    const handleEditedDoctor = async (e: FormEvent) => {
        e.preventDefault();
        if (!editedDoctor.name || !editedDoctor.description || !editedDoctor.price || !editedDoctor.picture) {
            setError('All fields are required');
            return;
        }

        const currentDate = new Date();
        const isoDate = currentDate.toISOString();
        const doctorToSend = {
            ...editedDoctor,
            updated_at: isoDate,
        };
        await DoctorServices.updateDoctor(doctorToSend);
        dispatch(getDoctors(searchOptions));
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
                        <select className="sort-select" name="sort" id="sort" onChange={(e) => setSearchOption({
                            ...searchOptions,
                            order_by: e.target.value
                        })}>
                            <option value='price'>Price</option>
                            <option value='name'>Name</option>
                        </select>
                    </form>
                </div>
                <hr/>
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
                {doctors?.map((doctor: IDoctor) => (
                    <DoctorItem
                        key={doctor.doctor_id}
                        doctor={doctor}
                        setEditedDoctor={setEditedDoctor}
                        setActive={setActive}
                    />
                ))}
            </div>
            {status === 'pending' && <div className='loader-wrapper'>
                <Loader/>
            </div>}
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