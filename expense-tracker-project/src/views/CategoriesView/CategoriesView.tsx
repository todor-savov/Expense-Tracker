import Header from "../../components/Header/Header";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";

const CategoriesView = () => {
    
    return (
        <>
            <Header from={"Categories"} /> 
            <div className="central-container">
                <Categories />
            </div>
            <Footer />
        </>
    );
}

export default CategoriesView;