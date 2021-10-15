import React, { useState, useEffect } from "react";
import { IDefaultProps, IInputError, IInspectionItem } from "types";
import { useTranslation } from "react-i18next";
import {
    Table,
    InputField,
    Button,
    Loading,
    Modal,
    Checkbox
} from "components";
import {
    getInspectionItems,
    saveInspectionItem,
    deleteInspectionItem
} from "services";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IInspectionItemsTableProps {
    enableAddNew?: boolean;
}

const defaultNewItemsValues = {
    name: "",
    freeMinutes: 0,
    nameErr: "",
    freeMinutesErr: "",
    doubleScan: false,
    id: undefined
};

export const InspectionItemsTable = ({
    enableAddNew
}: IInspectionItemsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [items, setItems] = useState<IDefaultProps[]>([]);
    const [newItems, setNewItems] = useState({
        ...defaultNewItemsValues
    });
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameInspectionItems: "",
        idInspectionItems: "",
        freeMinutes: 0,
        doubleScan: false
    });
    const loadInspectionItems = (): void => {
        setTableDataLoading(true);
        getInspectionItems().then(res => {
            const { inspectionItems } = res.data;

            setItems([...inspectionItems]);

            setTableDataLoading(false);
        });
    };

    const handleAddModalToggle = (value, item): void => {
        addModalData.idInspectionItems = item.id;
        addModalData.nameInspectionItems = item.name;
        addModalData.freeMinutes = item.freeMinutes;
        addModalData.doubleScan = item.doubleScan;
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
        const {
            nameInspectionItems,
            idInspectionItems,
            freeMinutes,
            doubleScan
        } = addModalData;
        setTableDataLoading(true);
        saveInspectionItem({
            name: nameInspectionItems,
            id: idInspectionItems,
            freeMinutes: freeMinutes,
            doubleScan: doubleScan
        }).then(res => {
            res;
            console.log("submitted");
            loadInspectionItems();
        });

        handleAddModalToggle(false, idInspectionItems);
    };

    useEffect(() => {
        if (!items.length) {
            loadInspectionItems();
        }
    }, []);

    const handleNewItemsChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;
        setNewItems({
            ...newItems,
            [prop]: value
        });

        const fieldErrorIndex = inputErrors.findIndex(
            err => err.fieldName === prop
        );

        if (fieldErrorIndex !== -1) {
            const newInputErrors = [...inputErrors];
            newInputErrors.splice(fieldErrorIndex, 1);
            setInputErrors([...newInputErrors]);
        }
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleAddNewItems = (e): void => {
        e.preventDefault();

        const errors = [];

        if (!newItems.name) {
            errors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: `${t("general.item")} ${t("general.name")}`
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            saveInspectionItem(newItems).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("settings.newValueSuccessfullyAdded"));
                    setNewItems({
                        ...defaultNewItemsValues
                    });
                    loadInspectionItems();
                }
            });
        }
    };

    const deleteInspectionItem2 = (item): void => {
        deleteInspectionItem({
            id: item.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("client.deleteInspectionItem"));
                loadInspectionItems();
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
            sortedArray = sort_asc_by_key(items, i);
        } else {
            sortedArray = sort_desc_by_key(items, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4 header__pointer"
                clicked={onSort}
                keys={["name", "freeMinutes", "doubleScan"]}
                headings={[
                    t("general.item"),
                    t("settings.freeMinutes"),
                    t("settings.doubleScan"),
                    "",
                    ""
                ]}
                rows={[
                    ...items.map((item: IInspectionItem) => [
                        item.name,
                        item.freeMinutes,
                        item.doubleScan ? "Yes" : "No",
                        <div key={1} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    item
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteInspectionItem2.bind(this, item)}
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
                        {t("settings.editInspectionItems")}
                    </h3>
                    <form onSubmit={handleEditBrandNametSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameInspectionItems}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameInspectionItems"
                                )}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("settings.freeMinutes")}
                                value={addModalData.freeMinutes}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "freeMinutes"
                                )}
                            />
                        </div>
                        <p className={fieldCssClass}>Double scan</p>
                        <div className={fieldCssClass}>
                            <div className="flex flex-wrap mb-4">
                                <Checkbox
                                    label={t("general.true")}
                                    defaultChecked={addModalData.doubleScan}
                                    onChange={handleEditModalDataChange.bind(
                                        this,
                                        "doubleScan",
                                        !addModalData.doubleScan
                                    )}
                                />
                                <Checkbox
                                    label={t("general.false")}
                                    defaultChecked={!addModalData.doubleScan}
                                    onChange={handleEditModalDataChange.bind(
                                        this,
                                        "doubleScan",
                                        !addModalData.doubleScan
                                    )}
                                />
                            </div>
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
                <form onSubmit={handleAddNewItems}>
                    <div className="flex flex-row justify-end">
                        <div className="mr-4 capitalize">
                            <InputField
                                label={`${t("general.item")} ${t(
                                    "general.name"
                                )}`}
                                value={newItems.name}
                                className="mb-6"
                                onChange={handleNewItemsChange.bind(
                                    this,
                                    "name"
                                )}
                                error={fieldError("name")}
                            />
                        </div>
                        <div className="mr-4 capitalize">
                            <InputField
                                label={`${t("settings.freeMinutes")}`}
                                value={newItems.freeMinutes}
                                className="mb-6"
                                onChange={handleNewItemsChange.bind(
                                    this,
                                    "freeMinutes"
                                )}
                                error={fieldError("freeMinutes")}
                            />
                        </div>
                        <div className="mr-4 capitalize flex items-center">
                            <p>Double scan: </p>
                        </div>
                        <div className="mr-4 capitalize flex items-center">
                            <Checkbox
                                label={t("general.true")}
                                defaultChecked={newItems.doubleScan}
                                onChange={handleNewItemsChange.bind(
                                    this,
                                    "doubleScan",
                                    !newItems.doubleScan
                                )}
                            />
                        </div>
                        <div className="mr-4 capitalize flex items-center">
                            <Checkbox
                                label={t("general.false")}
                                defaultChecked={!newItems.doubleScan}
                                onChange={handleNewItemsChange.bind(
                                    this,
                                    "doubleScan",
                                    !newItems.doubleScan
                                )}
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
