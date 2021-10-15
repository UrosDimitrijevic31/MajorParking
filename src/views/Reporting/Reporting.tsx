import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Table,
    Modal,
    InputField,
    Select,
    Tabs,
    Tab,
    Datepicker,
    formatOptions,
    Loading,
    CancellationsTable,
    AllCancellationsTable,
    TotalTime,
    EmployeeControls,
    ShiftsReports,
    ParkingControls,
    FreeParkingData,
    FreeEmployeeParkingData,
    GeneralReporting,
    TimeOnSite,
    TimeOffSite,
    EmployeeCancellations
} from "components";
import { IWhitelist } from "types";
import Chart from "react-google-charts";
import { sub } from "date-fns";
import {
    getWhitelist,
    saveWhitelist,
    getClients,
    getParkings,
    deleteWhiteList,
    getOnParkingData,
    getOutOfParkingData,
    getEmployees,
    getAllParkigns
} from "services";
import { DATE_FORMAT } from "helpers";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_CLIENTS,
    SET_REPORTING_PARKING_DATA
} from "context";
import { IParking, IInputError, IReportDataParking } from "types";
import { toast } from "react-toastify";
import { report } from "process";

import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const fieldCssClass = "mx-2 mb-4";
const fieldCssClassSearch = "flex-auto mx-2 mb-4 w-56";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";
interface IAddWhitelistProps {
    visible: boolean;
    onClose: () => void;
}

const defaultModalData = {
    id: undefined,
    name: "",
    contract: "",
    customerName: "",
    plates: "",
    dateFrom: new Date(),
    dateTo: new Date(),
    carBrand: null,
    client: null,
    parking: null
};

const reportData = {
    data1: [],
    data2: []
};

const exportData = {
    sheet1: [],
    sheet22: []
};

const tabs = { activeTab: 0 };

