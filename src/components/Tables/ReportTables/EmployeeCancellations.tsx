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
    getEmployeeCancellations,
    getAllParkigns,
    getCancelStatuses,
    getFranchises,
    getClients
} from "services";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import {
    useDashboardState,
    useDashboardDispatch,
    SET_REGIONS,
    SET_CANCELLATIONS
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IEmployeeCancellationsTableProps {
    enableAddNew?: boolean;
}

export const EmployeeCancellations = ({}: IEmployeeCancellationsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { cancellations } = useDashboardState();
    const [tmpCancellations, setTmpCancellations] = useState([]);
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        regionName: "",
        regionID: undefined,
        totalTickets: 0,
        canceledTickets: 0,
        cancellationRate: 0
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
        parking: null,
        franchise: null,
        client: null,
        costCenter: null
    });

    const [parkings, setParkings] = useState([]);
    const [clients, setClients] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);

    const loadCancellations = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getEmployeeCancellations({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            parkingId: filtersData.parking?.value,
            franchiseId: filtersData.franchise?.value,
            clientId: filtersData.client?.value,
            costCenter: filtersData.costCenter
        }).then(res => {
            setTableDataLoading(false);
            setTmpCancellations(res.data.cancellations);
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

    useEffect(() => {
        //if (!cancellations.length) {
        loadCancellations();
        //}
    }, [setTmpCancellations]);

    useEffect(() => {
        //if (!cancellations.length) {
        fetchParkings();
        //}
    }, [setParkings]);

    useEffect(() => {
        fetchFranchises();
    }, [setFranchises]);

    useEffect(() => {
        fetchClients();
    }, [setClients]);

    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
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
            sortedArray = sort_asc_by_key(cancellations, i);
        } else {
            sortedArray = sort_desc_by_key(cancellations, i);
        }
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

    return (
        <Loading isLoading={tableDataLoading}>
            {/* <div className="flex">Number of inspections: {tickets.length}</div> */}
            <br />
            <div className="flex">
                <h2>{t("general.cancelStamp")}:&nbsp;&nbsp;</h2>
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
                &nbsp;
                <Button className="mr-4" onClick={clearStamp}>
                    {t("general.clear")}
                </Button>
            </div>
            <br />
            <div className="flex flex-wrap">
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
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.parking}
                        onChange={handleFiltersChange.bind(this, "parking")}
                        label={`${t("general.location")}`}
                        options={parkings}
                        isClearable={true}
                    />
                </div>
            </div>
            <Button className="mr-4" onClick={loadCancellations}>
                {t("general.show")}
            </Button>
            <ExcelFile
                filename="EmployeeCancellations"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet
                    data={tmpCancellations}
                    name="EmployeeCancellations"
                >
                    <ExcelColumn
                        label={t("client.franchise")}
                        value="franchise"
                    />
                    <ExcelColumn label={t("client.label")} value="client" />
                    <ExcelColumn
                        label={t("general.location")}
                        value="location"
                    />
                    <ExcelColumn label={t("employee.label")} value="employee" />
                    <ExcelColumn
                        label={t("employee.serviceNumber")}
                        value="serviceNumber"
                    />
                    <ExcelColumn label={t("general.reason")} value="reason" />
                </ExcelSheet>
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("client.franchise"),
                    t("client.label"),
                    t("general.location"),
                    t("employee.label"),
                    t("employee.serviceNumber"),
                    t("general.reason"),
                    t("general.date")
                ]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...tmpCancellations.map(canc => [
                        canc.franchise,
                        canc.client,
                        canc.location,
                        canc.employee,
                        canc.servicenumber,
                        canc.reason,
                        canc.stamp
                    ])
                ]}
            />
        </Loading>
    );
};
