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
    getTotalTime
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
    SET_TOTAL_TIME
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface ITotalTimeTableProps {
    enableAddNew?: boolean;
}

export const TotalTime = ({}: ITotalTimeTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { totalTime } = useDashboardState();
    const [tmpCancellations, setTmpCancellations] = useState([]);
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        regionName: "",
        regionID: undefined
    });
    const [filtersData, setFiltersData] = useState({
        month1: null,
        month2: null,
        month3: null,
        user: null,
        paymentStatus: null,
        parking: null
    });

    const [parkings, setParkings] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [users, setUsers] = useState([]);

    const loadCancellations = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getTotalTime({
            month1: filtersData.month1,
            month2: filtersData.month2,
            month3: filtersData.month3
        }).then(res => {
            setTableDataLoading(false);
            console.log(res.data.data, "Cancellations");
            dashboardDispatch({
                type: SET_TOTAL_TIME,
                payload: [...res.data.data]
            });
            setTmpCancellations(res.data.data);
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
        loadCancellations();
        //}
    }, [setTmpCancellations]);

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

    // const clearTicketStamp = (): void => {
    //     filtersData.startTicketDate = null;
    //     filtersData.endTicketDate = null;
    //     setFiltersData({
    //         ...filtersData,
    //         ["startTicketDate"]: null
    //     });
    //     setFiltersData({
    //         ...filtersData,
    //         ["endTicketDate"]: null
    //     });
    // };

    const clearMonth1 = (): void => {
        filtersData.month1 = null;
        setFiltersData({
            ...filtersData,
            ["month1"]: null
        });
    };

    const clearMonth2 = (): void => {
        filtersData.month2 = null;
        setFiltersData({
            ...filtersData,
            ["month2"]: null
        });
    };

    const clearMonth3 = (): void => {
        filtersData.month3 = null;
        setFiltersData({
            ...filtersData,
            ["month3"]: null
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
            sortedArray = sort_asc_by_key(totalTime, i);
        } else {
            sortedArray = sort_desc_by_key(totalTime, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            {/* <div className="flex">Number of inspections: {tickets.length}</div> */}
            <br />
            <div className="flex">
                <div className="mr-4">
                    Month 1:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "month1")}
                        selected={filtersData.month1}
                    />
                </div>
                <Button className="mr-4" onClick={clearMonth1}>
                    {t("general.clear")}
                </Button>
            </div>
            <div className="flex">
                <div className="mr-4">
                    Month 2:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "month2")}
                        selected={filtersData.month2}
                    />
                </div>
                <Button className="mr-4" onClick={clearMonth2}>
                    {t("general.clear")}
                </Button>
            </div>
            <div className="flex">
                <div className="mr-4">
                    Month 3:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "month3")}
                        selected={filtersData.month3}
                    />
                </div>
                <Button className="mr-4" onClick={clearMonth3}>
                    {t("general.clear")}
                </Button>
            </div>
            <br /> <br />
            <div className="flex">
                <h2>{t("general.ticketStamp")}:&nbsp;&nbsp;</h2>
                {/* <div className="mr-4">
                    Start:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(
                            this,
                            "startTicketDate"
                        )}
                        selected={filtersData.startTicketDate}
                    />
                </div>
                <div>
                    End:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(
                            this,
                            "endTicketDate"
                        )}
                        selected={filtersData.endTicketDate}
                    />
                </div>
                <Button className="mr-4" onClick={clearTicketStamp}>
                    {t("general.clear")}
                </Button> */}
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
                    <Select
                        value={filtersData.paymentStatus}
                        onChange={handleFiltersChange.bind(
                            this,
                            "paymentStatus"
                        )}
                        label={`${t("general.paymentStatus")}`}
                        options={paymentStatuses}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <Select
                        value={filtersData.user}
                        onChange={handleFiltersChange.bind(this, "user")}
                        label={`${t("general.user")}`}
                        options={users}
                        isClearable={true}
                    />
                </div>
            </div>
            <Button className="mr-4" onClick={loadCancellations}>
                {t("general.show")}
            </Button>
            {/* <ExcelFile
                filename="Cancellations"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={allCancellations} name="Log">
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
                        label={t("general.paymentStatus")}
                        value="paymentstatus"
                    />
                    <ExcelColumn
                        label={t("inspection.inspectionItem")}
                        value="inspectionitem"
                    />
                    <ExcelColumn
                        label={t("general.cancelStamp")}
                        value="stampstring"
                    />
                    <ExcelColumn
                        label={t("general.ticketStamp")}
                        value="ticketstampstring"
                    />
                    <ExcelColumn label={t("general.price")} value="price" />
                    <ExcelColumn label={t("general.user")} value="username" />
                    <ExcelColumn
                        label={t("general.clientCancel")}
                        value="clientcancel"
                    />
                </ExcelSheet>
            </ExcelFile> */}
            <Table
                className="header__pointer"
                headings={[
                    `${t("client.franchise")}1`,
                    `${t("client.label")}1`,
                    `${t("general.location")}1`,
                    `${t("general.ticketForPay")}1`,
                    `${t("inspection.canceledAgTickets")}1`,
                    `${t("general.cenceledOther")}1`,
                    `${t("general.employeesFee")}1`,
                    `${t("general.totalTime")}1`,
                    `${t("general.totalTicketsFee")}1`,
                    `${t("general.totalIncome")}1`,
                    `${t("general.result")}1`,

                    `${t("general.ticketForPay")}2`,
                    `${t("inspection.canceledAgTickets")}2`,
                    `${t("general.cenceledOther")}2`,
                    `${t("general.totalIncome")}2`,
                    `${t("general.employeesFee")}2`,
                    `${t("general.totalTime")}2`,

                    `${t("general.ticketForPay")}3`,
                    `${t("inspection.canceledAgTickets")}3`,
                    `${t("general.cenceledOther")}3`,
                    `${t("general.totalIncome")}3`,
                    `${t("general.employeesFee")}3`,
                    `${t("general.totalTime")}3`
                ]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...totalTime.map(canc => [
                        canc.franchise,
                        canc.client,
                        canc.parking,
                        canc.ticketsForPay1,
                        canc.canceledAgTickets1,
                        canc.canceledFree1,
                        canc.eurosForEmployee1?.toFixed(2),
                        canc.totalTimeHours1?.toFixed(2),
                        canc.totalTicketsFee1?.toFixed(2),
                        canc.totalIncome1?.toFixed(2),
                        (canc.totalIncome1 - canc.eurosForEmployee1).toFixed(2),

                        canc.ticketsForPay2,
                        canc.canceledAgTickets2,
                        canc.canceledFree2,
                        canc.totalIncome2?.toFixed(2),
                        canc.eurosForEmployee2?.toFixed(2),
                        canc.totalTimeHours2?.toFixed(2),

                        canc.ticketsForPay2,
                        canc.canceledAgTickets2,
                        canc.canceledFree2,
                        canc.totalIncome2?.toFixed(2),
                        canc.eurosForEmployee2?.toFixed(2),
                        canc.totalTimeHours2?.toFixed(2)
                    ])
                ]}
            />
        </Loading>
    );
};
