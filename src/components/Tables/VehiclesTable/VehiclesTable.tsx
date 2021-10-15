import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Table,
    Modal,
    InputField,
    Select,
    formatOptions,
    Loading
} from "components";
import { getVehicles, saveVehicle, deleteVehicle } from "services";
import { useDashboardState, useDashboardDispatch, SET_VEHICLES } from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

export const VehiclesTable = (): JSX.Element => {
    const { t } = useTranslation();
    const { vehicles } = useDashboardState();
    const { carBrands } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        carBrand: null, //name
        carModel: "",
        licencePlate: "",
        vehicleID: undefined
    });
    const loadVehicles = (): void => {
        setTableDataLoading(true);
        getVehicles().then(res => {
            dashboardDispatch({
                type: SET_VEHICLES,
                payload: [...res.data.vehicles]
            });
            setTableDataLoading(false);
        });
    };
    useEffect(() => {
        if (!vehicles.length) {
            loadVehicles();
        }
    });

    const handleAddModalToggle = (value, vehicles): void => {
        if (vehicles) {
            addModalData.carBrand = {
                value: vehicles.carBrand.id,
                label: vehicles.carBrand.name
            };
            addModalData.carModel = vehicles.model;
            addModalData.licencePlate = vehicles.plates;
            addModalData.vehicleID = vehicles.id;
        } else {
            addModalData.carBrand = null;
            addModalData.carModel = "";
            addModalData.licencePlate = "";
            addModalData.vehicleID = undefined;
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

    const handleAddVehicleSubmit = (e): void => {
        e.preventDefault();
        const { carBrand, carModel, licencePlate, vehicleID } = addModalData;
        setTableDataLoading(true);
        saveVehicle({
            id: vehicleID,
            model: carModel,
            plates: licencePlate,
            carBrandId: carBrand.value
        }).then(res => {
            console.log(res);
            loadVehicles();
        });
        handleAddModalToggle(false, null);
    };

    const deleteVehicleItem = (vehicle): void => {
        deleteVehicle({
            id: vehicle.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("vehicles.deleteVehicle"));
                loadVehicles();
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
            sortedArray = sort_asc_by_key(vehicles, i);
        } else {
            sortedArray = sort_desc_by_key(vehicles, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="header__pointer"
                clicked={onSort}
                keys={["brandName", "model", "plates"]}
                headings={[
                    t("general.name"),
                    t("general.model"),
                    t("vehicles.plates")
                ]}
                rows={[
                    ...vehicles.map(vehicles => [
                        vehicles.brandName,
                        vehicles.model,
                        vehicles.plates,
                        <div key={1} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    vehicles
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,

                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteVehicleItem.bind(this, vehicles)}
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
                {t("vehicles.addVehicle")}
            </Button>
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false, null)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("vehicles.addVehicle")}
                    </h3>
                    <form onSubmit={handleAddVehicleSubmit}>
                        <div className={fieldCssClass}>
                            <Select
                                value={addModalData.carBrand}
                                onChange={handleAddModalDataChange.bind(
                                    this,
                                    "carBrand"
                                )}
                                label={t("general.name")}
                                options={formatOptions(carBrands)}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.model")}
                                value={addModalData.carModel}
                                onChange={handleAddModalDataChange.bind(
                                    this,
                                    "carModel"
                                )}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("vehicles.plates")}
                                value={addModalData.licencePlate}
                                onChange={handleAddModalDataChange.bind(
                                    this,
                                    "licencePlate"
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
