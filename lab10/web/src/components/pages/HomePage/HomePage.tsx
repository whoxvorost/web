import React, {FC} from 'react';
import FirstScreen from "../../features/FirstScreen/FirstScreen";
import LastArticles from "../../features/LastArticles/LastArticles";

const HomePage: FC = () => {
    return (
        <>
            <FirstScreen/>
            <LastArticles/>
        </>
    );
};

export default HomePage;