import React, {FC, useState} from 'react';
import SectionMenu from "../../features/SectionMenu/SectionMenu";
import SectionItems from "../../features/SectionItems/SectionItems";
import {IDoctor} from "../../../interfaces/doctorInterfaces";
import {ISearchOptions} from "../../../interfaces/commonInterfaces";

const CatalogPage: FC = () => {
    const [searchOptions, setSearchOptions] = useState<ISearchOptions>({ search: '', order_by: 'price', price_le: 0, rate_ge: 0, country: '' });
    const [doctors, setDoctors] = useState<IDoctor[]>([])

    return (
        <>
            <SectionMenu
                searchOptions={searchOptions}
                setSearchOptions={setSearchOptions}
                doctors={doctors}
                setDoctors={setDoctors}
            />
            <SectionItems
                searchOptions={searchOptions}
                setSearchOptions={setSearchOptions}
                doctors={doctors}
                setDoctors={setDoctors}
            />
        </>
    );
};

export default CatalogPage;