import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import {
    Datepicker,
    Select,
    InputField,
    Button,
    Table,
    Loading,
    Modal,
    Checkbox
} from "components";
import { sub, add } from "date-fns";
import {
    getEmployees,
    getInspectionItems,
    getParkingInspectionItems,
    getPaymentStatuses,
    getParkingTypes,
    getRedCards,
    saveTicket,
    getTransactions,
    deleteYellowCard,
    cancelTicket,
    deleteImage
} from "services";
import { useDashboardState } from "context";
import { ITicket } from "types";

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const imgUrl = "http://192.168.1.90:8080/kuca/ticket/getImage?id=";

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

import axios from "axios";

export const RedCard = (): JSX.Element => {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([]);
    const [ticketsArray, setTicketsArray] = useState([]);
    const [sortedData, setSortedData] = useState({
        key: "",
        asc: false
    });

    const [modalsVisibility, setModalsVisibility] = useState({
        deleteTicketModal: false,
        cancelTicketModal: false
    });

    const [userData, setUserData] = useState({
        inkasso: false
    });

    const [tmpData, setTmpData] = useState({
        edit: false
    });
    const [ticketsAll, setticketsAll] = useState([]);
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [carBrandOptions, setCarBrandOptions] = useState([]);
    const [carColorOptions, setCarColorOptions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [inspectionItems, setInspectionItems] = useState([]);
    const [parkingInspectionItems, setParkingInspectionItems] = useState([]);
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [parkingTypes, setParkingTypes] = useState([]);
    const [modalTransactions, setModalTransactionsData] = useState({
        visible: false,
        transactions: []
    });
    const [filtersData, setFiltersData] = useState({
        dateFrom: sub(new Date(), { months: 1 }),
        dateTo: add(new Date(), {
            years: 0,
            months: 0,
            weeks: 0,
            days: 1,
            hours: 0,
            minutes: 0,
            seconds: 0
        }),
        plates: "",
        countryMark: "",
        priceMin: "",
        priceMax: "",
        employee: null,
        costCenter: null,
        carBrand: null,
        carColor: null,
        paymentStatus: null,
        inspectionItem: null,
        parkingType: null,
        ticketNumber: null
    });
    const [addModalData, setAddModalData] = useState({
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
        withVat: true
    });

    const [addModalScanData, setAddModalScanData] = useState({
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

    const download = (tickets): void => {
        tickets.forEach(e => {
            const t = {
                ticketNumber: e.ticketNumber,
                label: e.employee.name + " " + e.employee.lastName,
                date: new Date(e.stamp).toLocaleString("de-DE"),
                costCenter: e.parking.costCenter,
                siteName: e.parking.name,
                regionName: e.regionName,
                franchiseName: e.parking.client.franchise?.name,
                clientName: e.parking.client.name,
                plates: e.plates,
                carBrand: e.carBrand.name,
                carColor: e.carColor.name,
                countryMark: e.countryMark,
                price: e.price,
                inspectionItem: e.parkingInspectionItem.inspectionItem.name,
                comment: e.comment,
                employeeServiceNumber: e.employeeServiceNumber
            };
            ticketsAll.push(t);
        });
        setticketsAll([...ticketsAll]);
    };

    const showDeleteTicket = (): void => {
        const modal = "deleteTicketModal";
        const value = true;
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const hideDeleteTicket = (): void => {
        const modal = "deleteTicketModal";
        const value = false;
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const showCancelTicket = (): void => {
        const modal = "cancelTicketModal";
        const value = true;
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const hideCancelTicket = (): void => {
        const modal = "cancelTicketModal";
        const value = false;
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const { carColors, carBrands } = useDashboardState();

    const fetchParkingInspectionItems = (parkingId): void => {
        getParkingInspectionItems(parkingId).then(res => {
            const { parkingInspectionItems } = res.data;
            console.log(parkingInspectionItems, "Items");

            setParkingInspectionItems([
                ...parkingInspectionItems.map(b => ({
                    label: b.inspectionItem.name + ", " + b.price + "EUR",
                    value: b.id
                }))
            ]);
        });
    };

    const handleAddModalToggle = (value, t): void => {
        if (t) {
            addModalData.id = t.id;
            addModalData.ticketNumber = t.ticketNumber;
            addModalData.date = new Date(t.stamp);
            addModalData.costCenter = t.parking.costCenter;
            addModalData.siteName = t.parking.name;
            addModalData.parkingType = t.parking.parkingType.name;
            addModalData.carBrand = t.carBrand.name;
            addModalData.carColor = t.carColor.name;
            addModalData.clientName = t.parking.client.name;
            // addModalData.latitude = t.parking.latitude;
            // addModalData.longitude = t.parking.longitude;
            addModalData.licencePlate = t.plates;
            addModalData.markCountry = t.countryMark;
            addModalData.imgSrc = t.images;

            addModalData.parkingInspectionItem = {
                label:
                    t.parkingInspectionItem.inspectionItem.name +
                    ", " +
                    t.parkingInspectionItem.price +
                    "EUR",
                value: t.parkingInspectionItem.id
            };
            if (t.checkedPlates) {
                addModalData.checkedPlates = t.checkedPlates;
            } else {
                addModalData.checkedPlates = null;
            }
            addModalData.comment = t.comment;

            fetchParkingInspectionItems(t.parking.id);
        }
        const ed = false;
        const data = { edit: ed };
        setTmpData(data);
        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleAddModalImageToggle = (value, e): void => {
        if (e) {
            addModalData.src = e;
        } else {
            addModalData.src = "";
        }
        setAddModalData({
            ...addModalData,
            visibleImage: value ? value : !addModalData.visibleImage
        });
    };
    const handleDeleteImagePrompt = (value, e): void => {
        //alert(e);
        addModalData.deleteImageId = e;
        setAddModalData({
            ...addModalData,
            deletePrompt: value ? value : !addModalData.deletePrompt
        });
    };

    const handleDeleteImage = (): void => {
        deleteImage(addModalData.deleteImageId).then(result => {
            if (result.data.result === "ok") {
                if (result.data.result === "ok") {
                    const value = false;

                    const index = addModalData.imgSrc.indexOf(
                        addModalData.deleteImageId
                    );
                    if (index > -1) {
                        addModalData.imgSrc.splice(index, 1);
                    }

                    const ind = addModalScanData.imgSrc.indexOf(
                        addModalData.deleteImageId
                    );
                    if (ind > -1) {
                        addModalScanData.imgSrc.splice(ind, 1);
                    }

                    addModalData.deleteImageId = null;
                    setAddModalData({
                        ...addModalData,
                        deletePrompt: value ? value : !addModalData.deletePrompt
                    });
                }
            } else {
                toast.error(result.data.reason);
            }
        });

        // const query =
        //     `http://192.168.1.90:8080/kuca/ticket/deleteImage?id=` +
        //     addModalData.deleteImageId;
        // axios
        //     .get(query)
        //     .then(result => {
        //         //const strJson = JSON.stringify(result.data);
        //         /**
        //          * It is important to bind this to handleClick in the constructor
        //          *
        //          * this.handleClick = this.handleClick.bind(this);
        //          *
        //          * Otherwise this.setState won't work.
        //          */
        //         if (result.data.result === "ok") {
        //             const value = false;

        //             const index = addModalData.imgSrc.indexOf(
        //                 addModalData.deleteImageId
        //             );
        //             if (index > -1) {
        //                 addModalData.imgSrc.splice(index, 1);
        //             }

        //             const ind = addModalScanData.imgSrc.indexOf(
        //                 addModalData.deleteImageId
        //             );
        //             if (ind > -1) {
        //                 addModalScanData.imgSrc.splice(ind, 1);
        //             }

        //             addModalData.deleteImageId = null;
        //             setAddModalData({
        //                 ...addModalData,
        //                 deletePrompt: value ? value : !addModalData.deletePrompt
        //             });
        //         }
        //         //console.log(`RESULT:\n${strJson}`);
        //     })
        //     .catch(error => console.error(error));
    };

    const handleAddModalScanToggle = (value, t): void => {
        if (t) {
            addModalScanData.date = new Date(t.stamp);
            addModalScanData.costCenter = t.parking.costCenter;
            addModalScanData.siteName = t.parking.name;
            // addModalScanData.latitude = t.parking.latitude;
            // addModalScanData.longitude = t.parking.longitude;
            addModalScanData.licencePlate = t.plates;
            addModalScanData.markCountry = t.countryMark;
            addModalScanData.imgSrc = t.images;
        } else {
            addModalScanData.date = new Date();
            addModalScanData.costCenter = "";
            addModalScanData.siteName = "";
            // addModalScanData.latitude = t.parking.latitude;
            // addModalScanData.longitude = t.parking.longitude;
            addModalScanData.licencePlate = "";
            addModalScanData.markCountry = "";
            addModalScanData.imgSrc = [];
        }
        setAddModalScanData({
            ...addModalScanData,
            visibleFirstScan: value ? value : !addModalScanData.visibleFirstScan
        });
    };

    const showTickets = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getRedCards({
            startStamp: filtersData.dateFrom,
            endStamp: filtersData.dateTo,
            plates: filtersData.plates,
            countryMark: filtersData.countryMark,
            priceMin: filtersData.priceMin,
            priceMax: filtersData.priceMax,
            employeeId: filtersData.employee?.value,
            parkingId: filtersData.costCenter?.value,
            carBrandId: filtersData.carBrand?.value,
            carColorId: filtersData.carColor?.value,
            paymentStatusId: filtersData.paymentStatus?.value,
            inspectionItemId: filtersData.inspectionItem?.value,
            parkingTypeId: filtersData.inspectionItem?.value,
            costCenter: filtersData.costCenter,
            ticketNumber: filtersData.ticketNumber
        }).then(res => {
            const { tickets } = res.data;
            const newTickets = [];
            setTicketsArray([...tickets]);
            download(tickets);
            console.log(res.data, "TICKETS");
            tickets.map((t: ITicket) => {
                newTickets.push([
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.employeeServiceNumber}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {new Date(t.stamp).toLocaleString("de-DE")}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.parking.costCenter}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.regionName}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.parking.client.franchise?.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.parking.client.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.parking.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.countryMark}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.plates}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.carBrand.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.carColor.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.price}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.parkingInspectionItem.inspectionItem.name}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.ticketNumber}
                    </div>
                ]);
            });
            setTickets([...newTickets]);
            setTableDataLoading(false);
        });
    };

    const handleVatChange = (value, t): void => {
        // setAddModalData({
        //     ...addModalData,
        //     withVat: value
        // });
        addModalData.withVat = !addModalData.withVat;

        showTickets();
    };
    //nema editovanja podataka
    const handleEditModalDataChange = (prop, e): void => {
        console.log(e.currentTarget, "ovo je e.value");
        let value;
        if (e != undefined) {
            value = e.currentTarget ? e.currentTarget.value : e;
        } else {
            value = "";
        }
        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    useEffect(() => {
        getEmployees().then(res => {
            const { employees } = res.data;

            if (localStorage.getItem("inkassoName") != "/") {
                setEmployees([
                    ...employees.map(b => ({
                        label: b.serviceNumber,
                        value: b.id
                    }))
                ]);
            } else {
                setEmployees([
                    ...employees.map(b => ({
                        label: b.name + " " + b.lastName,
                        value: b.id
                    }))
                ]);
            }
        });

        getParkingTypes().then(res => {
            const { parkingTypes } = res.data;

            setParkingTypes([
                ...parkingTypes.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });

        // getPaymentStatuses().then(res => {
        //     const { paymentStatuses } = res.data;

        //     setPaymentStatuses([
        //         ...paymentStatuses.map(b => ({
        //             label: b.name,
        //             value: b.id
        //         }))
        //     ]);
        // });

        getInspectionItems().then(res => {
            const { inspectionItems } = res.data;

            setInspectionItems([
                ...inspectionItems.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });

        showTickets();
    }, []);

    useEffect(() => {
        setCarColorOptions([
            ...carColors.map(c => ({
                label: c.name,
                value: c.id
            }))
        ]);
    }, [carColors]);

    useEffect(() => {
        setCarBrandOptions([
            ...carBrands.map(c => ({
                label: c.name,
                value: c.id
            }))
        ]);
    }, [carBrands]);

    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const showTransactions = (): void => {
        getTransactions().then(res => {
            if (res.data.result === "ok") {
                setModalTransactionsData({
                    transactions: res.data.transactions,
                    visible: true
                });
            }
        });
        // const query = `http://192.168.1.90:8080/kuca/ticket/getTransactions`;
        // axios
        //     .get(query)
        //     .then(result => {
        //         //const strJson = JSON.stringify(result.data);
        //         /**
        //          * It is important to bind this to handleClick in the constructor
        //          *
        //          * this.handleClick = this.handleClick.bind(this);
        //          *
        //          * Otherwise this.setState won't work.
        //          */
        //         if (result.data.result === "ok") {
        //             setModalTransactionsData({
        //                 transactions: result.data.transactions,
        //                 visible: true
        //             });
        //         }
        //         //console.log(`RESULT:\n${strJson}`);
        //     })
        //     .catch(error => console.error(error));
    };

    const hideTransactions = (): void => {
        const tmp = [];
        setModalTransactionsData({
            transactions: tmp,
            visible: false
        });
    };

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
            sortedArray = sort_asc_by_key(ticketsArray, i);
        } else {
            sortedArray = sort_desc_by_key(ticketsArray, i);
        }

        const newTickets = [];
        sortedArray.map((t: ITicket) => {
            newTickets.push([
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.employeeServiceNumber}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {new Date(t.stamp).toLocaleString("de-DE")}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.costCenter}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.regionName}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.client.franchise?.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.client.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.countryMark}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.plates}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.carBrand.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.carColor.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.price}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parkingInspectionItem.inspectionItem.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.ticketNumber}
                </div>
            ]);
        });
        setTickets([...newTickets]);
    };

    const updateTicket = (): void => {
        saveTicket({
            id: addModalData.id,
            plates: addModalData.licencePlate,
            paymentStatusId: addModalData.paymentStatus.value,
            parkingInspectionItemId: addModalData.parkingInspectionItem.value,
            countryMark: addModalData.markCountry,
            comment: addModalData.comment,
            price: addModalData.price
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("settings.updateInspectionItems"));
                const ed = false;
                const data = { edit: ed };
                setTmpData(data);

                showTickets();
            }
        });
    };

    const saveComment = (): void => {
        updateTicket();
    };

    const changeOnClick = (): void => {
        if (tmpData.edit) {
            //posalji na server
            updateTicket();
        } else {
            const ed = !tmpData.edit;
            const data = { edit: ed };
            setTmpData(data);
        }
    };

    const removeTicket = (): void => {
        deleteYellowCard(addModalData.id).then(res => {
            if (res.data.result === "ok") {
                hideDeleteTicket();
                setAddModalData({
                    ...addModalData,
                    visible: false
                });
                showTickets();
            } else {
                toast.error(res.data.reason);
            }
        });
    };
    const setTicketCanceled = (): void => {
        cancelTicket(addModalData.id, null, "").then(res => {
            if (res.data.result === "ok") {
                hideCancelTicket();
                setAddModalData({
                    ...addModalData,
                    visible: false
                });
                showTickets();
            } else {
                toast.error(res.data.reason);
            }
        });
    };
    let editButton;
    let deleteButton;
    let cancelButton;
    if (localStorage.getItem("inkassoName") != "/") {
        editButton = null;
        deleteButton = null;
    } else {
        // editButton = (
        //     <Button
        //         onClick={changeOnClick}
        //         color="secondary"
        //         className="textButton mt-4 edit"
        //         type="button"
        //     >
        //         {!tmpData.edit ? t("general.edit") : t("general.save")}
        //     </Button>
        // );
        deleteButton = (
            <Button
                onClick={showDeleteTicket}
                color="secondary"
                className="textButton mt-4 edit"
                type="button"
            >
                {t("general.deleteTicket")}
            </Button>
        );
        // cancelButton = (
        //     <Button
        //         onClick={showCancelTicket}
        //         color="secondary"
        //         className="textButton mt-4 edit"
        //         type="button"
        //     >
        //         {t("general.cancelTicket")}
        //     </Button>
        // );
    }
    return (
        <section className="inspection">
            <header>
                <h2 className="heading heading--main">
                    {t("inspection.label")}
                </h2>
            </header>
            <div className="inspection__content card">
                <div className="inspection__filters mb-12">
                    <div className="flex">
                        Number of inspections: {tickets.length}
                    </div>
                    <br />
                    <div className="flex">
                        <div className="mr-4">
                            <Datepicker
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "dateFrom"
                                )}
                                selected={filtersData.dateFrom}
                            />
                        </div>
                        <div>
                            <Datepicker
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "dateTo"
                                )}
                                selected={filtersData.dateTo}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={filtersData.plates}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "plates"
                                )}
                                label={t("inspection.plates")}
                            />
                        </div>

                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={filtersData.countryMark}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "countryMark"
                                )}
                                label={t("inspection.countryMark")}
                            />
                        </div>
                    </div>
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
                        <div className={fieldCssClass}>
                            <Select
                                value={filtersData.employee}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "employee"
                                )}
                                label={t("employee.label")}
                                options={employees}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={filtersData.ticketNumber}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "ticketNumber"
                                )}
                                label={t("general.ticketNumber")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={filtersData.carBrand}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "carBrand"
                                )}
                                label={`${t("car.label")} ${t(
                                    "general.brand"
                                )}`}
                                options={carBrandOptions}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={filtersData.carColor}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "carColor"
                                )}
                                label={`${t("car.label")} ${t(
                                    "general.color"
                                )}`}
                                options={carColorOptions}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}></div>
                        <div className={fieldCssClass}>
                            <Select
                                value={filtersData.inspectionItem}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "inspectionItem"
                                )}
                                label={t("inspection.inspectionItem")}
                                options={inspectionItems}
                                isClearable={true}
                            />
                        </div>
                    </div>
                    <div>
                        <Modal
                            visible={modalTransactions.visible}
                            onClose={hideTransactions.bind(this)}
                        >
                            <div className="whitelist__add-modal-content">
                                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                    Transactions
                                </h3>
                            </div>
                            <div>
                                <Table
                                    headings={[
                                        "Transaction ID",
                                        "Amount",
                                        "Details",
                                        "Ticket number",
                                        "Ticket fee"
                                    ]}
                                    rows={[
                                        ...modalTransactions.transactions.map(
                                            transaction => [
                                                transaction.reference,
                                                transaction.amount,
                                                transaction.details,
                                                transaction.ticketNumber,
                                                transaction.ticketPrice
                                                // <div
                                                //     key={1}
                                                //     className="text-right"
                                                // >
                                                //     <button
                                                //         className={
                                                //             buttonLinkStyle
                                                //         }
                                                //         onClick={handleAddModalToggle.bind(
                                                //             this,
                                                //             true,
                                                //             client
                                                //         )}
                                                //     >
                                                //         {t("general.edit")}
                                                //     </button>
                                                // </div>,
                                                // <NavLink
                                                //     key={4}
                                                //     className="underline hover:text-seance text-right"
                                                //     to={`${Routes.dashboard.administration.client.path}/${client.id}/locations`}
                                                // >
                                                //     {t("client.viewLocations")}
                                                // </NavLink>,
                                                // <div
                                                //     key={2}
                                                //     className="text-right"
                                                // >
                                                //     <button
                                                //         key={1}
                                                //         className={
                                                //             buttonLinkStyle
                                                //         }
                                                //         onClick={deleteClientItem.bind(
                                                //             this,
                                                //             client
                                                //         )}
                                                //     >
                                                //         {t("general.delete")}
                                                //     </button>
                                                // </div>
                                            ]
                                        )
                                    ]}
                                />
                            </div>
                        </Modal>
                        <Button className="mr-4" onClick={showTickets}>
                            {t("general.show")}
                        </Button>
                        <ExcelFile
                            filename="YellowCards"
                            element={
                                <Button className="mr-4">Export Excel</Button>
                            }
                        >
                            <ExcelSheet data={ticketsAll} name="Log">
                                <ExcelColumn
                                    label="Employee"
                                    value="employeeServiceNumber"
                                />

                                <ExcelColumn label="Date" value="date" />
                                <ExcelColumn
                                    label="Cost center"
                                    value="costCenter"
                                />
                                <ExcelColumn
                                    label="Region"
                                    value="regionName"
                                />

                                <ExcelColumn
                                    label="Franchise"
                                    value="franchiseName"
                                />

                                <ExcelColumn
                                    label="Client"
                                    value="clientName"
                                />

                                <ExcelColumn
                                    label="Location name"
                                    value="siteName"
                                />
                                <ExcelColumn
                                    label="Country mark"
                                    value="countryMark"
                                />
                                <ExcelColumn label="Plates" value="plates" />
                                <ExcelColumn
                                    label="Car brand"
                                    value="carBrand"
                                />
                                <ExcelColumn
                                    label="Car color"
                                    value="carColor"
                                />
                                <ExcelColumn label="Price" value="price" />
                                <ExcelColumn
                                    label="Inspection item"
                                    value="inspectionItem"
                                />

                                <ExcelColumn
                                    label="Ticket ID"
                                    value="ticketNumber"
                                />

                                {/* <ExcelColumn
                                    label="Comment"
                                    value="costCentercomment"
                                /> */}
                            </ExcelSheet>
                            {/* <ExcelSheet
                                                data={dataSet2}
                                                name="Leaves"
                                            >
                                                <ExcelColumn
                                                    label="Name"
                                                    value="name"
                                                />
                                                <ExcelColumn
                                                    label="Total Leaves"
                                                    value="total"
                                                />
                                                <ExcelColumn
                                                    label="Remaining Leaves"
                                                    value="remaining"
                                                />
                                            </ExcelSheet> */}
                        </ExcelFile>
                        {/* <br /> <br />
                        <form
                            action="http://192.168.1.90:8080/kuca/ticket/uploadxml"
                            target="_blank"
                            method="post"
                            encType="multipart/form-data"
                        >
                            Select bank XML file to upload: <br />
                            <input
                                type="file"
                                name="fileToUpload"
                                id="fileToUpload"
                            />
                            <Button className="mr-4" type="submit">
                                Upload
                            </Button>
                            <Button
                                className="mr-4"
                                type="button"
                                onClick={showTransactions}
                            >
                                Show transactions
                            </Button>
                        </form> */}
                        {/* <br /> <br />
                        <Checkbox
                            label={`${t("general.withVat")}`}
                            defaultChecked={addModalData.withVat}
                            onChange={handleVatChange.bind(
                                this,
                                "active",
                                !addModalData.withVat
                            )}
                        /> */}
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
                                "parkingInspectionItemName",
                                "id"
                            ]}
                            rows={tickets}
                            clicked={onSort}
                        />
                        <Modal
                            visible={addModalData.visible}
                            onClose={handleAddModalToggle.bind(
                                this,
                                false,
                                null
                            )}
                            className="mymodal"
                        >
                            <div className="whitelist__add-modal-content">
                                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                    {t("inspection.details")}
                                </h3>

                                <form>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div>
                                                        <div>
                                                            <p>
                                                                ID:{" "}
                                                                <span>
                                                                    {" " +
                                                                        addModalData.ticketNumber}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Date:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.date.toLocaleString(
                                                                            "de-DE"
                                                                        )}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Cost center:
                                                                <span>
                                                                    {` ${addModalData.costCenter}`}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Site name:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.siteName}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Client name:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.clientName}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Parking type:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.parkingType}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Car brand:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.carBrand}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p>
                                                                Car color:
                                                                <span>
                                                                    {" " +
                                                                        addModalData.carColor}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        {/* <p>
                                                             Location: {addModalData.longitude}
                                                        </p> */}
                                                        <div className="flex flex-row">
                                                            <p>
                                                                Licence plate:
                                                            </p>
                                                            {tmpData.edit && (
                                                                <div
                                                                    className={
                                                                        fieldCssClass
                                                                    }
                                                                >
                                                                    <InputField
                                                                        className="inspInput"
                                                                        value={
                                                                            addModalData.licencePlate
                                                                        }
                                                                        onChange={handleEditModalDataChange.bind(
                                                                            this,
                                                                            "licencePlate"
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                            {!tmpData.edit && (
                                                                <span>
                                                                    {" " +
                                                                        addModalData.licencePlate}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <p>Mark country:</p>
                                                            {tmpData.edit && (
                                                                <div
                                                                    className={
                                                                        fieldCssClass
                                                                    }
                                                                >
                                                                    <InputField
                                                                        className="inspInput"
                                                                        value={
                                                                            addModalData.markCountry
                                                                        }
                                                                        onChange={handleEditModalDataChange.bind(
                                                                            this,
                                                                            "markCountry"
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}
                                                            {!tmpData.edit && (
                                                                <span>
                                                                    {" " +
                                                                        addModalData.markCountry}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <p>
                                                                Payment status:
                                                            </p>
                                                            {tmpData.edit && (
                                                                <div
                                                                    className={
                                                                        fieldCssClass
                                                                    }
                                                                >
                                                                    {/* <Select
                                                                        value={
                                                                            addModalData.paymentStatus
                                                                        }
                                                                        onChange={handleEditModalDataChange.bind(
                                                                            this,
                                                                            "paymentStatus"
                                                                        )}
                                                                        options={
                                                                            paymentStatuses
                                                                        }
                                                                        isClearable={
                                                                            false
                                                                        }
                                                                    /> */}
                                                                </div>
                                                            )}
                                                            {!tmpData.edit && (
                                                                <span>
                                                                    {" " +
                                                                        addModalData
                                                                            .paymentStatus
                                                                            .label}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-row">
                                                            <p>Price: </p>
                                                            {tmpData.edit && (
                                                                <div
                                                                    className={
                                                                        fieldCssClass
                                                                    }
                                                                >
                                                                    <Select
                                                                        value={
                                                                            addModalData.parkingInspectionItem
                                                                        }
                                                                        onChange={handleEditModalDataChange.bind(
                                                                            this,
                                                                            "parkingInspectionItem"
                                                                        )}
                                                                        options={
                                                                            parkingInspectionItems
                                                                        }
                                                                        isClearable={
                                                                            false
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                            {!tmpData.edit && (
                                                                <span>
                                                                    {`${addModalData.price} eur`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            {addModalData.checkedPlates ? (
                                                                <Button
                                                                    className="mr-4 mt-4 mb-4"
                                                                    onClick={handleAddModalScanToggle.bind(
                                                                        this,
                                                                        true,
                                                                        addModalData.checkedPlates
                                                                    )}
                                                                    type="button"
                                                                >
                                                                    {t(
                                                                        "general.showFirstScan"
                                                                    )}
                                                                </Button>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        {editButton}
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        {cancelButton}
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        {deleteButton}
                                                        {/* <Button
                                                            onClick={
                                                                changeOnClick
                                                            }
                                                            color="secondary"
                                                            className="textButton mt-4 edit"
                                                            type="button"
                                                        >
                                                            {!tmpData.edit
                                                                ? t(
                                                                      "general.edit"
                                                                  )
                                                                : t(
                                                                      "general.save"
                                                                  )}
                                                        </Button> */}
                                                    </div>
                                                </td>
                                                {/* <td className="textArea">
                                                    {" "}
                                                    <p className="comment">
                                                        Comment:
                                                    </p>
                                                    <textarea
                                                        placeholder="Enter a comment..."
                                                        className="styled"
                                                        name="textarea"
                                                        value={
                                                            addModalData.comment
                                                        }
                                                        onChange={handleEditModalDataChange.bind(
                                                            this,
                                                            "comment"
                                                        )}
                                                    ></textarea>
                                                    <br />
                                                    <Button
                                                        onClick={saveComment}
                                                        color="success"
                                                        className="textButton"
                                                        type="button"
                                                    >
                                                        {t("general.save")}
                                                    </Button>
                                                </td> */}
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <div>
                                                        {addModalData.imgSrc.map(
                                                            e => {
                                                                const url =
                                                                    imgUrl + e;
                                                                return (
                                                                    <div
                                                                        key={e}
                                                                        className="imgDiv"
                                                                    >
                                                                        {localStorage.getItem(
                                                                            "inkassoName"
                                                                        ) ==
                                                                        "/" ? (
                                                                            <Button
                                                                                onClick={handleDeleteImagePrompt.bind(
                                                                                    this,
                                                                                    true,
                                                                                    e
                                                                                )}
                                                                                type="button"
                                                                                color="danger"
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        ) : null}
                                                                        <img
                                                                            onClick={handleAddModalImageToggle.bind(
                                                                                this,
                                                                                true,
                                                                                e
                                                                            )}
                                                                            key={
                                                                                e
                                                                            }
                                                                            src={
                                                                                url
                                                                            }
                                                                            alt="car"
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                    <div className="text-center">
                                                        <Button
                                                            onClick={handleAddModalToggle.bind(
                                                                this,
                                                                false,
                                                                null
                                                            )}
                                                            color="danger"
                                                        >
                                                            {t(
                                                                "general.cancel"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </div>
                        </Modal>
                        <Modal
                            visible={addModalScanData.visibleFirstScan}
                            onClose={handleAddModalScanToggle.bind(
                                this,
                                false,
                                null
                            )}
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
                                                    addModalScanData.date.toLocaleString(
                                                        "de-DE"
                                                    )}
                                            </span>
                                        </p>
                                        <p>
                                            Cost center:
                                            <span>
                                                {` ${addModalScanData.costCenter}`}
                                            </span>
                                        </p>
                                        <p>
                                            Site name:
                                            <span>
                                                {" " +
                                                    addModalScanData.siteName}
                                            </span>
                                        </p>
                                        {/* <p>
                                            Location: {addModalScanData.longitude}
                                        </p> */}
                                        <p>
                                            Licence plate:
                                            <span>
                                                {" " +
                                                    addModalScanData.licencePlate}
                                            </span>
                                        </p>
                                        <p>
                                            Mark country:
                                            <span>
                                                {" " +
                                                    addModalScanData.markCountry}
                                            </span>
                                        </p>
                                        <div>
                                            {addModalScanData.imgSrc.map(e => {
                                                const url = imgUrl + e;
                                                return (
                                                    <div
                                                        key={e}
                                                        className="imgDiv"
                                                    >
                                                        <Button
                                                            onClick={handleDeleteImagePrompt.bind(
                                                                this,
                                                                true,
                                                                e
                                                            )}
                                                            type="button"
                                                            color="danger"
                                                        >
                                                            Delete
                                                        </Button>
                                                        <img
                                                            onClick={handleAddModalImageToggle.bind(
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
                                                onClick={handleAddModalScanToggle.bind(
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
                            visible={addModalData.visibleImage}
                            onClose={handleAddModalImageToggle.bind(
                                this,
                                false,
                                null
                            )}
                            className="imgModal"
                        >
                            <div className="whitelist__add-modal-content">
                                <div className="mt-10">
                                    <img
                                        src={imgUrl + addModalData.src}
                                        alt="car"
                                    />
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            visible={addModalData.deletePrompt}
                            onClose={handleDeleteImagePrompt.bind(
                                this,
                                false,
                                null
                            )}
                            className="imgModal"
                        >
                            <div className="whitelist__add-modal-content">
                                <br />
                                <br />
                                <br />
                                <br />
                                Are you sure that you want to delete image?
                                <br />
                                <br />
                                <Button
                                    type="button"
                                    color="warning"
                                    onClick={handleDeleteImage.bind(this)}
                                >
                                    Yes
                                </Button>
                                &nbsp;&nbsp;
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={handleDeleteImagePrompt.bind(
                                        this,
                                        false,
                                        null
                                    )}
                                >
                                    No
                                </Button>
                            </div>
                        </Modal>
                        <Modal
                            visible={modalsVisibility.deleteTicketModal}
                            onClose={hideDeleteTicket}
                        >
                            <br />
                            <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                {t("general.deleteTicketPrompt")}:{" "}
                                {addModalData.ticketNumber}
                            </h3>
                            <form>
                                <div className="text-center">
                                    <Button
                                        type="button"
                                        color="success"
                                        className="mr-4"
                                        onClick={removeTicket.bind(this)}
                                    >
                                        {t("general.yes")}
                                    </Button>
                                    <Button
                                        onClick={hideDeleteTicket}
                                        color="danger"
                                        type="button"
                                    >
                                        {t("general.no")}
                                    </Button>
                                </div>
                            </form>
                        </Modal>
                        <Modal
                            visible={modalsVisibility.cancelTicketModal}
                            onClose={hideCancelTicket}
                        >
                            <br />
                            <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                {t("general.cancelTicketPrompt")}:{" "}
                                {addModalData.ticketNumber}
                            </h3>
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
                    </Loading>
                </div>
            </div>
        </section>
    );
};
