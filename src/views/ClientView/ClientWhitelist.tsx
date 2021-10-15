import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Table,
    Modal,
    InputField,
    Select,
    Datepicker,
    formatOptions
} from "components";
import { IWhitelist } from "types";
import { sub } from "date-fns";
import {
    getWhitelist,
    saveWhitelist,
    getClients,
    getParkings,
    deleteWhiteList
} from "services";
import { DATE_FORMAT } from "helpers";
import { useDashboardState, useDashboardDispatch, SET_CLIENTS } from "context";
import { IParking, IInputError } from "types";
import { toast } from "react-toastify";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const fieldCssClass = "flex-auto mx-2 mb-4 w-56 inspection";
const fieldCssClassSearch = "flex-auto mx-2 mb-4 w-56";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";
interface IAddWhitelistProps {
    visible: boolean;
    onClose: () => void;
}
const token = localStorage.getItem("token");
const clientId = localStorage.getItem("clientId");
const uploadExcelUrl = "http://192.168.1.90:8080/kuca/ticket/uploadExcel";

const defaultModalData = {
    id: undefined,
    name: "",
    contract: "",
    customerName: "",
    plates: "",
    dateFrom: new Date(),
    dateTo: new Date(),
    carBrand: null,
    client: { label: clientId, value: clientId },
    parking: null
};

