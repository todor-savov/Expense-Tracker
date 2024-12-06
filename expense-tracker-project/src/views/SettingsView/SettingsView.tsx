import Header from "../../components/Header/Header";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";

const SettingsView = () => {

    return (       
        <div>
            <div className="header-container">
                <Header from={"Settings"} />
            </div>
            <Settings />  
            <Footer />       
        </div>
    );
}

export default SettingsView;