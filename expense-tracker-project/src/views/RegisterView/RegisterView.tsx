import Header from "../../components/Header/Header";
import Register from "../../components/Register/Register";
import Footer from "../../components/Footer/Footer";

const RegisterView = () => {

    return (
        <>
            <Header from={"Register a new user"} />
            <div className="central-container">
                <Register />
            </div>
            <Footer />
        </>
    );
}

export default RegisterView;
