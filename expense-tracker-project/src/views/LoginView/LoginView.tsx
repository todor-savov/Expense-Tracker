import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";
import Footer from "../../components/Footer/Footer";

const LoginView = () => {

    return (
        <>
            <Header from={"Home"} />
            <div className="central-container">
                <Login />
            </div>
            <Footer />
        </>
    );
}

export default LoginView;