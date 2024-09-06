import CASH_REGISTER_ICON from '../../assets/cash_register_icon.png';   
import BUDGET_ICON from '../../assets/budget_icon.png';
import GRAPH_ICON from '../../assets/graph_icon.png';
import TABLE_ICON from '../../assets/table_icon.png';
import CATEGORY_ICON from '../../assets/category_icon.png';
import './HomePublic.css';   

const HomePublic = () => {

    
    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
            </ol>

            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img className="d-block w-100" src={CASH_REGISTER_ICON} alt="cash-register-icon" />
                    <div className="carousel-caption">
                        <h5>Register your transactions</h5>
                        <p> Keep track of all your expenses effortlessly.
                            Ensure every transaction is documented to maintain accurate financial records and boost your efficiency.
                        </p>
                    </div>
                </div>

                <div className="carousel-item">
                    <img className="d-block w-100" src={CATEGORY_ICON} alt="create-category-icon" />
                    <div className="carousel-caption">
                        <h5>Customize Your Categories</h5>
                        <p> Create new categories tailored to your needs with custom icons and titles. 
                            Edit or delete existing categories to keep your records organized and up-to-date.
                        </p>
                    </div>
                </div>

                <div className="carousel-item">
                    <img className="d-block w-100" src={TABLE_ICON} alt="review-transactions-icon" />
                    <div className="carousel-caption">
                        <h5>Review Transactions Easily</h5>
                        <p> Access a comprehensive table view of all your transactions. 
                            Sort and filter through records with ease and open attached sales receipts for detailed information.
                        </p>
                    </div>
                </div>

                <div className="carousel-item">
                    <img className="d-block w-100" src={GRAPH_ICON} alt="visualize-graphs-icon" />
                    <div className="carousel-caption">
                        <h5>Visualize Your Data</h5>
                        <p> Preview your transaction data through intuitive graphs. 
                            Choose between snapshot views or continuous data trends over time to better understand your financial patterns.
                        </p>
                    </div>
                </div>

                <div className="carousel-item">
                    <img className="d-block w-100" src={BUDGET_ICON} alt="manage-budget-icon" />
                    <div className="carousel-caption">
                        <h5>Manage Your Budgets</h5>
                        <p> Create budgets for each category and monitor your spending. 
                            Track expenses against your set limits and receive automatic notifications if your spending exceeds the budget.
                        </p>
                    </div>
                </div>
            </div>

            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>

            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
      </div>
    )
}

export default HomePublic;