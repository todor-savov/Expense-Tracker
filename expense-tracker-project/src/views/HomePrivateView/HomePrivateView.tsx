import Header from "../../components/Header/Header";
import HomePrivate from "../../components/HomePrivate/HomePrivate";
import Footer from "../../components/Footer/Footer";

const HomePrivateView = () => {

    return (
        <>
            <Header from={"Latest Records"} />
            <div className="central-container">
                <HomePrivate />  
            </div> 
            <Footer />
        </>
    );
}

export default HomePrivateView;