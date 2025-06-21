import React, {Dispatch, FC} from 'react';
import './DoctorItem.scss';
import {IDoctor} from "../../../intefaces/doctorInterfaces";
import {Link} from "react-router-dom";

interface DoctorItemProps {
    doctor: IDoctor;
    setDoctors: Dispatch<React.SetStateAction<IDoctor[]>>;
    setEditedDoctor: Dispatch<React.SetStateAction<IDoctor>>;
    setActive: Dispatch<React.SetStateAction<boolean>>;

}

const DoctorItem: FC<DoctorItemProps> = ({doctor, setDoctors, setEditedDoctor, setActive}) => {

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        const days = Math.floor(seconds / 86400);
        const interval = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        let result = 'updated ';

        if (days > 0) {
            result += `${days} day${days > 1 ? 's' : ''} `;
        }
        if (interval > 0) {
            result += `${interval} hour${interval > 1 ? 's' : ''} `;
        }
        if (minutes > 0) {
            result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
        }

        return result.trim() + ' ago';
    }

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setDoctors((prev) => prev.filter((d) => d.doctor_id !== doctor.doctor_id));
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