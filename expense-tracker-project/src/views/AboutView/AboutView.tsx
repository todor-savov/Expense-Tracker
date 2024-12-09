import Header from "../../components/Header/Header";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";

const AboutView  = () => {

    return (
        <div>
            <Header from={"About the author"} />
            <About />
            <Footer />
        </div>
    );
}

export default AboutView;