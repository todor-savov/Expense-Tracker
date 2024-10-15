import Header from "../../components/Header/Header";
import Settings from "../../components/Settings/Settings";

const SettingsView = () => {

    return (       
        <div>
            <div className="header-container">
                <Header from={"Settings"} />
            </div>
            <Settings />         
        </div>
    );
}

export default SettingsView;