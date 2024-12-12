import Header from "../../components/Header/Header";
import HomePublic from "../../components/HomePublic/HomePublic";
import Footer from "../../components/Footer/Footer";

const HomePublicView = () => {
    
    return (
        <>
            <Header from={"Home"} />
            <div className="central-container">
                <HomePublic />
            </div>
            <Footer />
        </>
    );
}

export default HomePublicView;