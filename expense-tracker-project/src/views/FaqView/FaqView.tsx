import Header from "../../components/Header/Header";
import FAQ from "../../components/FAQ/FAQ";
import Footer from "../../components/Footer/Footer";

const FaqView = () => {
    
    return (    
        <>
            <Header from={"Frequently Asked Questions"} />
            <div className="central-container">
                <FAQ />
            </div>
            <Footer />
        </>
    );
}

export default FaqView;