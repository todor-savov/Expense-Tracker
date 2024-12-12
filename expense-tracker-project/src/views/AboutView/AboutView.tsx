import Header from "../../components/Header/Header";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";

const AboutView  = () => {

    return (
        <>
            <Header from={"About the author"} />
            <div className="central-container">
                <About />
            </div>
            <Footer />
        </>
    );
}

export default AboutView;