import { useState } from "react";
import Header from "../../components/Header/Header";
import Profile from "../../components/Profile/Profile";

const ProfileView = () => {
    const [isUserChanged, setIsUserChanged] = useState<boolean>(false);

    return (
        <div>
            <div className="header-container">
                <Header from={"Profile"} isUserChanged={isUserChanged} /> 
            </div>
            <Profile isUserChanged={isUserChanged} setIsUserChanged={setIsUserChanged} />
        </div>
    );
}

export default ProfileView;