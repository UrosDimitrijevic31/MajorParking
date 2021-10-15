import React, { Component, useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import { useParams, NavLink } from "react-router-dom";
import Routes from "routes";
import {
    getAllParkings,
    getClients,
    getProducts,
    getRegions,
    getFranchises,
    getParkingTypes,
    saveParking,
    getExibitions,
    getParkingInspectionItems,
    getInspectionItems,
    saveParkingInspectionItem,
    deleteParking,
    deleteParkingInspectionItem,
    getIncassoProfiles
} from "services";
import {
    Button,
    Table,
    Modal,
    InputField,
    Select,
    Checkbox,
    Loading
} from "components";
import {
    IParking,
    IFranchise,
    IInputError,
    ISelectOption,
    IParkingInspectionItem
} from "types";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_FRANCHISES,
    SET_CLIENTS,
    SET_PRODUCTS,
    SET_REGIONS,
    SET_PARKING_TYPES,
    SET_EXIBITIONS,
    SET_PARKING_INSPECTION_ITEMS,
    SET_INSPECTION_ITEMS,
    SET_INCASSO_PROFILES
} from "context";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const exportData = {
    sheet1: [],
    sheet22: []
};

const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";
interface IAddLocationForm {
    name: string;
    franchiseName: string;
    costCenter: number;
    contactPerson: string;
    contractNumber: string;
    phone: string;
    product: ISelectOption;
    parkingType: ISelectOption;
    exibition: ISelectOption;
    incassoProfile: ISelectOption;
    warning: string;
    latitude: number;
    longitude: number;
    workingTimeStart: string;
    workingTimeEnd: string;
    // androidVersion: string;
    numberOfSigns: number;
    psaNumber: string;
    contractPeriod: number;
    monthlyFee: number; //string
    paidCancellations: number; //string
    whitelistApproved: boolean;
    inkassoDays: number;
    warningDays: number;
    warningEnabled: boolean;
}

const defaultModalData = {
    workingTimeStart: "10:00",
    workingTimeEnd: "17:00",
    id: undefined,
    name: "",
    franchiseName: "",
    costCenter: 0,
    contactPerson: "",
    contractNumber: "",
    phone: "",
    product: null,
    parkingType: null,
    exibition: null,
    incassoProfile: null,
    warning: "",
    latitude: 0,
    longitude: 0,
    numberOfSigns: 0,
    psaNumber: "",
    monthlyFee: 0,
    paidCancellations: 0,
    contractPeriod: 0,
    whitelistApproved: false,
    region: null,
    address: "",
    city: "",
    zipCode: 0,
    comment: "",
    inkassoDays: 30,
    warningEnabled: false,
    warningDays: 15,
    yellowCardEnabled: false,
    deleteYellowCardDays: 90,
    yellowCardPrice: 0,
    active: true,
    cancellationFee: 0
    // active: false
};

const addItemFormData = {
    id: undefined,
    inspectionItem: null,
    parking: null,
    price: 0
};

// const fieldCssClass = "mx-2 mb-4";
const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";

