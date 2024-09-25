import Header from "../../components/Header/Header";
import Register from "../../components/Register/Register";

const RegisterView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Home"} />
            </div>
            <Register />
        </div>
    );
}

export default RegisterView;
