import Header from "../../components/Header/Header";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import Footer from "../../components/Footer/Footer";

const ResetPasswordView = () => {
    
    return (             
        <>  
            <Header from={"Reset Password"} />
            <div className="central-container">
                <ResetPassword />
            </div>
            <Footer />
        </>
     );
}

export default ResetPasswordView;