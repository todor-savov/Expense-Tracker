import Header from "../../components/Header/Header";
import Overview from "../../components/Overview/Overview";
import Footer from "../../components/Footer/Footer";

const OverviewView = () => {

    return (
        <div>
            <Header from={"Overview"} /> 
            <Overview />
            <Footer />
        </div>
    );
}

export default OverviewView;