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
    getCancellations,
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

interface ICancellationsTableProps {
    enableAddNew?: boolean;
}

export const CancellationsTable = ({}: ICancellationsTableProps): JSX.Element => {
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
        startTicketDate: null,
        endTicketDate: null,
        user: null,
        paymentStatus: null,
        parking: null,
        franchise: null,
        client: null
    });

    const [parkings, setParkings] = useState([]);
    const [clients, setClients] = useState([]);
    const [franchises, setFranchises] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);

    const loadCancellations = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getCancellations({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            startTicketStamp: filtersData.startTicketDate,
            endTicketStamp: filtersData.endTicketDate,
            userId: filtersData.user?.id,
            parkingId: filtersData.parking?.value,
            paymentStatusId: filtersData.paymentStatus?.value,
            franchiseId: filtersData.franchise?.value,
            clientId: filtersData.client?.value
        }).then(res => {
            setTableDataLoading(false);
            console.log(res.data.cancellations, "Cancellations");
            addModalData.totalTickets = res.data.totalTickets;
            addModalData.canceledTickets = res.data.canceledTickets;
            addModalData.cancellationRate = res.data.cancellationRate.toFixed(
                2
            );
            dashboardDispatch({
                type: SET_CANCELLATIONS,
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
            <div className="flex">
                <h2>{t("general.ticketStamp")}:&nbsp;&nbsp;</h2>
                <div className="mr-4">
                    <Datepicker
                        onChange={handleFiltersChange.bind(
                            this,
                            "startTicketDate"
                        )}
                        selected={filtersData.startTicketDate}
                    />
                </div>
                <div>
                    <Datepicker
                        onChange={handleFiltersChange.bind(
                            this,
                            "endTicketDate"
                        )}
                        selected={filtersData.endTicketDate}
                    />
                </div>
                &nbsp;
                <Button className="mr-4" onClick={clearTicketStamp}>
                    {t("general.clear")}
                </Button>
                &nbsp;&nbsp;{t("general.issuedTickets")}:
                {addModalData.totalTickets}, &nbsp;&nbsp;
                {t("general.canceledTickets")}:{addModalData.canceledTickets},
                &nbsp;&nbsp;{t("general.cancellationRate")}:
                {addModalData.cancellationRate}%
            </div>
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
            </div>
            <Button className="mr-4" onClick={loadCancellations}>
                {t("general.show")}
            </Button>
            <ExcelFile
                filename="Cancellations"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={cancellations} name="Log">
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
                        label={t("general.freeCancellations")}
                        value="paidcancellations"
                    />
                    <ExcelColumn label={t("general.count")} value="count" />
                    <ExcelColumn
                        label={t("general.payForAg")}
                        value="cancellationfee"
                    />

                    {/* <ExcelColumn
                                    label="Comment"
                                    value="costCentercomment"
                                /> */}
                </ExcelSheet>
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("client.franchise"),
                    t("client.label"),
                    t("general.location"),
                    t("general.paymentStatus"),
                    t("general.freeCancellations"),
                    t("general.count"),
                    t("general.payForAg")
                ]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...cancellations.map(canc => [
                        canc.franchise,
                        canc.client,
                        canc.parking,
                        canc.paymentstatus,
                        canc.paidcancellations,
                        canc.count,
                        canc.cancellationfee
                    ])
                ]}
            />
        </Loading>
    );
};
