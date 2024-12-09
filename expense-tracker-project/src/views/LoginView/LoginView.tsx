import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";
import Footer from "../../components/Footer/Footer";

const LoginView = () => {

    return (
        <div>
            <Header from={"Home"} />
            <Login />
            <Footer />
        </div>
    );
}

export default LoginView;