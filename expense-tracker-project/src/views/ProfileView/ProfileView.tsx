import { useState } from "react";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";
import Footer from "../../components/Footer/Footer";

const ProfileView = () => {
    const [isUserChanged, setIsUserChanged] = useState<boolean>(false);

    return (
        <div>
            <Header from={"Profile"} isUserChanged={isUserChanged} /> 
            <Profile isUserChanged={isUserChanged} setIsUserChanged={setIsUserChanged} />
            <Footer />
        </div>
    );
}

export default ProfileView;