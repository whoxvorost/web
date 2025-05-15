import React, {FC} from 'react';
import arrow from "../../../images/arrow.svg";
import './Article.scss';
import {Link} from "react-router-dom";
import {IDoctor} from "../../../interfaces/doctorInterfaces";

const Article: FC<IDoctor> = (doctor) => {

    return (
        <div className="article">
            <Link to={`/catalog/${doctor.doctor_id}`} className='avatar'
                 style={{backgroundImage: `url(${doctor.picture})`}}
            >

            </Link>
            {/*<img src={picture} alt="article 1"/>*/}
            <h3 className="h3">{doctor.name}</h3>
            <h4 className="h4">{doctor.description}</h4>
            <Link to='/catalog' className="blue-btn h6">View all<img src={arrow} alt="→"/></Link>
        </div>
    );
};

export default Article;