export const ClientWhitelist = ({}: IAddWhitelistProps): JSX.Element => {
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
    const { carBrands, clients } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [parkings, setParkings] = useState<IParking[]>([]);
    const [modalData, setModalData] = useState({
        ...defaultModalData
    });
    const [filtersData, setFiltersData] = useState({
        dateFrom: sub(new Date(), { months: 1 }),
        dateTo: new Date(),
        plates: "",
        carBrand: null,
        contractNumber: "",
        customerName: "",
        client: { label: clientId, value: clientId },
        parking: null
    });

    useEffect(() => {
        getWhitelist({}).then(res => {
            const { whitelist } = res.data;
            setWhitelist([...whitelist]);
        });
    }, []);

    const loadClients = (): void => {
        getClients().then(res => {
            dashboardDispatch({
                type: SET_CLIENTS,
                payload: res.data.clients
            });
        });
    };
    useEffect(() => {
        if (!clients.length) {
            loadClients();
        }
    }, []);

    useEffect(() => {
        if (modalData.client) {
            getParkings(modalData.client.value).then(res => {
                setParkings([...res.data.parkings]);
            });
        } else {
            setParkings([]);
        }
        setModalData({
            ...modalData,
            parking: null
        });
    }, [modalData.client]);

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

    const handleUploadDataChange = (prop, e): void => {
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
            if (k === "id" || k === "name" || k === "parking") {
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

    const showWhitelist = (): void => {
        //console.log(filtersData, "Filtersdata");

        const data = {
            plates: filtersData.plates,
            customerName: filtersData.customerName,
            contractNumber: filtersData.contractNumber,
            clientId: null,
            carBrandId: null,
            parkingId: null
        };
        //console.log(data, "Data pre");
        if (filtersData.client) {
            data.clientId = filtersData.client.value;
        }

        if (filtersData.carBrand) {
            data.carBrandId = filtersData.carBrand.value;
        }

        if (filtersData.parking) {
            data.parkingId = filtersData.parking.value;
        }
        //console.log(data, "Data posle");
        getWhitelist(data).then(res => {
            const { whitelist } = res.data;
            setWhitelist([...whitelist]);
        });
    };
    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const handleAddWhitelistSubmit = (e): void => {
        e.preventDefault();
        console.log(modalData, "E");

        const {
            id,
            name,
            contract,
            customerName,
            plates,
            dateFrom,
            dateTo,
            carBrand,
            client,
            parking
        } = modalData;

        if (isFormValid()) {
            const fromDate = dateFrom.getTime();
            const toDate = dateTo.getTime();
            saveWhitelist({
                id,
                name,
                customerName,
                contract,
                plates,
                fromDate,
                toDate,
                carBrandId: carBrand.value,
                clientId: client.value,
                parkingId: parking?.value
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("whitelist.whitelistSuccessfullyAdded"));
                    getWhitelist({}).then(res => {
                        const { whitelist } = res.data;
                        setWhitelist([...whitelist]);
                    });
                    //onClose(); //ne radi
                    console.log("sad treba");
                    const modal = "addWhitelist";
                    const value = false;
                    setModalsVisibility({
                        ...modalsVisibility,
                        [modal]: value ? value : !modalsVisibility[modal]
                    });
                }
            });
        }
    };

    const deleteWhitelistItem = (whitelist): void => {
        deleteWhiteList({
            id: whitelist.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("whitelist.delete"));
                getWhitelist({}).then(res => {
                    const { whitelist } = res.data;
                    setWhitelist([...whitelist]);
                });
            }
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
                    {t("whitelist.label")}
                </h2>
            </header>
            <div className="whitelist__content card">
                <div className="inspection__filters mb-12">
                    {/* <div className="flex">
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
                    </div> */}
                    <div className="flex flex-wrap">
                        <div className={fieldCssClassSearch}>
                            <InputField
                                className="mb-6"
                                value={filtersData.customerName}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "customerName"
                                )}
                                label={t("customer.label")}
                            />
                        </div>
                        <div className={fieldCssClassSearch}>
                            <InputField
                                className="mb-6"
                                value={filtersData.plates}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "plates"
                                )}
                                label={t("car.licencePlate")}
                            />
                        </div>

                        <div className={fieldCssClassSearch}>
                            <InputField
                                className="mb-6"
                                value={filtersData.contractNumber}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "contractNumber"
                                )}
                                label={t("whitelist.contractNo")}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap">
                        <div className={fieldCssClassSearch}>
                            <Select
                                value={filtersData.carBrand}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "carBrand"
                                )}
                                label={t("car.label")}
                                options={formatOptions(carBrands)}
                                isClearable={true}
                            />
                        </div>
                        {/* <div className={fieldCssClassSearch}>
                            <Select
                                value={filtersData.client}
                                onChange={handleFiltersChange.bind(
                                    this,
                                    "client"
                                )}
                                isDisabled={true}
                                label={t("client.label")}
                                options={formatOptions(clients)}
                                isClearable={true}
                            />
                        </div> */}
                    </div>
                    <div>
                        <Button className="mr-4 mt-4" onClick={showWhitelist}>
                            {t("general.show")}
                        </Button>
                        <ExcelFile
                            filename="Whitelist"
                            element={
                                <Button className="mr-4">Export Excel</Button>
                            }
                        >
                            <ExcelSheet data={whiltelist} name="Log">
                                <ExcelColumn
                                    label="Franchise"
                                    value="franchiseName"
                                />
                                <ExcelColumn
                                    label="Client"
                                    value="clientName"
                                />
                                <ExcelColumn
                                    label="Location"
                                    value="parkingName"
                                />
                                <ExcelColumn
                                    label="Cost center"
                                    value="costCenter"
                                />
                                <ExcelColumn
                                    label="Contract"
                                    value="contract"
                                />
                                <ExcelColumn
                                    label="Car brand"
                                    value="carBrandName"
                                />
                                <ExcelColumn label="Plates" value="plates" />
                                <ExcelColumn
                                    label="Customer"
                                    value="customerName"
                                />
                                <ExcelColumn
                                    label="Date from"
                                    value="dateFromString"
                                />
                                <ExcelColumn
                                    label="Date to"
                                    value="dateToString"
                                />
                            </ExcelSheet>
                        </ExcelFile>
                        <br /> <br />
                        <form
                            action={uploadExcelUrl}
                            target="_blank"
                            method="post"
                            encType="multipart/form-data"
                        >
                            Select Excel file to upload: <br />
                            <input
                                type="file"
                                name="fileToUpload"
                                id="fileToUpload"
                            />
                            <input
                                type="hidden"
                                name="token"
                                id="token"
                                value={token}
                            />
                            <input
                                type="hidden"
                                name="parkingId"
                                id="parkingId"
                                value={modalData.parking?.value}
                            />
                            <input
                                type="hidden"
                                name="clientId"
                                id="clientId"
                                value={modalData.client?.value}
                            />
                            <div className={fieldCssClass}>
                                <Select
                                    value={modalData.client}
                                    label={t("client.label")}
                                    onChange={handleUploadDataChange.bind(
                                        this,
                                        "client"
                                    )}
                                    isDisabled={true}
                                    options={formatOptions(clients)}
                                    error={fieldError("client")}
                                />
                            </div>
                            <div className={fieldCssClass}>
                                <Select
                                    value={modalData.parking}
                                    label={t("general.parking")}
                                    isDisabled={
                                        !modalData.client || !parkings.length
                                    }
                                    onChange={handleUploadDataChange.bind(
                                        this,
                                        "parking"
                                    )}
                                    options={formatOptions(parkings)}
                                    error={fieldError("parking")}
                                />
                            </div>
                            <Button className="mr-4" type="submit">
                                Upload
                            </Button>
                            {/* <Button
                                className="mr-4"
                                type="button"
                                onClick={showTransactions}
                            >
                                Show transactions
                            </Button> */}
                        </form>
                    </div>
                </div>
                <div className="whitelist__table">
                    <Table
                        headings={[
                            t("client.franchise"),
                            t("client.label"),
                            t("general.location"),
                            t("whitelist.contractNo"),
                            t("car.label"),
                            t("car.licencePlate"),
                            t("customer.label"),
                            t("general.from"),
                            t("general.to")
                        ]}
                        keys={[
                            "franchiseName",
                            "clientName",
                            "parkingName",
                            "contract",
                            "carBrandName",
                            "plates",
                            "customerName",
                            "dateTo",
                            "dateFrom"
                        ]}
                        rows={[
                            ...whiltelist.map((listItem: IWhitelist) => [
                                listItem.client.franchise?.name,
                                listItem.client.name,
                                listItem.parking.name,
                                listItem.contract,
                                listItem.carBrand.name,
                                listItem.plates,
                                listItem.customerName,
                                new Date(listItem.dateFrom).toLocaleString(
                                    "de-DE"
                                ),
                                new Date(listItem.dateTo).toLocaleString(
                                    "de-DE"
                                ),
                                <div key={7} className="text-right">
                                    <button
                                        key={7}
                                        className={buttonLinkStyle}
                                        onClick={handleAddModalToggle.bind(
                                            this,
                                            "addWhitelist",
                                            true,
                                            listItem
                                        )}
                                    >
                                        {t("general.edit")}
                                    </button>
                                </div>,
                                <div key={7} className="text-right">
                                    <button
                                        key={1}
                                        className={buttonLinkStyle}
                                        onClick={deleteWhitelistItem.bind(
                                            this,
                                            listItem
                                        )}
                                    >
                                        {t("general.delete")}
                                    </button>
                                </div>
                            ])
                        ]}
                        clicked={onSort}
                    />
                </div>
                <Button
                    onClick={handleAddModalToggle.bind(
                        this,
                        "addWhitelist",
                        true,
                        null
                    )}
                    className="mr-4 mt-6"
                >
                    {t("general.add")}
                </Button>
                {/* <Button
                    onClick={handleAddModalToggle.bind(
                        this,
                        "uploadFile",
                        true,
                        null
                    )}
                    color="secondary"
                >
                    {t("whitelist.uploadFile")}
                </Button> */}
            </div>
            <Modal
                visible={modalsVisibility.addWhitelist}
                onClose={handleAddModalToggle.bind(this, "addWhitelist", false)}
            >
                <div className="whitelist__add-modal-content min-w-600 max-w-screen">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-6">
                        {t("whitelist.addToWhitelist")}
                    </h3>
                    <form onSubmit={handleAddWhitelistSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                label={t("whitelist.contractNo")}
                                value={modalData.contract}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "contract"
                                )}
                                error={fieldError("contract")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                label={t("car.licencePlate")}
                                value={modalData.plates}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "plates"
                                )}
                                error={fieldError("plates")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                className="mb-6"
                                label={t("customer.label")}
                                value={modalData.customerName}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "customerName"
                                )}
                                error={fieldError("customerName")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={modalData.carBrand}
                                label={`${t("car.label")} ${t(
                                    "general.brand"
                                )}`}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "carBrand"
                                )}
                                options={formatOptions(carBrands)}
                                error={fieldError("carBrand")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={modalData.client}
                                label={t("client.label")}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "client"
                                )}
                                isDisabled={true}
                                options={formatOptions(clients)}
                                error={fieldError("client")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={modalData.parking}
                                label={t("general.parking")}
                                isDisabled={
                                    !modalData.client || !parkings.length
                                }
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "parking"
                                )}
                                options={formatOptions(parkings)}
                                error={fieldError("parking")}
                            />
                        </div>
                        <div className={`${fieldCssClass} flex`}>
                            <label className="mr-4">
                                {`${t("general.valid")} ${t("general.from")}:`}
                            </label>
                            <Datepicker
                                dateFormat={DATE_FORMAT}
                                selected={modalData.dateFrom}
                                maxDate={modalData.dateTo}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "dateFrom"
                                )}
                            />
                        </div>
                        <div className={`${fieldCssClass} flex`}>
                            <label className="mr-4">
                                {`${t("general.valid")} ${t("general.to")}:`}
                            </label>
                            <Datepicker
                                dateFormat={DATE_FORMAT}
                                selected={modalData.dateTo}
                                minDate={modalData.dateFrom}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "dateTo"
                                )}
                            />
                        </div>
                        <div className="text-right">
                            <Button
                                type="submit"
                                color="success"
                                className="mr-4"
                            >
                                {t("general.save")}
                            </Button>
                            <Button
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    "addWhitelist",
                                    false
                                )}
                                color="danger"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
};
