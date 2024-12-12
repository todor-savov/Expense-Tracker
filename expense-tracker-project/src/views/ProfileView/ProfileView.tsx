import { useState } from "react";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import Footer from "../../components/Footer/Footer";

const ProfileView = () => {
    const [isUserChanged, setIsUserChanged] = useState<boolean>(false);

    return (
        <>
            <Header from={"Profile"} isUserChanged={isUserChanged} /> 
            <div className="central-container">
                <Profile isUserChanged={isUserChanged} setIsUserChanged={setIsUserChanged} />
            </div>
            <Footer />
        </>
    );
}

export default ProfileView;