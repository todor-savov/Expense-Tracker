import AddTransaction from "../../components/AddTransaction/AddTransaction";
import Header from "../../components/Header/Header";

const AddTransactionView = () => {

    return (
        <div>
            <div className="header-container">
                <Header from={"Add Transaction"} />
            </div>
            <AddTransaction mode="new" />
        </div>
    );
}

export default AddTransactionView;