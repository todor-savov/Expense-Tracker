import Categories from "../../components/Categories/Categories";
import Header from "../../components/Header/Header";

const CategoriesView = () => {
    return (
        <div>
            <div className="header-container">
                <Header from={"Categories"} /> 
            </div>
            <Categories />
        </div>
    );
}

export default CategoriesView;