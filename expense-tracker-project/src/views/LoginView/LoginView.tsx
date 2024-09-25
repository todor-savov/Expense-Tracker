import Header from "../../components/Header/Header";
import Login from "../../components/Login/Login";

const LoginView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Home"} />
            </div>
            <Login />
        </div>
    );
}

export default LoginView;