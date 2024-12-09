import Header from "../../components/Header/Header";
import HomePrivate from "../../components/HomePrivate/HomePrivate";
import Footer from "../../components/Footer/Footer";

const HomePrivateView = () => {

    return (
        <div>
            <Header from={"Latest Records"} />
            <HomePrivate />            
            <Footer />
        </div>
    );
}

export default HomePrivateView;