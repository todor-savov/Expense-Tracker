import Header from "../../components/Header/Header";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";

const CategoriesView = () => {
    return (
        <div>
            <div className="header-container">
                <Header from={"Categories"} /> 
            </div>
            <Categories />
            <Footer />
        </div>
    );
}

export default CategoriesView;