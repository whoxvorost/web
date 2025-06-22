import React, {FC} from 'react';
import SectionMenu from "../../features/SectionMenu/SectionMenu";
import SectionItems from "../../features/SectionItems/SectionItems";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const CatalogPage: FC = () => {

    return (
        <>
            <SectionMenu/>
            <SectionItems/>
        </>
    );
};

export default CatalogPage;