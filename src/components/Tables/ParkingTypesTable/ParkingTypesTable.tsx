import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IDefaultProps, IInputError } from "types";
import { getParkingTypes, saveParkingType, deleteParkingType } from "services";
import { Table, InputField, Button, Loading, Modal } from "components";
import {
    useDashboardDispatch,
    useDashboardState,
    SET_PARKING_TYPES
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IParkingTypesTableProps {
    enableAddNew?: boolean;
}

export const ParkingTypesTable = ({
    enableAddNew
}: IParkingTypesTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { parkingTypes } = useDashboardState();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const dashboardDispatch = useDashboardDispatch();
    const [newParkingType, setNewParkingType] = useState("");
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameParkingType: "",
        parkingType: ""
    });

    const loadParkingTypes = (): void => {
        setTableDataLoading(true);
        getParkingTypes().then(res => {
            dashboardDispatch({
                type: SET_PARKING_TYPES,
                payload: [...res.data.parkingTypes]
            });

            setTableDataLoading(false);
        });
    };

    const handleAddModalToggle = (value, parkingType): void => {
        addModalData.parkingType = parkingType.id;
        addModalData.nameParkingType = parkingType.name;
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
        const { nameParkingType, parkingType } = addModalData;
        setTableDataLoading(true);
        saveParkingType({
            name: nameParkingType,
            id: parkingType
        }).then(res => {
            res;
            console.log("submitted");
            loadParkingTypes();
        });

        handleAddModalToggle(false, parkingType);
    };

    useEffect(() => {
        if (!parkingTypes.length) {
            loadParkingTypes();
        }
    }, []);

    const handleNewParkingTypeChange = (e): void => {
        setNewParkingType(e.currentTarget.value);
        setInputErrors([]);
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleAddNewParkingType = (e): void => {
        e.preventDefault();

        const errors = [];

        if (!newParkingType) {
            errors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: t("settings.parkingType")
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            saveParkingType({ name: newParkingType, id: undefined }).then(
                res => {
                    if (res.data.result === "error") {
                        toast.error(res.data.reason);
                    } else {
                        toast(t("settings.newValueSuccessfullyAdded"));
                        setNewParkingType("");
                        loadParkingTypes();
                    }
                }
            );
        }
    };

    const deleteParkingTypeItem = (parkingType): void => {
        deleteParkingType({
            id: parkingType.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteCarBrand"));
                loadParkingTypes();
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
            sortedArray = sort_asc_by_key(parkingTypes, i);
        } else {
            sortedArray = sort_desc_by_key(parkingTypes, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4 header__pointer"
                headings={[t("settings.parkingTypes")]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...parkingTypes.map((parkingType: IDefaultProps) => [
                        parkingType.name,
                        <div key={1} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    parkingType
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteParkingTypeItem.bind(
                                    this,
                                    parkingType
                                )}
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
                        {t("general.ediParking")}
                    </h3>
                    <form onSubmit={handleEditBrandNametSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameParkingType}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameParkingType"
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
                <form onSubmit={handleAddNewParkingType}>
                    <div className="flex flex-row justify-end">
                        <div className="mr-4">
                            <InputField
                                label={t("settings.parkingType")}
                                value={newParkingType}
                                className="mb-6"
                                onChange={handleNewParkingTypeChange}
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
