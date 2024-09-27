import Header from "../../components/Header/Header";
import HomePublic from "../../components/HomePublic/HomePublic";

const HomePublicView = () => {
    
    return (
        <div>
            <div className="header-container">
                <Header from={"Home"} />
            </div>
            <HomePublic />
        </div>
    );
}

export default HomePublicView;