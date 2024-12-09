import Header from "../../components/Header/Header";
import HomePublic from "../../components/HomePublic/HomePublic";
import Footer from "../../components/Footer/Footer";

const HomePublicView = () => {
    
    return (
        <div>
            <Header from={"Home"} />
            <HomePublic />
            <Footer />
        </div>
    );
}

export default HomePublicView;