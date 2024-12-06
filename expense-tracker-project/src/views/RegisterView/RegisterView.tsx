import Header from "../../components/Header/Header";
import Register from "../../components/Register/Register";
import Footer from "../../components/Footer/Footer";

const RegisterView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Home"} />
            </div>
            <Register />
            <Footer />
        </div>
    );
}

export default RegisterView;
