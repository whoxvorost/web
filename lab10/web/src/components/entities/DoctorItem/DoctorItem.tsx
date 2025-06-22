import React, {Dispatch, FC} from 'react';
import './DoctorItem.scss';
import {IDoctor} from "../../../interfaces/doctorInterfaces";
import {Link} from "react-router-dom";
import DoctorServices from "../../../services/DoctorServices";
import {AppDispatch, getDoctors, RootState} from "../../../store";
import {useDispatch, useSelector} from "react-redux";
import {timeSince} from "../../../utils/common";

interface DoctorItemProps {
    doctor: IDoctor;
    setEditedDoctor: Dispatch<React.SetStateAction<IDoctor>>;
    setActive: Dispatch<React.SetStateAction<boolean>>;

}

const DoctorItem: FC<DoctorItemProps> = ({doctor, setEditedDoctor, setActive}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        searchOptions
    } = useSelector((state: RootState) => state.doctorsReducer);

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        DoctorServices.deleteDoctor(doctor.doctor_id).then(() => dispatch(getDoctors(searchOptions)));
    }

    const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setEditedDoctor(doctor);
        setActive(true);

    }


    return (
        <div className="item">
            <Link to={`/catalog/${doctor.doctor_id}`} className="avatar"
                  style={{backgroundImage: `url(${doctor.picture})`}}
            ></Link>
            <div className="info">
                <h3 className="h3">{doctor.name}</h3>
                <h4 className="h6">{doctor.description}</h4>
                <h5 className="h5">{timeSince(doctor.updated_at)}</h5>
                <h6 className="h6">{doctor.price} $</h6>
            </div>
            <div className="manage">
                <button onClick={handleEdit} className="edit-doctor">Edit</button>
                <button onClick={handleDelete} className="remove-doctor">Remove</button>
            </div>
        </div>
    );
};

export default DoctorItem;