import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Routes from "routes";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Select, Loading } from "components";
import { getClientTickets, cancelTicket, getPaidCancellations } from "services";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_USERS,
    SET_ROLES
} from "context";
import { toast } from "react-toastify";
import { IInputError, ITicket } from "types";

export const ClientDashboard = (): JSX.Element => {
    const { t } = useTranslation();
    const { users } = useDashboardState();

    const [tmpUsers, setTmpUsers] = useState();
    const [tmpRoles, setTmpRoles] = useState([]);
    const [tmpClients, setTmpClients] = useState([]);
    const [tickets, setTickets] = useState([]);

    const [cancellatonInfo, setCancellationInfo] = useState({
        totalFreeCanc: null,
        usedCanc: null,
        free: null
    });

    const [searchData, setSearchData] = useState({
        plates: null,
        ticketNumber: null,
        parkingId: null
    });
    const [cancelData, setCancelData] = useState({
        paymentStatus: null,
        comment: null
    });
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const dashboardDispatch = useDashboardDispatch();

    const [tableDataLoading, setTableDataLoading] = useState(false);
    const imgUrl = "http://192.168.1.90:8080/kuca/ticket/getImage?id=";

    const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
    const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
    const buttonLinkStyle =
        "text-right underline hover:text-orange-treePoppy lowercase font-thin";
    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;
    const [ticketsArray, setTicketsArray] = useState([]);

    const [ticketData, setTicketData] = useState({
        id: "",
        visible: false,
        deletePrompt: false,
        deleteImageId: null,
        visibleFirstScan: false,
        visibleImage: false,
        ticketNumber: "",
        date: new Date(),
        costCenter: "",
        siteName: "",
        parkingId: "",
        parkingType: "",
        clientName: "",
        carBrand: "",
        carColor: "",
        latitude: "", //loakcija, ne treba sad
        longitude: "", //loakcija, ne treba sad
        licencePlate: "",
        markCountry: "",
        paymentStatus: { label: "", value: "" },
        parkingInspectionItem: null,
        price: 0,
        imgSrc: [],
        checkedPlates: null,
        src: "",
        comment: "",
        withVat: true,
        exceded: null
    });

    const showTicketData = (value, t): void => {
        if (t) {
            ticketData.id = t.id;
            ticketData.ticketNumber = t.ticketNumber;
            ticketData.date = new Date(t.stamp);
            ticketData.costCenter = t.parking.costCenter;
            ticketData.siteName = t.parking.name;
            ticketData.parkingId = t.parking.id;
            ticketData.parkingType = t.parking.parkingType.name;
            ticketData.carBrand = t.carBrand.name;
            ticketData.carColor = t.carColor.name;
            ticketData.clientName = t.parking.client.name;
            ticketData.latitude = t.parking.latitude;
            ticketData.longitude = t.parking.longitude;
            ticketData.licencePlate = t.plates;
            ticketData.markCountry = t.countryMark;
            ticketData.exceded = t.exceded;
            ticketData.paymentStatus = {
                label: t.paymentStatus.name,
                value: t.paymentStatus.id
            };
            ticketData.price = t.price;
            ticketData.imgSrc = t.images;
            ticketData.parkingInspectionItem = {
                label:
                    t.parkingInspectionItem.inspectionItem.name +
                    ", " +
                    t.parkingInspectionItem.price +
                    "EUR",
                value: t.parkingInspectionItem.id
            };
            if (t.checkedPlates) {
                ticketData.checkedPlates = t.checkedPlates;
            } else {
                ticketData.checkedPlates = null;
            }
            ticketData.comment = t.comment;
        }
        const ed = false;
        const data = { edit: ed };
        // setTmpData(data);
        setTicketData({
            ...ticketData,
            visible: value ? value : !ticketData.visible
        });
    };

    const handleCancelChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setCancelData({
            ...cancelData,
            [prop]: value
        });
    };

    const showImage = (value, e): void => {
        if (e) {
            ticketData.src = e;
        } else {
            ticketData.src = "";
        }
        setTicketData({
            ...ticketData,
            visibleImage: value ? value : !ticketData.visibleImage
        });
    };

    const [scanData, setScanData] = useState({
        ticketNumber: "",
        visibleFirstScan: false,
        date: new Date(),
        costCenter: "",
        siteName: "",
        latitude: "", //loakcija, ne treba sad
        longitude: "", //loakcija, ne treba sad
        licencePlate: "",
        markCountry: "",
        paymentStatus: { name: "" },
        price: "",
        imgSrc: [],
        checkedPlates: null
    });

    const showFirstScan = (value, t): void => {
        if (t) {
            scanData.date = new Date(t.stamp);
            scanData.costCenter = t.parking.costCenter;
            scanData.siteName = t.parking.name;
            scanData.licencePlate = t.plates;
            scanData.markCountry = t.countryMark;
            scanData.imgSrc = t.images;
        } else {
            scanData.date = new Date();
            scanData.costCenter = "";
            scanData.siteName = "";
            // addModalScanData.latitude = t.parking.latitude;
            // addModalScanData.longitude = t.parking.longitude;
            scanData.licencePlate = "";
            scanData.markCountry = "";
            scanData.imgSrc = [];
        }
        setScanData({
            ...scanData,
            visibleFirstScan: value ? value : !scanData.visibleFirstScan
        });
    };

    const showTickets = (): void => {
        setTableDataLoading(true);
        console.log(searchData, "search data");
        getClientTickets({
            plates: searchData.plates,
            ticketNumber: searchData.ticketNumber,
            parkingId: searchData.parkingId
        }).then(res => {
            if (res.data.result === "ok") {
                const { tickets } = res.data;
                const newTickets = [];
                setTicketsArray([...tickets]);
                //download(tickets);
                console.log(res.data, "TICKETS");
                tickets.map((t: ITicket) => {
                    newTickets.push([
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.employeeServiceNumber}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {new Date(t.stamp).toLocaleString("de-DE")}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.parking.costCenter}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.regionName}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.parking.client.franchise?.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.parking.client.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.parking.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.countryMark}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.plates}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.carBrand.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.carColor.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.price}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.paymentStatus.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.parkingInspectionItem.inspectionItem.name}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.ticketNumber}
                        </div>,
                        <div
                            key={1}
                            onClick={showTicketData.bind(this, true, t)}
                        >
                            {t.ticketType === 0
                                ? "Ticket"
                                : t.ticketType === 1
                                ? "Yellow Card"
                                : "Red Card"}
                        </div>
                    ]);
                });
                setTickets([...newTickets]);
            }
            setTableDataLoading(false);
        });
    };

    const [modalsVisibility, setModalsVisibility] = useState({
        deleteTicketModal: false,
        cancelTicketModal: false
    });

    const hideCancelTicket = (): void => {
        const modal = "cancelTicketModal";
        const value = false;
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const loadPaidCanc = (): void => {
        getPaidCancellations({ parkingId: ticketData.parkingId }).then(res => {
            const { data } = res;
            cancellatonInfo.free = data.free;
            cancellatonInfo.totalFreeCanc = data.totalFreeCanc;
            cancellatonInfo.usedCanc = data.usedCanc;
            setCancellationInfo(cancellatonInfo);
            console.log(cancellatonInfo, " canc");
            const modal = "cancelTicketModal";
            const value = true;
            cancelData.comment = null;
            setModalsVisibility({
                ...modalsVisibility,
                [modal]: value ? value : !modalsVisibility[modal]
            });
        });
    };

    const showCancelTicket = (): void => {
        loadPaidCanc();
    };

    // useEffect(() => {
    //     showTickets();
    // }, []);

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
            sortedArray = sort_asc_by_key(users, i);
        } else {
            sortedArray = sort_desc_by_key(users, i);
        }
    };

    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setSearchData({
            ...searchData,
            [prop]: value
        });
    };
    const setTicketCanceled = (): void => {
        cancelTicket(
            ticketData.id,
            cancelData.paymentStatus?.value,
            cancelData.comment
        ).then(res => {
            if (res.data.result === "ok") {
                hideCancelTicket();
                setTicketData({
                    ...ticketData,
                    visible: false
                });
                showTickets();
            } else {
                toast.error(res.data.reason);
            }
        });
    };
    return (
        <section>
            <header>
                <h2 className="heading heading--main">
                    {t("inspection.label")}
                </h2>
            </header>
            <div className="inspection__content card">
                <div className="inspection__filters mb-12">
                    <div className="flex flex-wrap">
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={searchData.ticketNumber}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "ticketNumber"
                                )}
                                label={t("general.ticketNumber")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={searchData.plates}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "plates"
                                )}
                                label={t("inspection.plates")}
                            />
                        </div>
                    </div>
                    <div>
                        <Button className="mr-4" onClick={showTickets}>
                            {t("general.show")}
                        </Button>
                    </div>
                </div>
                <div className="inspection__table">
                    <Loading isLoading={tableDataLoading}>
                        <Table
                            headings={[
                                t("employee.label"),
                                t("general.date"),
                                t("general.costCenter"),
                                t("general.region"),
                                t("client.franchise"),
                                t("client.name"),
                                t("inspection.siteName"),
                                t("inspection.countryMark"),
                                t("inspection.plates"),
                                `${t("car.label")} ${t("general.brand")}`,
                                `${t("car.label")} ${t("general.color")}`,
                                t("general.price"),
                                t("general.paymentStatus"),
                                t("inspection.inspectionItem"),
                                t("inspection.id")
                            ]}
                            keys={[
                                "employeeName",
                                "stamp",
                                "costCenter",
                                "regionName",
                                "franchiseName",
                                "clientName",
                                "parkintName",
                                "countryMark",
                                "plates",
                                "carBrandName",
                                "carColorName",
                                "price",
                                "paymentStatusName",
                                "parkingInspectionItemName",
                                "id"
                            ]}
                            rows={tickets}
                            clicked={onSort}
                        />
                    </Loading>
                </div>
            </div>
            <Modal
                visible={ticketData.visible}
                onClose={showTicketData.bind(this, false, null)}
                className="mymodal"
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("inspection.details")}
                    </h3>
                    <div>
                        {ticketData.checkedPlates ? (
                            <Button
                                className="mr-4 mt-4 mb-4"
                                onClick={showFirstScan.bind(
                                    this,
                                    true,
                                    ticketData.checkedPlates
                                )}
                                type="button"
                            >
                                {t("general.showFirstScan")}
                            </Button>
                        ) : (
                            ""
                        )}
                        <Button
                            onClick={showCancelTicket}
                            color="secondary"
                            className="textButton mt-4 edit"
                            type="button"
                        >
                            {t("general.cancelTicket")}
                        </Button>
                    </div>
                    <div>
                        {ticketData.imgSrc.map(e => {
                            const url = imgUrl + e;
                            return (
                                <div key={e} className="imgDiv">
                                    <img
                                        onClick={showImage.bind(this, true, e)}
                                        key={e}
                                        src={url}
                                        alt="car"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>
            <Modal
                visible={ticketData.visibleImage}
                onClose={showImage.bind(this, false, null)}
                className="imgModal"
            >
                <div className="whitelist__add-modal-content">
                    <div className="mt-10">
                        <img src={imgUrl + ticketData.src} alt="car" />
                    </div>
                </div>
            </Modal>
            <Modal
                visible={scanData.visibleFirstScan}
                onClose={showFirstScan.bind(this, false, null)}
                className="mymodal"
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("general.firstScan")}
                    </h3>
                    <form>
                        <div>
                            <p>
                                Date:
                                <span>
                                    {" " +
                                        scanData.date.toLocaleString("de-DE")}
                                </span>
                            </p>
                            <p>
                                Cost center:
                                <span>{` ${scanData.costCenter}`}</span>
                            </p>
                            <p>
                                Site name:
                                <span>{" " + scanData.siteName}</span>
                            </p>
                            {/* <p>
                                            Location: {addModalScanData.longitude}
                                        </p> */}
                            <p>
                                Licence plate:
                                <span>{" " + scanData.licencePlate}</span>
                            </p>
                            <p>
                                Mark country:
                                <span>{" " + scanData.markCountry}</span>
                            </p>
                            <div>
                                {scanData.imgSrc.map(e => {
                                    const url = imgUrl + e;
                                    return (
                                        <div key={e} className="imgDiv">
                                            <img
                                                onClick={showImage.bind(
                                                    this,
                                                    true,
                                                    e
                                                )}
                                                key={e}
                                                src={url}
                                                alt="car"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center">
                                <Button
                                    onClick={showFirstScan.bind(
                                        this,
                                        false,
                                        null
                                    )}
                                    type="button"
                                    color="danger"
                                >
                                    {t("general.cancel")}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                visible={modalsVisibility.cancelTicketModal}
                onClose={hideCancelTicket}
            >
                <br />
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("general.cancelTicketPrompt")}: {ticketData.ticketNumber}
                </h3>
                <p>
                    {t("general.paidCancellations")}:{" "}
                    {cancellatonInfo.totalFreeCanc}
                </p>
                <p>
                    {t("general.usedCanc")}: {cancellatonInfo.usedCanc}
                </p>
                <p>
                    {t("general.freeCanc")}: {cancellatonInfo.free}
                </p>
                {/* <Select
                    value={cancelData.paymentStatus}
                    onChange={handleCancelChange.bind(this, "paymentStatus")}
                    label={t("general.paymentStatus")}
                    options={cancelStatuses}
                    isClearable={false}
                /> */}
                <br /> <br />
                <textarea
                    placeholder="Enter a comment..."
                    className="styled"
                    name="textarea"
                    value={cancelData.comment}
                    onChange={handleCancelChange.bind(this, "comment")}
                ></textarea>
                <form>
                    <div className="text-center">
                        <Button
                            type="button"
                            color="success"
                            className="mr-4"
                            onClick={setTicketCanceled.bind(this)}
                        >
                            {t("general.yes")}
                        </Button>
                        <Button
                            onClick={hideCancelTicket}
                            color="danger"
                            type="button"
                        >
                            {t("general.no")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
};
