import Header from "../../components/Header/Header";
import HomePublic from "../../components/HomePublic/HomePublic";
import Footer from "../../components/Footer/Footer";

const HomePublicView = () => {
    
    return (
        <div>
            <div className="header-container">
                <Header from={"Home"} />
            </div>
            <HomePublic />
            <Footer />
        </div>
    );
}

export default HomePublicView;