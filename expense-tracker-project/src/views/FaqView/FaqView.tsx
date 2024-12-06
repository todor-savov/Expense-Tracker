import Header from "../../components/Header/Header";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

const FaqView = () => {
    
    return (    
        <div>
            <div className="header-container">
                <Header from={"Frequently Asked Questions"} />
            </div>
            <FAQ />
            <Footer />
        </div>
    );
}

export default FaqView;