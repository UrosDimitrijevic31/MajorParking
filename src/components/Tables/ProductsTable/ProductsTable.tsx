import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Loading } from "components";
import { getProducts, saveProduct, deleteProduct } from "services";
import { useDashboardState, useDashboardDispatch, SET_PRODUCTS } from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IProductssTableProps {
    enableAddNew?: boolean;
}

export const ProductsTable = ({}: IProductssTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { products } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        productName: "",
        productID: undefined
    });
    const loadProducts = (): void => {
        setTableDataLoading(true);
        getProducts().then(res => {
            dashboardDispatch({
                type: SET_PRODUCTS,
                payload: [...res.data.products]
            });
            setTableDataLoading(false);
        });
    };
    useEffect(() => {
        if (!products.length) {
            loadProducts();
        }
    });

    const handleAddModalToggle = (value, product): void => {
        if (product) {
            addModalData.productName = product.name;
            addModalData.productID = product.id;
        } else {
            addModalData.productName = "";
            addModalData.productID = undefined;
        }
        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleAddModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleAddProductSubmit = (e): void => {
        e.preventDefault();
        const { productName, productID } = addModalData;
        setTableDataLoading(true);
        saveProduct({
            id: productID,
            name: productName
        }).then(res => {
            res;
            console.log("submitted");
            loadProducts();
        });
        handleAddModalToggle(false, null);
    };

    const deleteProductItem = (vehicle): void => {
        deleteProduct({
            id: vehicle.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteProduct"));
                loadProducts();
            }
        });
    };

    function sort_asc_by_key(array, key) {
        return array.sort(function(a, b) {
            const x = a[key];
            const y = b[key];
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function sort_desc_by_key(array, key) {
        return array.sort(function(b, a) {
            const x = a[key];
            const y = b[key];
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }
    const [sortedData, setSortedData] = useState({
        key: "name",
        asc: false
    });
    const onSort = (i): void => {
        let sortedArray = [];
        let sortAsc = true;
        if (i === sortedData.key) {
            //vec je sortirano za taj key, vidi da li je asc ili desc
            if (sortedData.asc) {
                sortAsc = false;
            } else {
                sortAsc = true;
            }
        } else {
            sortAsc = true;
        }
        //setuj key koji je sortiran i da li je asc ili desc
        const tmp = { key: i, asc: sortAsc };
        setSortedData({ ...tmp });

        if (sortAsc) {
            sortedArray = sort_asc_by_key(products, i);
        } else {
            sortedArray = sort_desc_by_key(products, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="header__pointer"
                headings={[t("general.name"), t(""), t("")]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...products.map(products => [
                        products.name,
                        <div key={1} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    products
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,

                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteProductItem.bind(this, products)}
                            >
                                {t("general.delete")}
                            </button>
                        </div>
                    ])
                ]}
            />
            <Button
                onClick={handleAddModalToggle.bind(this, true, null)}
                className="btn btn--primary py-2 px-6 mt-4 inline-block"
            >
                {t("general.addProduct")}
            </Button>
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("general.addProduct")}
                    </h3>
                    <form onSubmit={handleAddProductSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.productName}
                                onChange={handleAddModalDataChange.bind(
                                    this,
                                    "productName"
                                )}
                            />
                        </div>

                        <div className="text-right">
                            <Button
                                type="submit"
                                color="success"
                                className="mr-4"
                            >
                                {t("general.save")}
                            </Button>
                            <Button
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    null,
                                    false
                                )}
                                color="danger"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </Loading>
    );
};
