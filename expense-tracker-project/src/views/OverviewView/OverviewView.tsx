import Header from "../../components/Header/Header";
import Overview from "../../components/Overview/Overview";

const OverviewView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Overview"} /> 
            </div>
            <Overview />
        </div>
    );
}

export default OverviewView;