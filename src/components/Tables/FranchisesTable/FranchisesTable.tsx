import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, Button, InputField, Loading, Modal } from "components";
import { getFranchises, saveFranchise, deleteFranchise } from "services";
import { IDefaultProps, IInputError, IFranchise } from "types";
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

export const FranchisesTable = ({
    enableAddNew
}: IBrandsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const [franchises, setFranchises] = useState<IFranchise[]>([]);
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const dashboardDispatch = useDashboardDispatch();
    const [newFranchise, setNewFranchise] = useState("");
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        name: "",
        id: ""
    });
    const loadFranchises = (): void => {
        setTableDataLoading(true);
        getFranchises().then(res => {
            setFranchises(res.data.franchise);

            setTableDataLoading(false);
        });
    };

    const handleAddModalToggle = (value, franchise): void => {
        if (franchise) {
            addModalData.id = franchise.id;
            addModalData.name = franchise.name;
        } else {
            addModalData.id = null;
            addModalData.name = "";
        }

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

    const submitFranchise = (e): void => {
        e.preventDefault();
        saveFranchise({
            id: addModalData.id,
            name: addModalData.name
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("client.savedFranchise"));
                loadFranchises();
                addModalData.visible = false;
            }
        });
    };

    useEffect(() => {
        loadFranchises();
    }, [setFranchises]);

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const deleteFranchiseItem = (franchise): void => {
        deleteFranchise({
            id: franchise.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteCarBrand"));
                loadFranchises();
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
            sortedArray = sort_asc_by_key(franchises, i);
        } else {
            sortedArray = sort_desc_by_key(franchises, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4 header__pointer"
                headings={[t("client.franchise"), "", ""]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...franchises.map((franchise: IFranchise) => [
                        franchise.name,
                        <div key={1} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    franchise
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteFranchiseItem.bind(
                                    this,
                                    franchise
                                )}
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
                {t("client.addFranchise")}
            </Button>
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("client.franchise")}
                    </h3>
                    <form onSubmit={submitFranchise}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.name}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "name"
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
        </Loading>
    );
};
