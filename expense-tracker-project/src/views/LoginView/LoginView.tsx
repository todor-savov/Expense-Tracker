import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";
import Footer from "../../components/Footer/Footer";

const LoginView = () => {

    return (
        <>
            <Header from={"Login"} />
            <div className="central-container">
                <Login />
            </div>
            <Footer />
        </>
    );
}

export default LoginView;