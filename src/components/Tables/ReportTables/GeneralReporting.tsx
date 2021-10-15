import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Loading } from "components";
import { sub, add } from "date-fns";
import { Datepicker, Select, Checkbox } from "components";
import { IParking } from "types";
import {
    getRegions,
    saveRegion,
    deleteRegion,
    getAllCancellations,
    getAllParkigns,
    getCancelStatuses,
    getUsers,
    getEmployeeControls,
    getFranchises,
    getClients,
    getEmployees,
    getParkingTypes,
    getGeneralReport
} from "services";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import {
    useDashboardState,
    useDashboardDispatch,
    SET_REGIONS,
    SET_ALL_CANCELLATIONS,
    SET_EMPLOYEE_CONTROLS
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IGeneralTableProps {
    enableAddNew?: boolean;
}

export const GeneralReporting = ({}: IGeneralTableProps): JSX.Element => {
    const { t } = useTranslation();
    // const { allControls } = useDashboardState();
    const [tmpControls, setTmpControls] = useState([]);
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        regionName: "",
        regionID: undefined
    });
    const [filtersData, setFiltersData] = useState({
        startDate: null,
        endDate: null,
        user: null,
        paymentStatus: null,
        parking: null,
        franchise: null,
        client: null,
        employee: null,
        region: null,
        costCenter: null,
        parkingType: null
    });

    const [parkings, setParkings] = useState([]);
    // const [employees, setEmployees] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [clients, setClients] = useState([]);
    const [regions, setRegions] = useState([]);
    const [parkingTypes, setParkingTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    const loadData = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getGeneralReport({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            parkingId: filtersData.parking?.value,
            clientId: filtersData.client?.value,
            franchiseId: filtersData.franchise?.value,
            regionId: filtersData.region?.value,
            employeeId: filtersData.employee?.value,
            costCenter: filtersData.costCenter,
            parkingTypeId: filtersData.parkingType?.value
        }).then(res => {
            setTableDataLoading(false);
            console.log(res.data.data, "Data");
            // dashboardDispatch({
            //     type: SET_EMPLOYEE_CONTROLS,
            //     payload: [...res.data.data]
            // });
            setTmpControls(res.data.data);
        });
    };

    const fetchParkings = (): void => {
        getAllParkigns().then(res => {
            const { parkings } = res.data;
            setParkings([
                ...parkings.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    };

    const fetchEmployees = (): void => {
        getEmployees().then(res => {
            const { employees } = res.data;

            setEmployees([
                ...employees.map(b => ({
                    label: b.name + " " + b.lastName,
                    value: b.id
                }))
            ]);
        });
    };

    useEffect(() => {
        fetchEmployees();
    }, [setEmployees]);

    useEffect(() => {
        getCancelStatuses().then(res => {
            const { paymentStatuses } = res.data;

            setPaymentStatuses([
                ...paymentStatuses.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    }, [setPaymentStatuses]);

    const fetchFranchises = (): void => {
        getFranchises().then(res => {
            const { franchise } = res.data;
            console.log(franchise, "Franchises");

            setFranchises([
                ...franchise.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    };

    const fetchClients = (): void => {
        getClients().then(res => {
            const { clients } = res.data;
            setClients([
                ...clients.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    };

    const fetchParkingTypes = (): void => {
        getParkingTypes().then(res => {
            const { parkingTypes } = res.data;
            setParkingTypes([
                ...parkingTypes.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    };

    const fetchRegions = (): void => {
        getRegions().then(res => {
            const { regions } = res.data;

            setRegions([
                ...regions.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });
    };

    useEffect(() => {
        fetchClients();
    }, [setClients]);

    useEffect(() => {
        fetchParkingTypes();
    }, [setParkingTypes]);

    useEffect(() => {
        fetchFranchises();
    }, [setFranchises]);

    useEffect(() => {
        fetchRegions();
    }, [setRegions]);

    const loadUsers = (): void => {
        getUsers().then(res => {
            const { users } = res.data;
            setUsers([
                ...users.map(b => ({
                    label: b.userName,
                    value: b.id
                }))
            ]);
        });
    };
    useEffect(() => {
        loadUsers();
    }, [setUsers]);

    useEffect(() => {
        //if (!cancellations.length) {
        loadData();
        //}
    }, [setTmpControls]);

    useEffect(() => {
        //if (!cancellations.length) {
        fetchParkings();
        //}
    }, [setParkings]);

    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const clearStamp = (): void => {
        filtersData.startDate = null;
        filtersData.endDate = null;
        setFiltersData({
            ...filtersData,
            ["startDate"]: null
        });
        setFiltersData({
            ...filtersData,
            ["endDate"]: null
        });
    };

    const handleAddModalToggle = (value, region): void => {
        if (region) {
            addModalData.regionName = region.name;
            addModalData.regionID = region.id;
        } else {
            addModalData.regionName = "";
            addModalData.regionID = undefined;
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
            sortedArray = sort_asc_by_key(tmpControls, i);
        } else {
            sortedArray = sort_desc_by_key(tmpControls, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            {/* <div className="flex">Number of inspections: {tickets.length}</div> */}
            <br />
            <div className="flex">
                <h3>{t("general.date")}:&nbsp;&nbsp;</h3>
                <div className="mr-4">
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "startDate")}
                        selected={filtersData.startDate}
                    />
                </div>
                <div>
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "endDate")}
                        selected={filtersData.endDate}
                    />
                </div>
                &nbsp;&nbsp;
                <Button className="mr-4" onClick={clearStamp}>
                    {t("general.clear")}
                </Button>
            </div>
            <br /> <br />
            <div className="flex flex-wrap">
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.region}
                        onChange={handleFiltersChange.bind(this, "region")}
                        label={`${t("general.region")}`}
                        options={regions}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.employee}
                        onChange={handleFiltersChange.bind(this, "employee")}
                        label={`${t("employee.label")}`}
                        options={employees}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.franchise}
                        onChange={handleFiltersChange.bind(this, "franchise")}
                        label={`${t("client.franchise")}`}
                        options={franchises}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.client}
                        onChange={handleFiltersChange.bind(this, "client")}
                        label={`${t("client.label")}`}
                        options={clients}
                        isClearable={true}
                    />
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.parking}
                        onChange={handleFiltersChange.bind(this, "parking")}
                        label={`${t("general.location")}`}
                        options={parkings}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <InputField
                        value={filtersData.costCenter}
                        type="number"
                        onChange={handleFiltersChange.bind(this, "costCenter")}
                        className={inputClass}
                        label={t("general.costCenter")}
                    />
                </div>
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.parkingType}
                        onChange={handleFiltersChange.bind(this, "parkingType")}
                        label={`${t("settings.parkingType")}`}
                        options={parkingTypes}
                        isClearable={true}
                    />
                </div>
            </div>
            <Button className="mr-4" onClick={loadData}>
                {t("general.show")}
            </Button>
            <ExcelFile
                filename="FreeParkingDataEmployee"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={tmpControls} name="Log">
                    <ExcelColumn label={t("general.region")} value="region" />
                    <ExcelColumn label={t("employee.label")} value="employee" />
                    <ExcelColumn
                        label={t("client.franchise")}
                        value="franchise"
                    />
                    <ExcelColumn label={t("client.label")} value="client" />
                    <ExcelColumn
                        label={t("general.location")}
                        value="parking"
                    />
                    <ExcelColumn
                        label={t("general.costCenter")}
                        value="costcenter"
                    />
                    <ExcelColumn
                        label={t("settings.parkingType")}
                        value="parkingtype"
                    />
                    <ExcelColumn label={t("settings.region")} value="region" />
                    <ExcelColumn
                        label={t("general.year") + " 1"}
                        value="year1"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 1"}
                        value="scanned1"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 1"}
                        value="ontime1"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 1"}
                        value="divided1"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 2"}
                        value="year2"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 2"}
                        value="scanned2"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 2"}
                        value="ontime"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 2"}
                        value="divided2"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 3"}
                        value="year3"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 3"}
                        value="scanned3"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 3"}
                        value="ontime3"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 3"}
                        value="divided3"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 4"}
                        value="year4"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 4"}
                        value="scanned4"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 4"}
                        value="ontime4"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 4"}
                        value="divided4"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 5"}
                        value="year5"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 5"}
                        value="scanned5"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 5"}
                        value="ontime5"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 5"}
                        value="divided5"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 6"}
                        value="year6"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 6"}
                        value="scanned6"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 6"}
                        value="ontime6"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 6"}
                        value="divided6"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 7"}
                        value="year7"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 7"}
                        value="scanned7"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 7"}
                        value="ontime7"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 7"}
                        value="divided7"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 8"}
                        value="year8"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 8"}
                        value="scanned8"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 8"}
                        value="ontime8"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 8"}
                        value="divided8"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 9"}
                        value="year9"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 9"}
                        value="scanned9"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 9"}
                        value="ontime9"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 9"}
                        value="divided9"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 10"}
                        value="year10"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 10"}
                        value="scanned10"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 10"}
                        value="ontime10"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 10"}
                        value="divided10"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 11"}
                        value="year11"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 11"}
                        value="scanned11"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 11"}
                        value="ontime11"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 11"}
                        value="divided11"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 12"}
                        value="year12"
                    />
                    <ExcelColumn
                        label={t("general.scanned") + " 12"}
                        value="scanned12"
                    />
                    <ExcelColumn
                        label={t("general.ontime") + " 12"}
                        value="ontime12"
                    />
                    <ExcelColumn
                        label={t("general.divided") + " 12"}
                        value="divided12"
                    />
                </ExcelSheet>
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("general.region"),
                    t("employee.label"),
                    t("client.franchise"),
                    t("client.label"),
                    t("general.location"),
                    t("general.costCenter"),
                    t("settings.parkingType"),

                    t("general.year") + " 1",
                    t("general.issuedtickets") + " 1",
                    t("general.revenue") + " 1",
                    t("general.revenueAdj") + " 1",
                    t("general.hours") + " 1",
                    t("general.costc") + " 1",
                    t("general.monthlyFee") + " 1",
                    t("general.result") + " 1",
                    t("general.resultDivHour") + " 1",

                    t("general.year") + " 2",
                    t("general.issuedtickets") + " 2",
                    t("general.revenue") + " 2",
                    t("general.revenueAdj") + " 2",
                    t("general.hours") + " 2",
                    t("general.costc") + " 2",
                    t("general.monthlyFee") + " 2",
                    t("general.result") + " 2",
                    t("general.resultDivHour") + " 2",

                    t("general.year") + " 3",
                    t("general.issuedtickets") + " 3",
                    t("general.revenue") + " 3",
                    t("general.revenueAdj") + " 3",
                    t("general.hours") + " 3",
                    t("general.costc") + " 3",
                    t("general.monthlyFee") + " 3",
                    t("general.result") + " 3",
                    t("general.resultDivHour") + " 3",

                    t("general.year") + " 4",
                    t("general.issuedtickets") + " 4",
                    t("general.revenue") + " 4",
                    t("general.revenueAdj") + " 4",
                    t("general.hours") + " 4",
                    t("general.costc") + " 4",
                    t("general.monthlyFee") + " 4",
                    t("general.result") + " 4",
                    t("general.resultDivHour") + " 4",

                    t("general.year") + " 5",
                    t("general.issuedtickets") + " 5",
                    t("general.revenue") + " 5",
                    t("general.revenueAdj") + " 5",
                    t("general.hours") + " 5",
                    t("general.costc") + " 5",
                    t("general.monthlyFee") + " 5",
                    t("general.result") + " 5",
                    t("general.resultDivHour") + " 5",

                    t("general.year") + " 6",
                    t("general.issuedtickets") + " 6",
                    t("general.revenue") + " 6",
                    t("general.revenueAdj") + " 6",
                    t("general.hours") + " 6",
                    t("general.costc") + " 6",
                    t("general.monthlyFee") + " 6",
                    t("general.result") + " 6",
                    t("general.resultDivHour") + " 6",

                    t("general.year") + " 7",
                    t("general.issuedtickets") + " 7",
                    t("general.revenue") + " 7",
                    t("general.revenueAdj") + " 7",
                    t("general.hours") + " 7",
                    t("general.costc") + " 7",
                    t("general.monthlyFee") + " 7",
                    t("general.result") + " 7",
                    t("general.resultDivHour") + " 7",

                    t("general.year") + " 8",
                    t("general.issuedtickets") + " 8",
                    t("general.revenue") + " 8",
                    t("general.revenueAdj") + " 8",
                    t("general.hours") + " 8",
                    t("general.costc") + " 8",
                    t("general.monthlyFee") + " 8",
                    t("general.result") + " 8",
                    t("general.resultDivHour") + " 8",

                    t("general.year") + " 9",
                    t("general.issuedtickets") + " 9",
                    t("general.revenue") + " 9",
                    t("general.revenueAdj") + " 9",
                    t("general.hours") + " 9",
                    t("general.costc") + " 9",
                    t("general.monthlyFee") + " 9",
                    t("general.result") + " 9",
                    t("general.resultDivHour") + " 9",

                    t("general.year") + " 10",
                    t("general.issuedtickets") + " 10",
                    t("general.revenue") + " 10",
                    t("general.revenueAdj") + " 10",
                    t("general.hours") + " 10",
                    t("general.costc") + " 10",
                    t("general.monthlyFee") + " 10",
                    t("general.result") + " 10",
                    t("general.resultDivHour") + " 10",

                    t("general.year") + " 11",
                    t("general.issuedtickets") + " 11",
                    t("general.revenue") + " 11",
                    t("general.revenueAdj") + " 11",
                    t("general.hours") + " 11",
                    t("general.costc") + " 11",
                    t("general.monthlyFee") + " 11",
                    t("general.result") + " 11",
                    t("general.resultDivHour") + " 11",

                    t("general.year") + " 12",
                    t("general.issuedtickets") + " 12",
                    t("general.revenue") + " 12",
                    t("general.revenueAdj") + " 12",
                    t("general.hours") + " 12",
                    t("general.costc") + " 12",
                    t("general.monthlyFee") + " 12",
                    t("general.result") + " 12",
                    t("general.resultDivHour") + " 12"
                ]}
                rows={[
                    ...tmpControls.map(canc => [
                        canc.region,
                        canc.employee,
                        canc.franchise,
                        canc.client,
                        canc.parking,
                        canc.costcenter,
                        canc.parkingtype,

                        canc.year1,
                        canc.issuedTickets1,
                        canc.revenue1,
                        canc.sum1,
                        canc.employeehours1,
                        canc.employeecosts1,
                        canc.monthlyfee1,
                        canc.employeehours1,
                        canc.result1,
                        canc.resultdiv1,

                        canc.year2,
                        canc.issuedTickets2,
                        canc.revenue2,
                        canc.sum2,
                        canc.employeehours2,
                        canc.employeecosts2,
                        canc.monthlyfee2,
                        canc.employeehours2,
                        canc.result2,
                        canc.resultdiv2,

                        canc.year3,
                        canc.issuedTickets3,
                        canc.revenue3,
                        canc.sum3,
                        canc.employeehours3,
                        canc.employeecosts3,
                        canc.monthlyfee3,
                        canc.employeehours3,
                        canc.result3,
                        canc.resultdiv3,

                        canc.year4,
                        canc.issuedTickets4,
                        canc.revenue4,
                        canc.sum4,
                        canc.employeehours4,
                        canc.employeecosts4,
                        canc.monthlyfee4,
                        canc.employeehours4,
                        canc.result4,
                        canc.resultdiv4,

                        canc.year5,
                        canc.issuedTickets5,
                        canc.revenue5,
                        canc.sum5,
                        canc.employeehours5,
                        canc.employeecosts5,
                        canc.monthlyfee5,
                        canc.employeehours5,
                        canc.result5,
                        canc.resultdiv5,

                        canc.year6,
                        canc.issuedTickets6,
                        canc.revenue6,
                        canc.sum6,
                        canc.employeehours6,
                        canc.employeecosts6,
                        canc.monthlyfee6,
                        canc.employeehours6,
                        canc.result6,
                        canc.resultdiv6,

                        canc.year7,
                        canc.issuedTickets7,
                        canc.revenue7,
                        canc.sum7,
                        canc.employeehours7,
                        canc.employeecosts7,
                        canc.monthlyfee7,
                        canc.employeehours7,
                        canc.result7,
                        canc.resultdiv7,

                        canc.year8,
                        canc.issuedTickets8,
                        canc.revenue8,
                        canc.sum8,
                        canc.employeehours8,
                        canc.employeecosts8,
                        canc.monthlyfee8,
                        canc.employeehours8,
                        canc.result8,
                        canc.resultdiv8,

                        canc.year9,
                        canc.issuedTickets9,
                        canc.revenue9,
                        canc.sum9,
                        canc.employeehours9,
                        canc.employeecosts9,
                        canc.monthlyfee9,
                        canc.employeehours9,
                        canc.result9,
                        canc.resultdiv9,

                        canc.year10,
                        canc.issuedTickets10,
                        canc.revenue10,
                        canc.sum10,
                        canc.employeehours10,
                        canc.employeecosts10,
                        canc.monthlyfee10,
                        canc.employeehours10,
                        canc.result10,
                        canc.resultdiv10,

                        canc.year11,
                        canc.issuedTickets11,
                        canc.revenue11,
                        canc.sum11,
                        canc.employeehours11,
                        canc.employeecosts11,
                        canc.monthlyfee11,
                        canc.employeehours11,
                        canc.result11,
                        canc.resultdiv11,

                        canc.year12,
                        canc.issuedTickets12,
                        canc.revenue12,
                        canc.sum12,
                        canc.employeehours12,
                        canc.employeecosts12,
                        canc.monthlyfee12,
                        canc.employeehours12,
                        canc.result12,
                        canc.resultdiv12
                    ])
                ]}
                clicked={onSort}
                keys={[
                    "region",
                    "employee",
                    "franchise",
                    "client",
                    "parking",
                    "costcenter",
                    "parkingtype",
                    "year1",
                    "issuedtickets1",
                    "revenue1",
                    "sum1",
                    "ontime1",
                    "employeecosts1",
                    "result1",
                    "resultdiv1"
                ]}
            />
        </Loading>
    );
};
