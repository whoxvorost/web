import React, {FC} from 'react';
import white_logo from '../../../images/white_logo.svg';
import dots from '../../../images/dots.svg';
import './Footer.scss';

const Footer: FC = () => {
    return (
        <footer>
            <img src={white_logo} alt='logo'/>
            <nav>
                <a href="/" className="h4">Company</a>
                <a href="/" className="h4">Region</a>
                <a href="/" className="h4">Help</a>
            </nav>
            <img className="dots" src={dots} alt='dots'/>
        </footer>
    );
};

export default Footer;