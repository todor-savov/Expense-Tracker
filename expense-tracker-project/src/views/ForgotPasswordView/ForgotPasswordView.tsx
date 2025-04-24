import Header from "../../components/Header/Header";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import Footer from "../../components/Footer/Footer";

const ForgotPasswordView = () => {
    
    return (
        <>
            <Header from={"Forgotten password"} />
            <div className="central-container">
                <ForgotPassword />
            </div>
            <Footer />
        </>
    );
}

export default ForgotPasswordView;