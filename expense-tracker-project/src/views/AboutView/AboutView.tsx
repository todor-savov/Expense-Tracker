import Header from "../../components/Header/Header";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";

const AboutView  = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"About the author"} />
            </div>
            <About />
            <Footer />
        </div>
    );
}

export default AboutView;