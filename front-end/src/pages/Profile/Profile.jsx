import ProfilePage from "../../components/ProfilePage/ProfilePage.jsx";
import Navbar from "/src/components/Navbar/Navbar.jsx";

export default function Cart(){

    
     return (
            <>
                <Navbar/>
                <main className="profile-main">
                    <div className="profile-container">
                        <ProfilePage/>
                    </div>
                </main>
            </>
        )
}