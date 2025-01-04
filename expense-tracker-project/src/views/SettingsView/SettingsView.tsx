import { useState } from "react";
import Header from "../../components/Header/Header";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";

const SettingsView = () => {
    const [isLimitChanged, setIsLimitChanged] = useState<boolean>(false);

    return (       
        <>
            <Header from={"Settings"} isLimitChanged={isLimitChanged} />
            <div className="central-container">
                <Settings isLimitChanged={isLimitChanged} setIsLimitChanged={setIsLimitChanged} />  
            </div>
            <Footer />       
        </>
    );
}

export default SettingsView;