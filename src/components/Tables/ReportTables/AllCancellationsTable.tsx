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
    getFranchises
} from "services";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import {
    useDashboardState,
    useDashboardDispatch,
    SET_REGIONS,
    SET_ALL_CANCELLATIONS
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IAllCancellationsTableProps {
    enableAddNew?: boolean;
}

export const AllCancellationsTable = ({}: IAllCancellationsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { allCancellations } = useDashboardState();
    const [tmpCancellations, setTmpCancellations] = useState([]);
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
        parking: null
    });

    const [parkings, setParkings] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [franchises, setFranchises] = useState([]);

    const [users, setUsers] = useState([]);

    const loadCancellations = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getAllCancellations({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            startTicketStamp: filtersData.startTicketDate,
            endTicketStamp: filtersData.endTicketDate,
            userId: filtersData.user?.value,
            parkingId: filtersData.parking?.value,
            paymentStatusId: filtersData.paymentStatus?.value
        }).then(res => {
            setTableDataLoading(false);
            console.log(res.data.cancellations, "Cancellations");
            dashboardDispatch({
                type: SET_ALL_CANCELLATIONS,
                payload: [...res.data.cancellations]
            });
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
            setFranchises([
                ...franchise.map(b => ({
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

    useEffect(() => {
        //if (!cancellations.length) {
        fetchFranchises();
        //}
    }, [setFranchises]);

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
            sortedArray = sort_asc_by_key(allCancellations, i);
        } else {
            sortedArray = sort_desc_by_key(allCancellations, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            {/* <div className="flex">Number of inspections: {tickets.length}</div> */}
            <br />
            <div className="flex">
                <h3>{t("general.cancelStamp")}:&nbsp;&nbsp;</h3>
                <div className="mr-4">
                    Start:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "startDate")}
                        selected={filtersData.startDate}
                    />
                </div>
                <div>
                    End:&nbsp;
                    <Datepicker
                        onChange={handleFiltersChange.bind(this, "endDate")}
                        selected={filtersData.endDate}
                    />
                </div>
                <Button className="mr-4" onClick={clearStamp}>
                    {t("general.clear")}
                </Button>
            </div>
            <br /> <br />
            <div className="flex">
                <h2>{t("general.ticketStamp")}:&nbsp;&nbsp;</h2>
                <div className="mr-4">
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
                </Button>
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
            <ExcelFile
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
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("client.franchise"),
                    t("client.label"),
                    t("general.location"),
                    t("general.paymentStatus"),
                    t("inspection.inspectionItem"),
                    t("general.cancelStamp"),
                    t("general.ticketStamp"),
                    t("general.price"),
                    t("general.user"),
                    t("general.clientCancel")
                ]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...allCancellations.map(canc => [
                        canc.franchise,
                        canc.client,
                        canc.parking,
                        canc.paymentstatus,
                        canc.inspectionitem,
                        new Date(canc.stamp).toLocaleString("de-DE"),
                        new Date(canc.ticketstamp).toLocaleString("de-DE"),
                        canc.price,
                        canc.username,
                        canc.clientcancel
                    ])
                ]}
            />
        </Loading>
    );
};
