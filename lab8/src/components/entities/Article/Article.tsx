import React, {FC} from 'react';
import {IArticle} from "../../../intefaces/commonInterfaces";
import arrow from "../../../images/arrow.svg";
import './Article.scss';
import {Link} from "react-router-dom";

const Article: FC<IArticle> = ({title, id, description, picture}) => {

    return (
        <div className="article">
            <Link to={`/catalog/${id}`} className='avatar'
                 style={{backgroundImage: `url(${picture})`}}
            >

            </Link>
            {/*<img src={picture} alt="article 1"/>*/}
            <h3 className="h3">{title}</h3>
            <h4 className="h4">{description}</h4>
            <Link to='/catalog' className="blue-btn h6">View all<img src={arrow} alt="→"/></Link>
        </div>
    );
};

export default Article;