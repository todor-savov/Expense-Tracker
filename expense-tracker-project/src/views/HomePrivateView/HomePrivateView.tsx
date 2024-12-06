import Header from "../../components/Header/Header";
import HomePrivate from "../../components/HomePrivate/HomePrivate";
import Footer from "../../components/Footer/Footer";

const HomePrivateView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Latest Records"} />
            </div>
            <HomePrivate />            
            <Footer />
        </div>
    );
}

export default HomePrivateView;