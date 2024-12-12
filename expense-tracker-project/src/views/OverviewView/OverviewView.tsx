import Header from "../../components/Header/Header";
import Overview from "../../components/Overview/Overview";
import Footer from "../../components/Footer/Footer";

const OverviewView = () => {

    return (
        <>
            <Header from={"Overview"} /> 
            <div className="central-container">
                <Overview />
            </div>
            <Footer />
        </>
    );
}

export default OverviewView;