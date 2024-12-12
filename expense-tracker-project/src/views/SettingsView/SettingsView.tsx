import Header from "../../components/Header/Header";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";

const SettingsView = () => {

    return (       
        <>
            <Header from={"Settings"} />
            <div className="central-container">
                <Settings />  
            </div>
            <Footer />       
        </>
    );
}

export default SettingsView;