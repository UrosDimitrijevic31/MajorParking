import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, InputField, Loading, Modal } from "components";
import { getCarBrands, saveCarBrand, deleteCarBrand } from "services";
import { IDefaultProps, IInputError } from "types";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_CAR_BRANDS
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IBrandsTableProps {
    enableAddNew?: boolean;
}

export const BrandsTable = ({
    enableAddNew
}: IBrandsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { carBrands } = useDashboardState();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const dashboardDispatch = useDashboardDispatch();
    const [newBrand, setNewBrand] = useState("");
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameBrand: "",
        brand: ""
    });
    const loadCarBrands = (): void => {
        setTableDataLoading(true);
        getCarBrands().then(res => {
            dashboardDispatch({
                type: SET_CAR_BRANDS,
                payload: [...res.data.carBrands]
            });

            setTableDataLoading(false);
        });
    };

    const handleAddModalToggle = (value, brand): void => {
        addModalData.brand = brand.id;
        addModalData.nameBrand = brand.name;

        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleEditModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleEditBrandNametSubmit = (e): void => {
        e.preventDefault();
        const { nameBrand, brand } = addModalData;
        setTableDataLoading(true);
        saveCarBrand({
            name: nameBrand,
            id: brand
        }).then(res => {
            console.log(res);
            loadCarBrands();
        });

        handleAddModalToggle(false, brand);
    };

    useEffect(() => {
        if (!carBrands.length) {
            loadCarBrands();
        }
    }, []);

    const handleNewBrandChange = (e): void => {
        setNewBrand(e.currentTarget.value);
        setInputErrors([]);
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleAddNewBrand = (e): void => {
        e.preventDefault();

        const errors = [];

        if (!newBrand) {
            errors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: t("general.brand")
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            saveCarBrand({ name: newBrand, id: undefined }).then(res => {
                console.log(res, "res save car brand");
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("settings.newValueSuccessfullyAdded"));
                    setNewBrand("");
                    loadCarBrands();
                }
            });
        }
    };

    const deleteCarBrandItem = (brand): void => {
        deleteCarBrand({
            id: brand.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteCarBrand"));
                loadCarBrands();
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
            sortedArray = sort_asc_by_key(carBrands, i);
        } else {
            sortedArray = sort_desc_by_key(carBrands, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4 header__pointer"
                headings={[t("general.brand"), "", ""]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...carBrands.map((brand: IDefaultProps) => [
                        brand.name,
                        <div key={1} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    brand
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteCarBrandItem.bind(this, brand)}
                            >
                                {t("general.delete")}
                            </button>
                        </div>
                    ])
                ]}
            />
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("general.editBrand")}
                    </h3>
                    <form onSubmit={handleEditBrandNametSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameBrand}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameBrand"
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
                                onClick={handleAddModalToggle.bind(this, false)}
                                color="danger"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
            {enableAddNew && (
                <form onSubmit={handleAddNewBrand}>
                    <div className="flex flex-row justify-end">
                        <div className="mr-4">
                            <InputField
                                label={`${t("car.label")} ${t(
                                    "general.brand"
                                )}`}
                                className="mb-6"
                                value={newBrand}
                                onChange={handleNewBrandChange}
                                error={fieldError("name")}
                            />
                        </div>
                        <div className="flex items-center">
                            <Button color="secondary" type="submit">
                                {t("general.add")}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Loading>
    );
};
