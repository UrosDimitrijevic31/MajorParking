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
    getParkingControls,
    getFranchises,
    getClients,
    getEmployees,
    getParkingTypes
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

interface IParkingControlsTableProps {
    enableAddNew?: boolean;
}

export const ParkingControls = ({}: IParkingControlsTableProps): JSX.Element => {
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
        startDate: sub(new Date(), { months: 1 }),
        endDate: add(new Date(), {
            years: 0,
            months: 0,
            weeks: 0,
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0
        }),
        startTicketDate: null,
        endTicketDate: null,
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
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    const loadData = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getParkingControls({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            parkingId: filtersData.parking?.value,
            clientId: filtersData.client?.value,
            franchiseId: filtersData.franchise?.value,
            regionId: filtersData.region?.value,
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

    const clearTicketStamp = (): void => {
        filtersData.startTicketDate = null;
        filtersData.endTicketDate = null;
        setFiltersData({
            ...filtersData,
            ["startTicketDate"]: null
        });
        setFiltersData({
            ...filtersData,
            ["endTicketDate"]: null
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
                filename="ParkingControls"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={tmpControls} name="Log">
                    <ExcelColumn label={t("general.region")} value="region" />
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
                    <ExcelColumn label={t("general.year")} value="year" />
                    <ExcelColumn label={"1"} value="1" />
                    <ExcelColumn label={"2"} value="2" />
                    <ExcelColumn label={"3"} value="3" />
                    <ExcelColumn label={"4"} value="4" />
                    <ExcelColumn label={"5"} value="5" />
                    <ExcelColumn label={"6"} value="6" />
                    <ExcelColumn label={"7"} value="7" />
                    <ExcelColumn label={"8"} value="8" />
                    <ExcelColumn label={"9"} value="9" />
                    <ExcelColumn label={"10"} value="10" />
                    <ExcelColumn label={"11"} value="11" />
                    <ExcelColumn label={"12"} value="12" />
                    <ExcelColumn
                        label={t("general.totalControls")}
                        value="total"
                    />
                </ExcelSheet>
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("general.region"),
                    t("client.franchise"),
                    t("client.label"),
                    t("general.location"),
                    t("general.costCenter"),
                    t("settings.parkingType"),
                    t("general.year"),
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    t("general.totalControls")
                ]}
                clicked={onSort}
                keys={[
                    "region",
                    "franchise",
                    "client",
                    "parking",
                    "costcenter",
                    "parkingtype",
                    "year",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "total"
                ]}
                rows={[
                    ...tmpControls.map(canc => [
                        canc.region,
                        canc.franchise,
                        canc.client,
                        canc.parking,
                        canc.costcenter,
                        canc.parkingtype,
                        canc.year,
                        canc["1"],
                        canc["2"],
                        canc["3"],
                        canc["4"],
                        canc["5"],
                        canc["6"],
                        canc["7"],
                        canc["8"],
                        canc["9"],
                        canc["10"],
                        canc["11"],
                        canc["12"],
                        canc.total
                    ])
                ]}
            />
        </Loading>
    );
};
