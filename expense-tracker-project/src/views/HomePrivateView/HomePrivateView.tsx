import Header from "../../components/Header/Header";
import HomePrivate from "../../components/HomePrivate/HomePrivate";

const HomePrivateView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Latest Records"} />
            </div>
            <HomePrivate />
        </div>
    );
}

export default HomePrivateView;