export const Reporting = ({}: IAddWhitelistProps): JSX.Element => {
    const { t } = useTranslation();
    const [whiltelist, setWhitelist] = useState<IWhitelist[]>([]);
    const [sortedData, setSortedData] = useState({
        key: "",
        asc: false
    });
    const [modalsVisibility, setModalsVisibility] = useState({
        addWhitelist: false,
        uploadFile: false
    });
    const { carBrands, clients, onParkingData } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [employees, setEmployees] = useState([]);
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [parkings, setParkings] = useState([]);
    const [modalData, setModalData] = useState({
        ...defaultModalData
    });

    const [filtersData, setFiltersData] = useState({
        dateFrom: sub(new Date(), { days: 1 }),
        dateTo: new Date(),
        employee: null,
        parking: null
    });

    // useEffect(() => {
    //     getWhitelist({
    //         startStamp: filtersData.dateFrom,
    //         endStamp: filtersData.dateTo
    //     }).then(res => {
    //         const { whitelist } = res.data;
    //         setWhitelist([...whitelist]);
    //     });
    // }, []);

    // const loadWhitelis = (): void => {
    //     getClients().then(res => {
    //         dashboardDispatch({
    //             type: SET_CLIENTS,
    //             payload: res.data.clients
    //         });
    //     });
    // };
    useEffect(() => {
        getEmployees().then(res => {
            const { employees } = res.data;

            setEmployees([
                ...employees.map(b => ({
                    label: b.name + " " + b.lastName,
                    value: b.id
                }))
            ]);
        });
        getAllParkigns().then(res => {
            const { parkings } = res.data;
            setParkings([
                ...parkings.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
        getOnParkingData({
            startStamp: filtersData.dateFrom,
            endStamp: filtersData.dateTo,
            employeeId: filtersData.employee?.value,
            parkingId: filtersData.parking?.value
        }).then(res => {
            console.log(res, "ovo je res");
            const data1 = ["Parking locations", ""];
            const data2 = ["Time spent on parking location", 0];
            res.data.logs.forEach(element => {
                if (element.end !== "") {
                    const label =
                        element.parking.name +
                        ", " +
                        element.start +
                        " - " +
                        element.end;

                    data1.push(label);
                    const nmb = element.timeOnParking / 1000 / 60;
                    data2.push(nmb);
                }
            });
            data1.splice(1, 1);
            data2.splice(1, 1);

            reportData.data1 = data1;
            reportData.data2 = data2;
            console.log(reportData, "Data");

            dashboardDispatch({
                type: SET_REPORTING_PARKING_DATA,
                payload: res.data.logs
            });
        });
    }, []);

    // useEffect(() => {
    //     getParkings(modalData.client.value).then(res => {
    //         setParkings([...res.data.parkings]);
    //     });
    //     setModalData({
    //         ...modalData,
    //         parking: null
    //     });
    // }, [modalData.client]);

    const handleAddModalToggle = (modal, value, listItem): void => {
        if (value) {
            console.log(listItem);
            if (listItem) {
                modalData.id = listItem.id;
                modalData.name = listItem.name;
                modalData.contract = listItem.contract;
                modalData.customerName = listItem.customerName;
                modalData.plates = listItem.plates;
                modalData.dateFrom = new Date(listItem.dateFrom);
                modalData.dateTo = new Date(listItem.dateTo);
                modalData.carBrand = {
                    value: listItem.carBrand.id,
                    label: listItem.carBrand.name
                };
                modalData.client = {
                    value: listItem.client.id,
                    label: listItem.client.name
                };
                getParkings(modalData.client.value).then(res => {
                    setParkings([...res.data.parkings]);
                });
                modalData.parking = {
                    value: listItem.parking.id,
                    label: listItem.parking.name
                };
                console.log(modalData.parking);
            } else {
                modalData.id = undefined;
                modalData.dateFrom = new Date();
                modalData.dateTo = new Date();

                modalData.name = "";
                modalData.contract = "";
                modalData.customerName = "";
                modalData.plates = "";
                modalData.carBrand = "";
                modalData.parking = "";
            }

            setModalData({
                ...modalData
            });
        }
        console.log(modal);
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

        Object.keys(modalData).map(k => {
            if (k === "id") {
                return;
            }
            if (!modalData[k]) {
                validationErrors.push({
                    fieldName: k,
                    error: t("general.isRequired", {
                        value: t("general.field")
                    })
                });
            }
        });

        setInputErrors([...validationErrors]);

        return !validationErrors.length;
    };

    /* Skidanje podataka za vremena provedena van parkinga */
    const showDataOffParking = (): void => {
        /* Podaci van parkinga*/
        getOutOfParkingData({
            startStamp: filtersData.dateFrom,
            employeeId: filtersData.employee?.value,
            parkingId: filtersData.parking?.value
        }).then(res => {
            console.log("ovo je show");
            const data1 = ["Parking locations", ""];
            const data2 = ["Time spent out of parking location", 0];
            res.data.logs.forEach(element => {
                // if (element.end_time) {
                //     if (element.end_time !== "") {
                if (element.pause_time) {
                    const label =
                        element.parking +
                        ", " +
                        element.employee +
                        ", " +
                        element.pause_time +
                        " minutes";

                    data1.push(label);
                    const nmb = element.pause_time;
                    data2.push(nmb);
                }
                //     }
                // }
            });
            data1.splice(1, 1);
            data2.splice(1, 1);

            reportData.data1 = data1;
            reportData.data2 = data2;

            dashboardDispatch({
                type: SET_REPORTING_PARKING_DATA,
                payload: res.data.logs
            });
        });
    };

    /* Skidanje podataka za vremena provedena na parkingu */
    const showDataOnParking = (): void => {
        /* Podaci na parkingu */
        getOnParkingData({
            startStamp: filtersData.dateFrom,
            endStamp: filtersData.dateTo,
            employeeId: filtersData.employee?.value,
            parkingId: filtersData.parking?.value
        }).then(res => {
            console.log("ovo je show");
            const data1 = ["Parking locations", ""];
            const data2 = ["Time spent on parking location", 0];
            res.data.logs.forEach(element => {
                if (element.end !== "") {
                    const label =
                        element.parking.name +
                        ", " +
                        element.start +
                        " - " +
                        element.end;

                    data1.push(label);
                    const nmb = element.timeOnParking / 1000 / 60;
                    data2.push(nmb);

                    //napravi podatke za export

                    const dat = {
                        employee:
                            element.employee.name +
                            " " +
                            element.employee.lastName,
                        parking: element.parking.name,
                        client: element.parking.client.name,
                        start: element.start,
                        end: element.end,
                        value: nmb
                    };
                    exportData.sheet1.push(dat);
                }
            });
            data1.splice(1, 1);
            data2.splice(1, 1);

            reportData.data1 = data1;
            reportData.data2 = data2;

            dashboardDispatch({
                type: SET_REPORTING_PARKING_DATA,
                payload: res.data.logs
            });
        });
    };
    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const setTab = (prop, val): void => {
        alert(val);
        tabs.activeTab = val;
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
            sortedArray = sort_asc_by_key(whiltelist, i);
        } else {
            sortedArray = sort_desc_by_key(whiltelist, i);
        }
    };

    return (
        <section className="whitelist">
            <header>
                <h2 className="heading heading--main">
                    {t("reporting.label")}
                </h2>
            </header>
            <div className="whitelist__content card">
                <Tabs>
                    <Tab title={t("general.sumaryCancellations")}>
                        <h4 className="card__header">
                            {t("general.sumaryCancellations")}
                        </h4>

                        <CancellationsTable />
                    </Tab>
                    <Tab title={t("general.cancellations")}>
                        <h4 className="card__header">
                            {t("general.cancellations")}
                        </h4>

                        <AllCancellationsTable />
                    </Tab>
                    <Tab title={t("general.totalTime")}>
                        <h4 className="card__header">
                            {t("general.totalTime")}
                        </h4>

                        <TotalTime />
                    </Tab>
                    <Tab title={t("general.employeeControls")}>
                        <h4 className="card__header">
                            {t("general.employeeControls")}
                        </h4>

                        <EmployeeControls />
                    </Tab>
                    <Tab title={t("general.locationControls")}>
                        <h4 className="card__header">
                            {t("general.locationControls")}
                        </h4>

                        <ParkingControls />
                    </Tab>
                    <Tab title={t("general.shiftsReports")}>
                        <h4 className="card__header">
                            {t("general.shiftsReports")}
                        </h4>

                        <ShiftsReports />
                    </Tab>
                    <Tab title={t("general.freeParkingData")}>
                        <h4 className="card__header">
                            {t("general.freeParkingData")}
                        </h4>

                        <FreeParkingData />
                    </Tab>
                    <Tab title={t("general.freeEmployeeParkingData")}>
                        <h4 className="card__header">
                            {t("general.freeEmployeeParkingData")}
                        </h4>

                        <FreeEmployeeParkingData />
                    </Tab>
                    <Tab title={t("general.generalReport")}>
                        <h4 className="card__header">
                            {t("general.generalReport")}
                        </h4>

                        <GeneralReporting />
                    </Tab>
                    <Tab title={t("reporting.onParking")}>
                        <h4 className="card__header">
                            {t("reporting.onParking")}
                        </h4>

                        <TimeOnSite />
                    </Tab>
                    <Tab title={t("reporting.pauseTime")}>
                        <h4 className="card__header">
                            {t("reporting.pauseTime")}
                        </h4>

                        <TimeOffSite />
                    </Tab>
                    <Tab title={t("general.employeeCancellations")}>
                        <h4 className="card__header">
                            {t("general.employeeCancellations")}
                        </h4>

                        <EmployeeCancellations />
                    </Tab>
                </Tabs>
            </div>
        </section>
    );
};