export const Locations = (): JSX.Element => {
    const { t } = useTranslation();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [modalsVisibility, setModalsVisibility] = useState({
        addLocation: false,
        inspectionItemsModal: false,
        addInspectionItemModal: false,
        currentLocation: null
    });
    const [filtersData, setFiltersData] = useState({
        parkingType: null,
        franchise: null,
        client: null,
        costCenter: "",
        activeOnly: false,
        inactiveOnly: false,
        region: null
    });
    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        if (prop === "activeOnly") {
            if (e) {
                filtersData.inactiveOnly = false;
            }
        }

        if (prop === "inactiveOnly") {
            if (e) {
                filtersData.activeOnly = false;
            }
        }
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const [filterParkingTypes, setFilterParkingTypes] = useState([]);
    const [filterClients, setFilterClients] = useState([]);
    const [filterFranchise, setFilterFranchise] = useState([]);
    const [filterRegions, setFilterRegions] = useState([]);

    const {
        franchises,
        clients,
        parkingTypes,
        products,
        regions,
        exibitions,
        parkingInspectionItems,
        inspectionItems,
        incassoProfiles
    } = useDashboardState();
    const { clientId } = useParams();
    const [client, setClient] = useState<IFranchise>();
    const [locations, setLocations] = useState<IParking[]>([]);
    const dashboardDispatch = useDashboardDispatch();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [modalData, setModalData] = useState({
        ...defaultModalData
    });
    const [modalInspData, setInspModalData] = useState({
        ...addItemFormData
    });
    const loadIncassoProfiles = (): void => {
        console.log("Skida inkasso");

        setTableDataLoading(true);
        getIncassoProfiles().then(res => {
            dashboardDispatch({
                type: SET_INCASSO_PROFILES,
                payload: [...res.data.inkasso]
            });
            setTableDataLoading(false);
        });
    };

    const fetchParkings = (): void => {
        getAllParkings(
            filtersData.parkingType?.value,
            filtersData.franchise?.value,
            filtersData.client?.value,
            filtersData.costCenter,
            filtersData.activeOnly,
            filtersData.inactiveOnly,
            filtersData.region?.value
        ).then(res => {
            const { parkings } = res.data;

            setLocations(parkings);
            setTableDataLoading(false);
        });
    };

    useEffect(() => {
        setTableDataLoading(true);
        fetchParkings();
        // getClients(clientId).then(res => {
        //     setClient(res.data.clients[0]);
        // });
    }, [setLocations]);
    useEffect(() => {
        if (!products.length) {
            getProducts().then(res => {
                const { products } = res.data;

                dashboardDispatch({
                    type: SET_PRODUCTS,
                    payload: products
                });
            });
        }

        if (!filterFranchise.length) {
            getFranchises().then(res => {
                setFilterFranchise([
                    ...res.data.franchise.map(b => ({
                        label: b.name,
                        value: b.id
                    }))
                ]);
            });
        }

        if (!filterClients.length) {
            getClients(null).then(res => {
                setFilterClients([
                    ...res.data.clients.map(b => ({
                        label: b.name,
                        value: b.id
                    }))
                ]);
            });
        }

        if (!filterRegions.length) {
            getRegions().then(res => {
                const { regions } = res.data;
                setFilterRegions([
                    ...res.data.regions.map(b => ({
                        label: b.name,
                        value: b.id
                    }))
                ]);
                dashboardDispatch({
                    type: SET_REGIONS,
                    payload: regions
                });
            });
        }
        if (!filterParkingTypes.length) {
            getParkingTypes().then(res => {
                const { parkingTypes } = res.data;
                setFilterParkingTypes([
                    ...parkingTypes.map(b => ({
                        label: b.name,
                        value: b.id
                    }))
                ]);
                dashboardDispatch({
                    type: SET_PARKING_TYPES,
                    payload: parkingTypes
                });
            });
        }
        if (!exibitions.length) {
            getExibitions().then(res => {
                const { exibitions } = res.data;

                dashboardDispatch({
                    type: SET_EXIBITIONS,
                    payload: exibitions
                });
            });
        }

        loadIncassoProfiles();
    }, []);

    const handleModalInspectionToggle = (modal, value, location): void => {
        console.log("USAO2");

        if (value) {
            modalsVisibility.currentLocation = location;
            getParkingInspectionItems(location.id).then(res => {
                const { parkingInspectionItems } = res.data;
                dashboardDispatch({
                    type: SET_PARKING_INSPECTION_ITEMS,
                    payload: parkingInspectionItems
                });
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const handleAddModalInspectionToggle = (modal, value, item): void => {
        if (value) {
            getInspectionItems().then(res => {
                const { inspectionItems } = res.data;
                dashboardDispatch({
                    type: SET_INSPECTION_ITEMS,
                    payload: inspectionItems
                });
                if (item) {
                    modalInspData.id = item.id;
                    modalInspData.price = item.price;
                    modalInspData.inspectionItem = {
                        value: item.inspectionItem.id,
                        label: item.inspectionItem.name
                    };
                    modalInspData.parking = modalsVisibility.currentLocation;
                } else {
                    modalInspData.id = undefined;
                    modalInspData.price = 0;
                    modalInspData.inspectionItem = null;
                    modalInspData.parking = modalsVisibility.currentLocation;
                }

                setInspModalData({
                    ...modalInspData
                });
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const handleModalItemChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;
        console.log(value, "CHANGE");

        setInspModalData({
            ...modalInspData,
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

    const handleAddModalToggle = (modal, value, listItem): void => {
        if (value) {
            if (listItem) {
                modalData.id = listItem.id;
                modalData.name = listItem.name;
                modalData.costCenter = listItem.costCenter;
                modalData.contactPerson = listItem.contactPerson;
                modalData.contractNumber = listItem.contractNumber;
                modalData.phone = listItem.phone;
                modalData.warning = listItem.warning;
                modalData.latitude = listItem.latitude;
                modalData.longitude = listItem.longitude;
                modalData.workingTimeStart = listItem.workingTimeStart;
                modalData.workingTimeEnd = listItem.workingTimeEnd;
                modalData.numberOfSigns = listItem.numberOfSigns;
                modalData.psaNumber = listItem.psaNumber;
                modalData.monthlyFee = listItem.monthlyFee;
                modalData.paidCancellations = listItem.paidCancellations;
                modalData.contractPeriod = listItem.contractPeriod;
                modalData.whitelistApproved = listItem.whitelistApproved;

                modalData.warningEnabled = listItem.warningEnabled;
                modalData.warningDays = listItem.warningDays;
                modalData.inkassoDays = listItem.inkassoDays;

                modalData.yellowCardEnabled = listItem.yellowCardEnabled;
                modalData.deleteYellowCardDays = listItem.deleteYellowCardDays;
                modalData.yellowCardPrice = listItem.yellowCardPrice;
                modalData.active = listItem.active;

                modalData.product = {
                    value: listItem.product.id,
                    label: listItem.product.name
                };
                modalData.exibition = {
                    value: listItem.exibition.id,
                    label: listItem.exibition.name
                };
                // getParkings(modalData.client.value).then(res => {
                //     setLocations([...res.data.parkings]);
                // });
                modalData.parkingType = {
                    value: listItem.parkingType.id,
                    label: listItem.parkingType.name
                };
                modalData.incassoProfile = {
                    value: listItem.inkasso.id,
                    label: listItem.inkasso.name
                };

                modalData.region = {
                    value: listItem.region.id,
                    label: listItem.region.name
                };
            } else {
                modalData.id = undefined;
                modalData.name = "";
                modalData.contactPerson = "";
                modalData.contractNumber = "";
                modalData.phone = "";
                modalData.warning = "";
                modalData.workingTimeStart = "10:00";
                modalData.workingTimeEnd = "17:00";
                modalData.psaNumber = "";
                modalData.monthlyFee = 0;
                modalData.paidCancellations = 0;
                modalData.contractPeriod = 0;
                modalData.product = null;
                modalData.exibition = null;
                modalData.parkingType = null;
                modalData.incassoProfile = null;
                modalData.whitelistApproved = false;
                modalData.region = null;

                modalData.yellowCardEnabled = false;
                modalData.deleteYellowCardDays = 90;
                modalData.yellowCardPrice = 0;
                modalData.active = true;
            }

            setModalData({
                ...modalData
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };
    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setModalData({
            ...modalData,
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

    const isFormValid = (): boolean => {
        const validationErrors = [];

        if (!modalData.name) {
            validationErrors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: t("general.name")
                })
            });
        }
        if (!modalData.contactPerson) {
            validationErrors.push({
                fieldName: "contactPerson",
                error: t("general.isRequired", {
                    value: t("general.contactPerson")
                })
            });
        }

        if (!modalData.product) {
            validationErrors.push({
                fieldName: "product",
                error: t("general.isRequired", {
                    value: t("general.product")
                })
            });
        }

        if (!modalData.region) {
            validationErrors.push({
                fieldName: "region",
                error: t("general.isRequired", {
                    value: t("general.region")
                })
            });
        }

        if (!modalData.exibition) {
            validationErrors.push({
                fieldName: "exibition",
                error: t("general.isRequired", {
                    value: t("settings.exibition")
                })
            });
        }
        if (!modalData.parkingType) {
            validationErrors.push({
                fieldName: "parkingType",
                error: t("general.isRequired", {
                    value: t("settings.parkingType")
                })
            });
        }
        if (!modalData.incassoProfile) {
            validationErrors.push({
                fieldName: "incassoProfile",
                error: t("general.isRequired", {
                    value: t("incasso.label")
                })
            });
        }

        setInputErrors([...validationErrors]);
        console.log(validationErrors, "this is validation errors");
        return !validationErrors.length;
    };

    const isFormAddInspValid = (): boolean => {
        const validationErrors = [];

        Object.keys(modalInspData).map(k => {
            if (k === "id") {
                return;
            }
            if (!modalInspData[k]) {
                validationErrors.push({
                    fieldName: k,
                    error: t("general.isRequired", {
                        value: t("general.field")
                    })
                });
            }
        });

        setInputErrors([...validationErrors]);
        console.log(validationErrors, "this is validation errors");
        return !validationErrors.length;
    };

    const handleAddLocationSubmit = (e): void => {
        e.preventDefault();
        // const {
        //     id,
        //     contactPerson,
        //     costCenter,
        //     name,
        //     phone,
        //     contractPeriod,
        //     warning,
        //     latitude,
        //     longitude,
        //     workingTimeStart,
        //     workingTimeEnd,
        //     numberOfSigns,
        //     psaNumber,
        //     contractNumber,
        //     monthlyFee,
        //     paidCancellations,
        //     whitelistApproved,
        //     city,
        //     address,
        //     zipCode,
        //     comment,
        //     inkassoDays,
        //     warningDays,
        //     warningEnabled,
        //     yellowCardEnabled,
        //     deleteYellowCardDays,
        //     yellowCardPrice,
        //     active,
        //     cancellationFee
        // } = modalData;
        // setTableDataLoading(true);
        // console.log(modalData.id);
        // if (isFormValid()) {
        //     saveParking({
        //         id,
        //         contactPerson,
        //         name,
        //         costCenter,
        //         phone,
        //         contractPeriod,
        //         warning,
        //         latitude,
        //         longitude,
        //         workingTimeStart,
        //         workingTimeEnd,
        //         numberOfSigns,
        //         psaNumber,
        //         contractNumber,
        //         monthlyFee,
        //         paidCancellations,
        //         whitelistApproved,
        //         clientId: clientId,
        //         productId: modalData.product?.value,
        //         parkingTypeId: modalData.parkingType?.value,
        //         exibitionId: modalData.exibition?.value,
        //         inkassoId: modalData.incassoProfile?.value,
        //         regionId: modalData.region?.value,
        //         city,
        //         address,
        //         zipCode,
        //         comment,
        //         inkassoDays,
        //         warningDays,
        //         warningEnabled,
        //         yellowCardEnabled,
        //         deleteYellowCardDays,
        //         yellowCardPrice,
        //         active,
        //         cancellationFee
        //     }).then(res => {
        //         if (res.data.result === "error") {
        //             toast.error(res.data.reason);
        //         } else {
        //             modalData.id === undefined
        //                 ? toast(t("client.locationAdded"))
        //                 : toast(t("client.locationUpdated"));
        //             // getParkings(clientId).then(res => {
        //             //     const { parkings } = res.data;
        //             //     setLocations(parkings);
        //             //     setTableDataLoading(false);
        //             // });
        //             fetchParkings();
        //             // loadIncassoProfiles
        //             getClients().then(res => {
        //                 dashboardDispatch({
        //                     type: SET_CLIENTS,
        //                     payload: res.data.clients
        //                 });
        //             });
        //             console.log("submited");
        //             const modal = "addLocation";
        //             const value = false;
        //             setModalsVisibility({
        //                 ...modalsVisibility,
        //                 [modal]: value ? value : !modalsVisibility[modal]
        //             });
        //         }
        //     });
        // }
    };
    const handleAddParkingItemSubmit = (e): void => {
        e.preventDefault();
        if (isFormAddInspValid()) {
            saveParkingInspectionItem({
                id: modalInspData.id,
                inspectionItem: modalInspData.inspectionItem.value,
                parking: modalInspData.parking,
                price: modalInspData.price
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("client.inspectionSuccessfullyAdded"));
                    getParkingInspectionItems(
                        modalsVisibility.currentLocation.id
                    ).then(res => {
                        const { parkingInspectionItems } = res.data;
                        dashboardDispatch({
                            type: SET_PARKING_INSPECTION_ITEMS,
                            payload: parkingInspectionItems
                        });
                    });
                    const modal = "addInspectionItemModal";
                    const value = false;
                    setModalsVisibility({
                        ...modalsVisibility,
                        [modal]: value ? value : !modalsVisibility[modal]
                    });
                }
            });
        }
    };
    const deleteParkingItem = (parking): void => {
        deleteParking({
            id: parking.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("administration.deleteLocation"));
                // getParkings(clientId).then(res => {
                //     const { parkings } = res.data;
                //     setLocations(parkings);
                // });
                fetchParkings();
            }
        });
    };
    const deleteParkingInspectionItemS = (item): void => {
        deleteParkingInspectionItem({
            id: item.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("client.deleteInspectionItem"));
                console.log(modalsVisibility.currentLocation.id);
                getParkingInspectionItems(
                    modalsVisibility.currentLocation.id
                ).then(res => {
                    const { parkingInspectionItems } = res.data;
                    dashboardDispatch({
                        type: SET_PARKING_INSPECTION_ITEMS,
                        payload: parkingInspectionItems
                    });
                });
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
            sortedArray = sort_asc_by_key(locations, i);
        } else {
            sortedArray = sort_desc_by_key(locations, i);
        }
    };

    return (
        <section className="client-locations card w-full">
            <header className="card__header">
                {/* {t("client.locationsLabel")}{" "}
                {client && (
                    <span className="font-medium uppercase">{client.name}</span>
                )} */}
            </header>
            {/* <NavLink
                key={11}
                className="btn btn--secondary py-2 px-6 mt-4 inline-block"
                to={`${Routes.dashboard.administration.path}`}
            >
                {t("general.back")}
            </NavLink> */}
            <div className="inspection__filters mb-12">
                <div className="flex">
                    Number of locations: {locations.length}
                </div>
                <br />
                <div className="flex flex-wrap">
                    <div className={fieldCssClass}>
                        <InputField
                            className="mb-6"
                            value={filtersData.costCenter}
                            onChange={handleFiltersChange.bind(
                                this,
                                "costCenter"
                            )}
                            label={t("general.costCenter")}
                        />
                    </div>
                    {/* ovo je francshise */}
                    <div className={fieldCssClass}>
                        <Select
                            value={filtersData.franchise}
                            onChange={handleFiltersChange.bind(
                                this,
                                "franchise"
                            )}
                            label={t("client.franchise")}
                            options={filterFranchise}
                            isClearable={true}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <Select
                            value={filtersData.client}
                            onChange={handleFiltersChange.bind(this, "client")}
                            label={t("client.label")}
                            options={filterClients}
                            isClearable={true}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <Select
                            value={filtersData.region}
                            onChange={handleFiltersChange.bind(this, "region")}
                            label={t("general.region")}
                            options={filterRegions}
                            isClearable={true}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className={fieldCssClass}>
                        <Select
                            value={filtersData.parkingType}
                            onChange={handleFiltersChange.bind(
                                this,
                                "parkingType"
                            )}
                            label={t("settings.parkingType")}
                            options={filterParkingTypes}
                            isClearable={true}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <Checkbox
                            label={`${t("general.onlyActive")}`}
                            defaultChecked={filtersData.activeOnly}
                            onChange={handleFiltersChange.bind(
                                this,
                                "activeOnly",
                                !filtersData.activeOnly
                            )}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <Checkbox
                            label={`${t("general.onlyInactive")}`}
                            defaultChecked={filtersData.inactiveOnly}
                            onChange={handleFiltersChange.bind(
                                this,
                                "inactiveOnly",
                                !filtersData.inactiveOnly
                            )}
                        />
                    </div>
                </div>
            </div>
            &nbsp;&nbsp;&nbsp;
            <Button className="mr-4" onClick={fetchParkings}>
                {t("general.show")}
            </Button>
            <ExcelFile
                filename="Locations"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={locations} name="Log">
                    <ExcelColumn
                        label={t("general.costCenter")}
                        value="costCenter"
                    />
                    <ExcelColumn
                        label={t("client.franchise")}
                        value="franchiseName"
                    />
                    <ExcelColumn
                        label={t("inspection.siteName")}
                        value="name"
                    />
                    <ExcelColumn label={t("general.city")} value="city" />
                    <ExcelColumn label={t("general.address")} value="address" />
                    <ExcelColumn label={t("general.zipCode")} value="zipCode" />
                    <ExcelColumn
                        label={t("general.region")}
                        value="regionName"
                    />
                    <ExcelColumn
                        label={t("client.contactPerson")}
                        value="contactPerson"
                    />
                    <ExcelColumn label={t("general.phone")} value="phone" />
                    <ExcelColumn
                        label={t("client.contractPeriod")}
                        value="contractPeriod"
                    />
                    <ExcelColumn
                        label={t("client.contractNumber")}
                        value="contractNumber"
                    />
                    <ExcelColumn
                        label={t("general.type")}
                        value="parkingTypeName"
                    />
                    <ExcelColumn
                        label={t("general.product")}
                        value="productName"
                    />
                    <ExcelColumn
                        label={t("general.exhibition")}
                        value="exibitionName"
                    />
                    <ExcelColumn
                        label={t("general.latitude")}
                        value="latitude"
                    />
                    <ExcelColumn
                        label={t("general.longitude")}
                        value="longitude"
                    />
                    <ExcelColumn
                        label={t("general.workingTimeStart")}
                        value="workingTimeStart"
                    />
                    <ExcelColumn
                        label={t("general.workingTimeEnd")}
                        value="workingTimeEnd"
                    />
                    <ExcelColumn
                        label={t("client.signsNumber")}
                        value="numberOfSigns"
                    />
                    <ExcelColumn
                        label={t("client.psaNumber")}
                        value="psaNumber"
                    />
                    <ExcelColumn
                        label={t("client.monthlyFee")}
                        value="monthlyFee"
                    />
                    <ExcelColumn
                        label={t("client.paidCancelations")}
                        value="paidCancellations"
                    />
                    <ExcelColumn
                        label={t("incasso.label")}
                        value="inkassoName"
                    />
                    <ExcelColumn
                        label={t("general.inkassoDays")}
                        value="inkassoDays"
                    />
                    <ExcelColumn
                        label={t("general.warningEnabled")}
                        value="warningEnabled"
                    />
                    <ExcelColumn
                        label={t("general.warningDays")}
                        value="warningDays"
                    />
                    <ExcelColumn label={t("general.comment")} value="comment" />
                </ExcelSheet>
            </ExcelFile>
            <div className="client-locations__content">
                <Loading isLoading={tableDataLoading}>
                    <Table
                        className="header__pointer"
                        headings={[
                            t("general.status"),
                            t("client.franchise"),
                            t("client.label"),
                            t("general.costCenter"),
                            t("inspection.siteName"),
                            t("general.address"),
                            t("general.region"),
                            t("client.contactPerson"),
                            t("general.phone"),
                            t("client.contractPeriod"),
                            t("client.contractNumber"),
                            t("general.type"),
                            t("general.product"),
                            t("general.exhibition"),
                            t("incasso.label"),
                            t("general.warning"),
                            t("general.yellowCard"),
                            t("client.gpsLocation"),
                            t("client.workingTime"),
                            t("client.signsNumber"),
                            t("client.psaNumber"),
                            t("client.monthlyFee"),
                            t("client.paidCancelations")
                        ]}
                        keys={[
                            "active",
                            "franchiseName",
                            "clientName",
                            "costCenter",
                            "name",
                            "completeAddress",
                            "regionName",
                            "contactPerson",
                            "phone",
                            "contractPeriod",
                            "contractNumber",
                            "parkingTypeName",
                            "productName",
                            "exibitionName",
                            "inkassoName",
                            "warningEnabled",
                            "yellowCardEnabled",
                            "latitude",
                            "workingTimeStart",
                            "numberOfSigns",
                            "psaNumber",
                            "monthlyFee",
                            "paidCancellations"
                        ]}
                        clicked={onSort}
                        rows={[
                            ...locations.map((l: IParking) => [
                                l.active
                                    ? t("general.active")
                                    : t("general.inactive"),
                                l.client?.franchise?.name,
                                l.client?.name,
                                l.costCenter,
                                l.name,
                                l.completeAddress,
                                l.region?.name,
                                l.contactPerson,
                                l.phone,
                                l.contractPeriod,
                                l.contractNumber,
                                l.parkingType.name,
                                l.product.name,
                                l.exibition.name,
                                l.inkasso?.name,
                                l.warningEnabled
                                    ? t("general.yes")
                                    : t("general.no"),
                                l.yellowCardEnabled
                                    ? t("general.yes")
                                    : t("general.no"),
                                `${l.latitude.toFixed(
                                    2
                                )}, ${l.longitude.toFixed(2)}`,
                                `${l.workingTimeStart.split(":")[0]}-${
                                    l.workingTimeEnd.split(":")[0]
                                }`,
                                l.numberOfSigns,
                                l.psaNumber,
                                l.monthlyFee,
                                l.paidCancellations,
                                <div key={1} className="text-right">
                                    <button
                                        onClick={handleModalInspectionToggle.bind(
                                            this,
                                            "inspectionItemsModal",
                                            true,
                                            l
                                        )}
                                        className={buttonLinkStyle}
                                    >
                                        {t("client.inspectionItems")}
                                    </button>
                                </div>
                                // <div key={1} className="text-right">
                                //     <button
                                //         onClick={handleAddModalToggle.bind(
                                //             this,
                                //             "addLocation",
                                //             true,
                                //             l
                                //         )}
                                //         className={buttonLinkStyle}
                                //     >
                                //         {t("general.edit")}
                                //     </button>
                                // </div>,
                                // <div key={1} className="text-right">
                                //     <button
                                //         key={1}
                                //         className={buttonLinkStyle}
                                //         onClick={deleteParkingItem.bind(
                                //             this,
                                //             l
                                //         )}
                                //     >
                                //         {t("general.delete")}
                                //     </button>
                                // </div>
                            ])
                        ]}
                    />
                    {/* <Button
                        onClick={handleAddModalToggle.bind(
                            this,
                            "addLocation",
                            true,
                            null
                        )}
                        className="btn btn--primary py-2 px-6 mt-4 inline-block"
                    >
                        {t("client.addLocation")}
                    </Button> */}
                </Loading>
            </div>
            <Modal
                visible={modalsVisibility.addLocation}
                onClose={handleAddModalToggle.bind(this, "addLocation", false)}
            >
                <div className="add-modal-content min-w-600 max-w-screen">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-6">
                        {t("client.addLocation")}
                    </h3>
                    <form onSubmit={handleAddLocationSubmit}>
                        {/* <div>
                            <TimePicker
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "workingTimeStart"
                                )}
                                value={modalData.workingTimeStart}
                            />
                        </div>
                        <div>
                            <TimePicker
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "workingTimeEnd"
                                )}
                                value={modalData.workingTimeEnd}
                            />
                        </div> */}
                        <table>
                            <tr>
                                <td>
                                    <InputField
                                        value={modalData.costCenter}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "costCenter"
                                        )}
                                        className={inputClass}
                                        label={t("general.costCenter")}
                                        error={fieldError("costCenter")}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.name}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "name"
                                        )}
                                        className={inputClass}
                                        label={t("inspection.siteName")}
                                        error={fieldError("name")}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.city}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "city"
                                        )}
                                        className={inputClass}
                                        label={t("general.city")}
                                        error={fieldError("city")}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.address}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "address"
                                        )}
                                        className={inputClass}
                                        label={t("general.address")}
                                        error={fieldError("address")}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.zipCode}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "zipCode"
                                        )}
                                        className={inputClass}
                                        label={t("general.zipCode")}
                                        error={fieldError("zipCode")}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputField
                                        value={modalData.contactPerson}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "contactPerson"
                                        )}
                                        className={inputClass}
                                        label={t("client.contactPerson")}
                                        error={fieldError("contactPerson")}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.phone}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "phone"
                                        )}
                                        className={inputClass}
                                        label={t("general.phone")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.contractPeriod}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "contractPeriod"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("client.contractPeriod")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.contractNumber}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "contractNumber"
                                        )}
                                        className={inputClass}
                                        label={t("client.contractNumber")}
                                        type="contractNumber"
                                    />
                                </td>
                                <td>
                                    <p>{t("general.active")} </p>
                                    <div className="mr-4 capitalize flex items-center">
                                        <Checkbox
                                            label={t("general.true")}
                                            defaultChecked={modalData.active}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "active",
                                                !modalData.active
                                            )}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className={inputClass}>
                                        <Select
                                            value={modalData.parkingType}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "parkingType"
                                            )}
                                            label={t("general.type")}
                                            options={parkingTypes.map(v => ({
                                                label: `${v.name}`,
                                                value: v.id
                                            }))}
                                            isClearable={true}
                                            error={fieldError("parkingType")}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={inputClass}>
                                        <Select
                                            value={modalData.product}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "product"
                                            )}
                                            label={t("general.product")}
                                            options={products.map(v => ({
                                                label: `${v.name}`,
                                                value: v.id
                                            }))}
                                            isClearable={true}
                                            error={fieldError("product")}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={inputClass}>
                                        <Select
                                            value={modalData.region}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "region"
                                            )}
                                            label={t("general.region")}
                                            options={regions.map(v => ({
                                                label: `${v.name}`,
                                                value: v.id
                                            }))}
                                            isClearable={true}
                                            error={fieldError("region")}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={inputClass}>
                                        <Select
                                            value={modalData.exibition}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "exibition"
                                            )}
                                            label={t("general.exhibition")}
                                            options={exibitions.map(v => ({
                                                label: `${v.name}`,
                                                value: v.id
                                            }))}
                                            isClearable={true}
                                            error={fieldError("exibition")}
                                        />
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{t("general.warning")}: </p>
                                    <div className="mr-4 capitalize flex items-center">
                                        <Checkbox
                                            label={t("general.true")}
                                            defaultChecked={
                                                modalData.warningEnabled
                                            }
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "warningEnabled",
                                                !modalData.warningEnabled
                                            )}
                                        />
                                    </div>
                                    <div className="mr-4 capitalize flex items-center">
                                        <Checkbox
                                            label={t("general.false")}
                                            defaultChecked={
                                                !modalData.warningEnabled
                                            }
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "warningEnabled",
                                                !modalData.warningEnabled
                                            )}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.warningDays}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "warningDays"
                                        )}
                                        className={inputClass}
                                        label={t("general.warningDays")}
                                        error={fieldError("warningDays")}
                                    />
                                </td>
                                <td>
                                    <div className={inputClass}>
                                        <Select
                                            value={modalData.incassoProfile}
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "incassoProfile"
                                            )}
                                            label={t("incasso.label")}
                                            options={incassoProfiles.map(v => ({
                                                label: `${v.name}`,
                                                value: v.id
                                            }))}
                                            isClearable={true}
                                            error={fieldError("incassoProfile")}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.inkassoDays}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "inkassoDays"
                                        )}
                                        className={inputClass}
                                        label={t("general.inkassoDays")}
                                        error={fieldError("inkassoDays")}
                                    />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{t("general.yellowCard")}: </p>
                                    <div className="mr-4 capitalize flex items-center">
                                        <Checkbox
                                            label={t("general.true")}
                                            defaultChecked={
                                                modalData.yellowCardEnabled
                                            }
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "yellowCardEnabled",
                                                !modalData.yellowCardEnabled
                                            )}
                                        />
                                    </div>
                                    <div className="mr-4 capitalize flex items-center">
                                        <Checkbox
                                            label={t("general.false")}
                                            defaultChecked={
                                                !modalData.yellowCardEnabled
                                            }
                                            onChange={handleModalDataChange.bind(
                                                this,
                                                "yellowCardEnabled",
                                                !modalData.yellowCardEnabled
                                            )}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.deleteYellowCardDays}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "deleteYellowCardDays"
                                        )}
                                        type="number"
                                        className={inputClass}
                                        label={t(
                                            "general.deleteYellowCardDays"
                                        )}
                                        error={fieldError(
                                            "deleteYellowCardDays"
                                        )}
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.yellowCardPrice}
                                        type="number"
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "yellowCardPrice"
                                        )}
                                        className={inputClass}
                                        label={t("general.yellowCardPrice")}
                                        error={fieldError("yellowCardPrice")}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputField
                                        value={modalData.latitude}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "latitude"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("general.latitude")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.longitude}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "longitude"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("general.longitude")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.workingTimeStart}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "workingTimeStart"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("client.workingTimeStart")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.workingTimeEnd}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "workingTimeEnd"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("client.workingTimeEnd")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.numberOfSigns}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "numberOfSigns"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("client.signsNumber")}
                                        type="text"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputField
                                        value={modalData.psaNumber}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "psaNumber"
                                        )}
                                        className={`${inputClass} min-w-1/2`}
                                        label={t("client.psaNumber")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.monthlyFee}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "monthlyFee"
                                        )}
                                        className={`${inputClass}`}
                                        label={t("client.monthlyFee")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.paidCancellations}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "paidCancellations"
                                        )}
                                        className={inputClass}
                                        label={t("client.paidCancelations")}
                                        type="text"
                                    />
                                </td>
                                <td>
                                    <InputField
                                        value={modalData.comment}
                                        onChange={handleModalDataChange.bind(
                                            this,
                                            "comment"
                                        )}
                                        className={inputClass}
                                        label={t("general.comment")}
                                        error={fieldError("comment")}
                                    />
                                </td>
                                <td></td>
                            </tr>
                        </table>
                        {/* <div className="flex flex-wrap mb-4"> */}
                        {/* <InputField
                                value={modalData.warning}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "warning"
                                )}
                                className={`${inputClass} min-w-1/2`}
                                label={t("general.warning")}
                                type="text"
                            /> */}
                        {/* </div> */}
                        {/* <p>Whitelist approved: </p>
                        <div className="mr-4 capitalize flex items-center">
                            <Checkbox
                                label={t("general.true")}
                                defaultChecked={modalData.whitelistApproved}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "whitelistApproved",
                                    !modalData.whitelistApproved
                                )}
                            />
                        </div>
                        <div className="mr-4 capitalize flex items-center">
                            <Checkbox
                                label={t("general.false")}
                                defaultChecked={!modalData.whitelistApproved}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "whitelistApproved",
                                    !modalData.whitelistApproved
                                )}
                            />
                        </div> */}
                        <div className="text-center">
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
                                    "addLocation",
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
            <Modal
                visible={modalsVisibility.inspectionItemsModal}
                onClose={handleModalInspectionToggle.bind(
                    this,
                    "inspectionItemsModal",
                    false
                )}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("client.inspectionItems")}
                </h3>
                <Table
                    className="mb-4"
                    headings={[
                        t("general.name"),
                        t("inspection.freeMinutes"),
                        t("general.price"),
                        "",
                        ""
                    ]}
                    rows={[
                        ...parkingInspectionItems.map(
                            (item: IParkingInspectionItem) => [
                                item.inspectionItem.name,
                                <div key={1} className="text-center">
                                    {item.inspectionItem.freeMinutes}
                                </div>,
                                `${item.price} eur`,
                                <div key={1} className="text-right">
                                    <button
                                        className={buttonLinkStyle}
                                        onClick={handleAddModalInspectionToggle.bind(
                                            this,
                                            "addInspectionItemModal",
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
                                        onClick={deleteParkingInspectionItemS.bind(
                                            this,
                                            item
                                        )}
                                    >
                                        {t("general.delete")}
                                    </button>
                                </div>
                            ]
                        )
                    ]}
                />
                <form action="">
                    <div className="text-center">
                        <Button
                            onClick={handleAddModalInspectionToggle.bind(
                                this,
                                "addInspectionItemModal",
                                true,
                                null
                            )}
                            className="mr-4"
                            type="button"
                            color="success"
                        >
                            {t("general.add")}
                        </Button>
                        <Button
                            onClick={handleModalInspectionToggle.bind(
                                this,
                                "inspectionItemsModal",
                                false
                            )}
                            color="danger"
                        >
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                visible={modalsVisibility.addInspectionItemModal}
                onClose={handleAddModalInspectionToggle.bind(
                    this,
                    "addInspectionItemModal",
                    false,
                    null
                )}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("client.addInspectionItems")}
                </h3>
                <form onSubmit={handleAddParkingItemSubmit}>
                    <div className={inputClass}>
                        <Select
                            value={modalInspData.inspectionItem}
                            onChange={handleModalItemChange.bind(
                                this,
                                "inspectionItem"
                            )}
                            label={t("client.inspectionItems")}
                            options={inspectionItems.map(v => ({
                                label: `${v.name}`,
                                value: v.id
                            }))}
                            isClearable={true}
                            error={fieldError("inspectionItems")}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalInspData.price}
                            onChange={handleModalItemChange.bind(this, "price")}
                            className={inputClass}
                            label={t("general.price")}
                            error={fieldError("price")}
                        />
                    </div>
                    <div className="text-center">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button
                            onClick={handleAddModalInspectionToggle.bind(
                                this,
                                "addInspectionItemModal",
                                false
                            )}
                            color="danger"
                            type="button"
                        >
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
};
