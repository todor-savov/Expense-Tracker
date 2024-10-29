import Header from "../../components/Header/Header";
import FAQ from "../../components/FAQ/FAQ";

const FaqView = () => {
    
    return (    
        <div>
            <div className="header-container">
                <Header from={"Frequently Asked Questions"} />
            </div>
            <FAQ />
        </div>
    );
}

export default FaqView;