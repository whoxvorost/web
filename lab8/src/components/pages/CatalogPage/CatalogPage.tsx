import React, { FC, useState } from 'react';
import SectionMenu from "../../features/SectionMenu/SectionMenu";
import SectionItems from "../../features/SectionItems/SectionItems";
const CatalogPage: FC = () => {
    const [searchOptions, setSearchOptions] = useState<{ term: string, sort: string, price: number, rating: number, country: string }>({ term: '', sort: 'price', price: 0, rating: 0, country: '' });

    return (
        <>
            <SectionMenu setSearchOptions={setSearchOptions} />
            <SectionItems searchOptions={searchOptions} setSearchOptions={setSearchOptions} />
        </>
    );
};

export default CatalogPage;