import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { IInputError } from "types";
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
    getTransactions,
    getInspectionItems,
    getParkingInspectionItems,
    getPaymentStatuses,
    getParkingTypes,
    getWarningTickets,
    saveTicket,
    getActions,
    saveAction
} from "services";
import { useDashboardState } from "context";
import { ITicket } from "types";

import axios from "axios";
import Routes from "routes";

import { useHistory } from "react-router-dom";

import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const imgUrl = "http://192.168.1.90:8080/kuca/ticket/getImage?id=";

export const Warnings = (): JSX.Element => {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState([]);
    const [ticketsArray, setTicketsArray] = useState([]);
    const [sortedData, setSortedData] = useState({
        key: "",
        asc: false
    });
    const [tmpData, setTmpData] = useState({
        edit: false
    });
    const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
    const buttonLinkStyle =
        "text-right underline hover:text-orange-treePoppy lowercase font-thin";

    const [ticketsAll, setticketsAll] = useState([]);
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
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
    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const [modalAddAction, setModalAddActionData] = useState({
        visible: false,
        comment: "",
        name: "",
        type: "",
        id: null,
        ticketId: null,
        warningSent: true,
        inkassoSent: false,
        multiple: false
    });
    const [modalActions, setModalActionsData] = useState({
        visible: false,
        actions: [],
        ticketId: ""
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
        withoutAction: true,
        ticketNumber: null
    });
    const [addModalData, setAddModalData] = useState({
        id: "",
        visible: false,
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
        comment: ""
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
                label: e.employee.name,
                date: new Date(e.stamp).toLocaleString("de-DE"),
                costCenter: e.parking.costCenter,
                siteName: e.parking.name,
                plates: e.plates,
                carBrand: e.carBrand.name,
                carColor: e.carColor.name,
                countryMark: e.countryMark,
                paymentStatus: e.paymentStatus.name,
                price: e.price,
                inspectionItem: e.parkingInspectionItem.inspectionItem.name,
                comment: e.comment,
                employeeServiceNumber: e.employeeServiceNumber
            };
            ticketsAll.push(t);
        });
        setticketsAll([...ticketsAll]);
    };

    const { carColors, carBrands } = useDashboardState();

    const fetchParkingInspectionItems = (parkingId): void => {
        getParkingInspectionItems(parkingId).then(res => {
            const { parkingInspectionItems } = res.data;
            // console.log(parkingInspectionItems, "Items");

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
            addModalData.paymentStatus = {
                label: t.paymentStatus.name,
                value: t.paymentStatus.id
            };
            addModalData.price = t.price;
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

    const [redirectTo, setRedirectTo] = useState("");
    const history = useHistory();

    const showTransactions = (): void => {
        getTransactions().then(res => {
            if (res.data.result === "ok") {
                setModalTransactionsData({
                    transactions: res.data.transactions,
                    visible: true
                });
            }
        });
    };

    const addAction = (): void => {
        setModalAddActionData({
            visible: true,
            name: "",
            comment: "",
            type: "",
            id: "",
            ticketId: "",
            warningSent: true,
            inkassoSent: false,
            multiple: false
        });
    };

    const addMultipleAction = (): void => {
        setModalAddActionData({
            visible: true,
            name: "",
            comment: "",
            type: "",
            id: "",
            ticketId: "",
            warningSent: false,
            inkassoSent: true,
            multiple: true
        });
    };

    const showActions = (ticket): void => {
        // console.log(ticket, "Ticket");
        modalActions.ticketId = ticket.id;
        getActions(ticket.id).then(res => {
            if (res.data.result === "ok") {
                setModalActionsData({
                    actions: res.data.actions,
                    visible: true,
                    ticketId: modalActions.ticketId
                });
            }
        });
    };

    const hideActions = (): void => {
        const tmp = [];
        setModalActionsData({
            actions: tmp,
            visible: false,
            ticketId: ""
        });
    };

    const hideAddAction = (): void => {
        const tmp = [];
        setModalAddActionData({
            visible: false,
            name: "",
            comment: "",
            type: "",
            id: "",
            ticketId: "",
            warningSent: false,
            inkassoSent: true,
            multiple: false
        });
    };

    const [markedTickets, setMarkedTickets] = useState([]);

    const handleCheckbox = (a, tickets, ticketsArray): void => {
        console.log(a);
        console.log(tickets);
        for (let i = 0; i < tickets.length; i++) {
            if (a.id === tickets[i][0].key) {
                if (a.checked) {
                    console.log("Odcekiram");
                    a.checked = false;
                    // ticketsArray[i].checked = false;
                    const index = markedTickets.indexOf(a);
                    if (index !== -1) {
                        markedTickets.splice(index, 1);
                    }
                    console.log(markedTickets);
                    tickets[i][0] = (
                        <div key={a.id}>
                            <Checkbox
                                label=""
                                onChange={handleCheckbox.bind(this, a, tickets)}
                                defaultChecked={false}
                            />
                        </div>
                    );
                } else {
                    console.log("Cekiram");
                    a.checked = true;
                    // ticketsArray[i].checked = true;
                    markedTickets.push(a);
                    console.log(markedTickets);
                    tickets[i][0] = (
                        <div key={a.id}>
                            <Checkbox
                                label=""
                                onChange={handleCheckbox.bind(this, a, tickets)}
                                defaultChecked={true}
                            />
                        </div>
                    );
                }
            }
        }
        setTickets([...tickets]);
    };

    const markAll = (tickets): void => {
        // console.log(tickets);
        for (let i = 0; i < tickets.length; i++) {
            const key = tickets[i][0].key;
            // console.log(key);
            markedTickets.push(ticketsArray[i]);
            console.log(markedTickets, "Marked tickets");
            tickets[i][0] = (
                <div key={key}>
                    <Checkbox
                        label=""
                        onChange={handleCheckbox.bind(
                            this,
                            ticketsArray[i],
                            tickets
                        )}
                        defaultChecked={true}
                    />
                </div>
            );
        }
        // console.log(tickets, "Novi");
        setTickets([...tickets]);
    };

    const unMarkAll = (tickets): void => {
        // console.log(tickets);
        for (let i = 0; i < tickets.length; i++) {
            const key = tickets[i][0].key;
            // console.log(key);
            const index = markedTickets.indexOf(ticketsArray[i]);
            if (index !== -1) {
                markedTickets.splice(index, 1);
            }
            console.log(markedTickets, "marked tickets");
            tickets[i][0] = (
                <div key={key}>
                    <Checkbox
                        label=""
                        onChange={handleCheckbox.bind(
                            this,
                            ticketsArray[i],
                            tickets
                        )}
                        defaultChecked={false}
                    />
                </div>
            );
        }
        // console.log(tickets, "Novi");
        setTickets([...tickets]);
    };

    const showTickets = (): void => {
        setTableDataLoading(true);
        // console.log(filtersData);
        getWarningTickets({
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
            withoutAction: filtersData.withoutAction,
            ticketNumber: filtersData.ticketNumber
        }).then(res => {
            const { tickets } = res.data;
            const newTickets = [];
            setTicketsArray([...tickets]);
            download(tickets);
            tickets.map((t: ITicket) => {
                newTickets.push([
                    <div key={t.id}>
                        <Checkbox
                            label=""
                            onChange={handleCheckbox.bind(this, t, newTickets)}
                            defaultChecked={t.checked}
                        />
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.ticketNumber}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.employee.serviceNumber}
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
                        {t.parking.name}
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
                        {t.regionName}
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
                        {t.parking.parkingType.name}
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
                        {t.countryMark}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.paymentStatus.name}
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
                        {t.warningFee}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.inkassoFee}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.total}
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
                        {t.comment}
                    </div>,
                    <div
                        key={1}
                        onClick={handleAddModalToggle.bind(this, true, t)}
                    >
                        {t.warningSent}
                    </div>
                ]);
            });
            setTickets([...newTickets]);
            setTableDataLoading(false);
        });
    };

    const handleAddActionSubmit = (e): void => {
        e.preventDefault();

        if (true) {
            console.log(modalAddAction, " Add action");
            modalAddAction.type = "warning";
            let tickets = [];
            if (modalAddAction.multiple) {
                tickets = markedTickets;
            }
            console.log(tickets, "tickets");
            saveAction({
                id: modalAddAction?.id,
                comment: modalAddAction?.comment,
                type: modalAddAction.type,
                ticketId: addModalData.id,
                warningSent: modalAddAction.warningSent,
                inkassoSent: false,
                tickets: tickets
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("general.saved"));

                    showTickets();
                    hideAddAction();

                    hideActions();
                }
            });
        }
    };

    const [modalShowComment, setModalShowComment] = useState({
        visible: false,
        comment: "",
        name: "",
        type: "",
        id: null,
        ticketId: null,
        warningSent: false,
        inkassoSent: false,
        multiple: false
    });
    const showActionComment = (action): void => {
        console.log(action, "Action");

        setModalShowComment({
            visible: true,
            name: "",
            comment: action.comment,
            type: "",
            id: "",
            ticketId: "",
            warningSent: false,
            inkassoSent: true,
            multiple: false
        });
    };
    const hideActionComment = (): void => {
        const tmp = [];
        setModalShowComment({
            visible: false,
            name: "",
            comment: "",
            type: "",
            id: "",
            ticketId: "",
            warningSent: false,
            inkassoSent: true,
            multiple: false
        });
    };

    const hideTransactions = (): void => {
        const tmp = [];
        setModalTransactionsData({
            transactions: tmp,
            visible: false
        });
    };

    const handleAddActionDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;
        console.log(value, "ovo je value");
        setModalAddActionData({
            ...modalAddAction,
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

    const withoutActionChange = (withoutAction): void => {
        filtersData.withoutAction = withoutAction;
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

        getPaymentStatuses().then(res => {
            const { paymentStatuses } = res.data;

            setPaymentStatuses([
                ...paymentStatuses.map(b => ({
                    label: b.name,
                    value: b.id
                }))
            ]);
        });

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
                <div key={t.id}>
                    <Checkbox
                        label=""
                        onChange={handleCheckbox.bind(this, t, newTickets)}
                        defaultChecked={t.checked}
                    />
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.ticketNumber}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.employee.serviceNumber}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {new Date(t.stamp).toLocaleString("de-DE")}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.costCenter}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.client.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.regionName}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.plates}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parking.parkingType.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.carBrand.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.carColor.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.countryMark}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.paymentStatus.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.price}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.warningFee}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.inkassoFee}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.total}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.parkingInspectionItem.inspectionItem.name}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.comment}
                </div>,
                <div key={1} onClick={handleAddModalToggle.bind(this, true, t)}>
                    {t.inkassoSent}
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

    return (
        <section className="inspection">
            <header>
                <h2 className="heading heading--main">
                    {t("general.warning")} - {t("general.warningExp")}
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
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={filtersData.priceMin}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "priceMin"
                                )}
                                label={t("inspection.priceMin")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                value={filtersData.priceMax}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "priceMax"
                                )}
                                label={t("inspection.priceMax")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap">
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
                                style="width:400px"
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
                                style="width:400px"
                                options={carColorOptions}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={filtersData.inspectionItem}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "inspectionItem"
                                )}
                                style="width:400px"
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
                        <Modal
                            visible={modalShowComment.visible}
                            onClose={hideActionComment.bind(this)}
                        >
                            <br />
                            <br />
                            <textarea
                                rows={400}
                                name="textarea"
                                value={modalShowComment.comment}
                                disabled={true}
                            />
                        </Modal>
                        <Modal
                            visible={modalActions.visible}
                            onClose={hideActions.bind(this)}
                        >
                            <div className="whitelist__add-modal-content">
                                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                    {t("general.actionsComments")}
                                </h3>
                            </div>
                            <Button
                                className="mr-4"
                                type="button"
                                onClick={addAction}
                            >
                                {t("general.addAction")}
                            </Button>
                            <div>
                                <Table
                                    headings={[
                                        t("general.comment"),
                                        t("incasso.label"),
                                        t("general.warningSent"),
                                        t("general.stamp")
                                    ]}
                                    rows={[
                                        ...modalActions.actions.map(action => [
                                            action.comment,
                                            action.inkassoName,
                                            action.warningSent ? "Yes" : "No",
                                            new Date(
                                                action.stamp
                                            ).toLocaleString("de-DE"),
                                            <div key={2} className="text-right">
                                                <button
                                                    key={1}
                                                    className={buttonLinkStyle}
                                                    onClick={showActionComment.bind(
                                                        this,
                                                        action
                                                    )}
                                                >
                                                    {t("general.show")}
                                                </button>
                                            </div>
                                        ])
                                    ]}
                                />
                            </div>
                        </Modal>
                        <Modal
                            visible={modalAddAction.visible}
                            onClose={hideAddAction.bind(this)}
                        >
                            <div className="whitelist__add-modal-content">
                                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                                    {t("general.addAction")}
                                </h3>
                            </div>
                            <div>
                                <form onSubmit={handleAddActionSubmit}>
                                    <div className={fieldCssClass}>
                                        <textarea
                                            className="areaWidth"
                                            name="textarea"
                                            value={modalAddAction.comment}
                                            onChange={handleAddActionDataChange.bind(
                                                this,
                                                "comment"
                                            )}
                                        />
                                        {/* <InputField
                                            value={modalAddAction.comment}
                                            onChange={handleAddActionDataChange.bind(
                                                this,
                                                "comment"
                                            )}
                                            className={inputClass}
                                            label={t("general.comment")}
                                            error={fieldError("comment")}
                                        /> */}
                                    </div>
                                    {/* <div className={fieldCssClass}>
                                        <InputField
                                            value={modalAddAction.type}
                                            onChange={handleAddActionDataChange.bind(
                                                this,
                                                "type"
                                            )}
                                            className={inputClass}
                                            label={t("general.type")}
                                            error={fieldError("type")}
                                        />
                                    </div> */}
                                    <Checkbox
                                        label={`${t("general.warningSent")}`}
                                        defaultChecked={
                                            modalAddAction.warningSent
                                        }
                                        onChange={handleAddActionDataChange.bind(
                                            this,
                                            "warningSent",
                                            !modalAddAction.warningSent
                                        )}
                                    />
                                    <div className="text-center">
                                        <Button
                                            type="submit"
                                            color="success"
                                            className="mr-4"
                                        >
                                            {t("general.save")}
                                        </Button>
                                        <Button
                                            onClick={hideAddAction.bind(this)}
                                            color="danger"
                                            type="button"
                                        >
                                            {t("general.cancel")}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                        {/* <br />
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
                        <br /> <br />
                        <Button className="mr-4" onClick={showTickets}>
                            {t("general.show")}
                        </Button>
                        <ExcelFile
                            element={
                                <Button className="mr-4">Export Excel</Button>
                            }
                        >
                            <ExcelSheet data={ticketsAll} name="Log">
                                <ExcelColumn
                                    label="Ticket ID"
                                    value="ticketNumber"
                                />
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
                                    label="Location name"
                                    value="siteName"
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
                                <ExcelColumn
                                    label="Country mark"
                                    value="countryMark"
                                />
                                <ExcelColumn
                                    label="Payment status"
                                    value="paymentStatus"
                                />
                                <ExcelColumn label="Price" value="price" />
                                <ExcelColumn
                                    label="Inspection item"
                                    value="inspectionItem"
                                />
                                <ExcelColumn
                                    label="Comment"
                                    value="costCentercomment"
                                />
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
                    </div>
                </div>
                <div className="inspection__table">
                    <Button
                        className="mr-4"
                        onClick={markAll.bind(this, tickets)}
                    >
                        {t("general.markAll")}
                    </Button>
                    <Button
                        className="mr-4"
                        onClick={unMarkAll.bind(this, tickets)}
                    >
                        {t("general.unMarkAll")}
                    </Button>
                    <Button
                        className="mr-4"
                        type="button"
                        onClick={addMultipleAction}
                    >
                        {t("general.addAction")}
                    </Button>
                    <Checkbox
                        label={`${t("general.showOnlyWithoutAction")}`}
                        defaultChecked={filtersData.withoutAction}
                        onChange={withoutActionChange.bind(
                            this,
                            !filtersData.withoutAction
                        )}
                    />
                    <Loading isLoading={tableDataLoading}>
                        <Table
                            headings={[
                                "",
                                t("inspection.id"),
                                t("employee.label"),
                                t("general.date"),
                                t("general.costCenter"),
                                t("inspection.siteName"),
                                t("client.name"),
                                t("general.region"),
                                t("inspection.plates"),
                                t("settings.parkingType"),
                                `${t("car.label")} ${t("general.brand")}`,
                                `${t("car.label")} ${t("general.color")}`,
                                t("inspection.countryMark"),
                                t("general.paymentStatus"),
                                t("general.price"),
                                t("general.warningFee"),
                                t("general.inkassoFee"),
                                t("general.total"),
                                t("inspection.inspectionItem"),
                                t("inspection.comment"),
                                t("general.warningSent")
                            ]}
                            keys={[
                                "id",
                                "employeeName",
                                "stamp",
                                "parkingName",
                                "siteName",
                                "clientName",
                                "regionName",
                                "plates",
                                "parkingTypeName",
                                "carBrandName",
                                "carColorName",
                                "countryMark",
                                "paymentStatusName",
                                "price",
                                "warningFee",
                                "inkassoFee",
                                "total",
                                "parkingInspectionItemName"
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
                                                                    <Select
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
                                                                    />
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
                                                        {/* <div className="flex flex-row">
                                                            {" "}
                                                            <p className="comment">
                                                                Comment:
                                                            </p>
                                                            <p>
                                                                {
                                                                    addModalData.comment
                                                                }
                                                            </p>
                                                        </div> */}
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
                                                        &nbsp;&nbsp;&nbsp;
                                                        <Button
                                                            className="mr-4 mt-4 mb-4"
                                                            onClick={showActions.bind(
                                                                this,
                                                                addModalData
                                                            )}
                                                            type="button"
                                                        >
                                                            {t(
                                                                "general.showActions"
                                                            )}
                                                        </Button>
                                                        &nbsp;&nbsp;
                                                        <Button
                                                            className="mr-4"
                                                            type="button"
                                                            onClick={addAction}
                                                        >
                                                            {t(
                                                                "general.addAction"
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
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
                                                                        onClick={handleAddModalImageToggle.bind(
                                                                            this,
                                                                            true,
                                                                            e
                                                                        )}
                                                                    >
                                                                        <img
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
                                                        onClick={handleAddModalImageToggle.bind(
                                                            this,
                                                            true,
                                                            e
                                                        )}
                                                    >
                                                        <img
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
                    </Loading>
                </div>
            </div>
        </section>
    );
};
