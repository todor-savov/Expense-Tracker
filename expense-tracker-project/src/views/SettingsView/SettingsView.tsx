import Header from "../../components/Header/Header";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";

const SettingsView = () => {

    return (       
        <div>
            <Header from={"Settings"} />
            <Settings />  
            <Footer />       
        </div>
    );
}

export default SettingsView;