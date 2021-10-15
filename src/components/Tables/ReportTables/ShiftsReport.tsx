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
    getShiftReport,
    getFilters,
    saveFilter
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

interface IShiftReportsTableProps {
    enableAddNew?: boolean;
}

export const ShiftsReports = ({}: IShiftReportsTableProps): JSX.Element => {
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
        // startDate: sub(new Date(), { months: 1 }),
        // endDate: add(new Date(), {
        //     years: 0,
        //     months: 0,
        //     weeks: 0,
        //     days: 1,
        //     hours: 0,
        //     minutes: 0,
        //     seconds: 0
        // }),
        startDate: null,
        endDate: null,
        employee: null,
        region: null
    });

    const [employees, setEmployees] = useState([]);
    const [regions, setRegions] = useState([]);

    const loadData = (): void => {
        setTableDataLoading(true);
        console.log(filtersData);
        getShiftReport({
            startStamp: filtersData.startDate,
            endStamp: filtersData.endDate,
            regionId: filtersData.region?.value,
            employeeId: filtersData.employee?.value
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

    const handleFiltersChange = (prop, e): void => {
        console.log(prop, e);
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };

    const [newFiltersData, setNewFiltersData] = useState({
        name: null,
        type: "shiftsReport",
        data: null
    });
    const handleNewFiltersChange = (prop, e): void => {
        console.log(prop, e);
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setNewFiltersData({
            ...newFiltersData,
            [prop]: value
        });
    };
    const [filters, setFilters] = useState([]);
    const fetchFilters = (): void => {
        console.log("POCINJEM");

        getFilters({ type: "shiftsReport" }).then(res => {
            const { filters } = res.data;
            console.log(res.data, "filters");
            setFilters([
                ...filters.map(b => ({
                    label: b.name,
                    value: b.id,
                    data: b.data
                }))
            ]);
        });
    };
    useEffect(() => {
        fetchFilters();
    }, [setFilters]);

    const saveNewFilter = (): void => {
        let data = "";
        if (filtersData.employee) {
            data += "employee," + filtersData.employee.value;
        }
        if (filtersData.region) {
            if (data.length > 0) {
                data += "|";
            }
            data += "region," + filtersData.region.value;
        }
        console.log(data);
        newFiltersData.data = data;
        saveFilter({
            name: newFiltersData.name,
            type: newFiltersData.type,
            data: newFiltersData.data
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.saved"));
                fetchFilters();
            }
        });
    };
    const [savedFiltersData, setSavedFiltersData] = useState({
        data: null
    });
    const handleSavedFiltersChange = (prop, e): void => {
        //resetuj filter
        filtersData.startDate = null;
        filtersData.endDate = null;
        filtersData.employee = null;
        filtersData.region = null;

        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setSavedFiltersData({
            ...savedFiltersData,
            [prop]: value
        });

        // console.log(value.data);
        const data = value.data.split("|");
        // console.log(data[0]);

        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
            const filter = data[i].split(",");
            if (filter[0] === "employee") {
                const name = employees.find(x => x.value === filter[1]).label;
                // handleFiltersChange(filter[0], {
                //     value: filter[1],
                //     label: name
                // });

                filtersData.employee = { label: name, value: filter[1] };
            } else if (filter[0] === "region") {
                const name = regions.find(x => x.value === filter[1]).label;
                // handleFiltersChange(filter[0], {
                //     value: filter[1],
                //     label: name
                // });
                filtersData.region = { label: name, value: filter[1] };
            }
        }
    };

    // useEffect(() => {
    //     fetchEmployees();
    // }, [setEmployees]);

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
        fetchEmployees();
    }, [setEmployees]);
    useEffect(() => {
        fetchRegions();
    }, [setRegions]);

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
            <div className="flex flex-wrap">
                <div className={fieldCssClass}>
                    <Select
                        value={savedFiltersData.data}
                        onChange={handleSavedFiltersChange.bind(this, "data")}
                        label={`${t("general.savedFilter")}`}
                        options={filters}
                        isClearable={true}
                    />
                </div>
                <div className={fieldCssClass}>
                    <InputField
                        value={newFiltersData.name}
                        onChange={handleNewFiltersChange.bind(this, "name")}
                        className={inputClass}
                        label={t("general.name")}
                    />
                    &nbsp;
                    <Button className="mr-4" onClick={saveNewFilter}>
                        {t("general.save")}
                    </Button>
                </div>
            </div>
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
            </div>
            <Button className="mr-4" onClick={loadData}>
                {t("general.show")}
            </Button>
            <ExcelFile
                filename="ShiftsReport"
                element={<Button className="mr-4">Export Excel</Button>}
            >
                <ExcelSheet data={tmpControls} name="Log">
                    <ExcelColumn label={t("general.region")} value="region" />
                    <ExcelColumn label={t("employee.label")} value="employee" />
                    <ExcelColumn
                        label={t("general.year") + " 1"}
                        value="year1"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 1"}
                        value="targetworkingdays1"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 1"}
                        value="actualworkingdays1"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 1"}
                        value="illnes1"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 1"}
                        value="holiday1"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 2"}
                        value="year2"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 2"}
                        value="targetworkingdays2"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 2"}
                        value="actualworkingdays2"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 2"}
                        value="illnes2"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 2"}
                        value="holiday2"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 3"}
                        value="year3"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 3"}
                        value="targetworkingdays3"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 3"}
                        value="actualworkingdays3"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 3"}
                        value="illnes3"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 3"}
                        value="holiday3"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 4"}
                        value="year4"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 4"}
                        value="targetworkingdays4"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 4"}
                        value="actualworkingdays4"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 4"}
                        value="illnes4"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 4"}
                        value="holiday4"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 5"}
                        value="year5"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 5"}
                        value="targetworkingdays5"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 5"}
                        value="actualworkingdays5"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 5"}
                        value="illnes5"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 5"}
                        value="holiday5"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 6"}
                        value="year6"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 6"}
                        value="targetworkingdays6"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 6"}
                        value="actualworkingdays6"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 6"}
                        value="illnes6"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 6"}
                        value="holiday6"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 7"}
                        value="year7"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 7"}
                        value="targetworkingdays7"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 7"}
                        value="actualworkingdays7"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 7"}
                        value="illnes7"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 7"}
                        value="holiday7"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 8"}
                        value="year8"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 8"}
                        value="targetworkingdays8"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 8"}
                        value="actualworkingdays8"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 8"}
                        value="illnes8"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 8"}
                        value="holiday8"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 9"}
                        value="year9"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 9"}
                        value="targetworkingdays9"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 9"}
                        value="actualworkingdays9"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 9"}
                        value="illnes9"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 9"}
                        value="holiday9"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 10"}
                        value="year10"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 10"}
                        value="targetworkingdays10"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 10"}
                        value="actualworkingdays10"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 10"}
                        value="illnes10"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 10"}
                        value="holiday10"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 11"}
                        value="year11"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 11"}
                        value="targetworkingdays11"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 11"}
                        value="actualworkingdays11"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 11"}
                        value="illnes11"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 11"}
                        value="holiday11"
                    />

                    <ExcelColumn
                        label={t("general.year") + " 12"}
                        value="year12"
                    />
                    <ExcelColumn
                        label={t("general.targetWorkingDays") + " 12"}
                        value="targetworkingdays12"
                    />
                    <ExcelColumn
                        label={t("general.actualWorkingDays") + " 12"}
                        value="actualworkingdays12"
                    />
                    <ExcelColumn
                        label={t("general.illnes") + " 12"}
                        value="illnes12"
                    />
                    <ExcelColumn
                        label={t("general.holiday") + " 12"}
                        value="holiday12"
                    />
                </ExcelSheet>
            </ExcelFile>
            <Table
                className="header__pointer"
                headings={[
                    t("general.region"),
                    t("employee.label"),
                    t("general.year") + "1",
                    t("general.targetWorkingDays") + "1",
                    t("general.actualWorkingDays") + "1",
                    t("general.illnes") + "1",
                    t("general.holiday") + "1",
                    t("general.year") + "2",
                    t("general.targetWorkingDays") + "2",
                    t("general.actualWorkingDays") + "2",
                    t("general.illnes") + "2",
                    t("general.holiday") + "2",
                    t("general.year") + "3",
                    t("general.targetWorkingDays") + "3",
                    t("general.actualWorkingDays") + "3",
                    t("general.illnes") + "3",
                    t("general.holiday") + "3",
                    t("general.year") + "4",
                    t("general.targetWorkingDays") + "4",
                    t("general.actualWorkingDays") + "4",
                    t("general.illnes") + "4",
                    t("general.holiday") + "4",
                    t("general.year") + "5",
                    t("general.targetWorkingDays") + "5",
                    t("general.actualWorkingDays") + "5",
                    t("general.illnes") + "5",
                    t("general.holiday") + "5",
                    t("general.year") + "6",
                    t("general.targetWorkingDays") + "6",
                    t("general.actualWorkingDays") + "6",
                    t("general.illnes") + "6",
                    t("general.holiday") + "6",
                    t("general.year") + "7",
                    t("general.targetWorkingDays") + "7",
                    t("general.actualWorkingDays") + "7",
                    t("general.illnes") + "7",
                    t("general.holiday") + "7",
                    t("general.year") + "8",
                    t("general.targetWorkingDays") + "8",
                    t("general.actualWorkingDays") + "8",
                    t("general.illnes") + "8",
                    t("general.holiday") + "8",
                    t("general.year") + "9",
                    t("general.targetWorkingDays") + "9",
                    t("general.actualWorkingDays") + "9",
                    t("general.illnes") + "9",
                    t("general.holiday") + "9",
                    t("general.year") + "10",
                    t("general.targetWorkingDays") + "10",
                    t("general.actualWorkingDays") + "10",
                    t("general.illnes") + "10",
                    t("general.holiday") + "10",
                    t("general.year") + "11",
                    t("general.targetWorkingDays") + "11",
                    t("general.actualWorkingDays") + "11",
                    t("general.illnes") + "11",
                    t("general.holiday") + "11",
                    t("general.year") + "12",
                    t("general.targetWorkingDays") + "12",
                    t("general.actualWorkingDays") + "12",
                    t("general.illnes") + "12",
                    t("general.holiday") + "12"
                ]}
                clicked={onSort}
                keys={[
                    "region",
                    "employee",
                    "year1",
                    "targetworkingdays1",
                    "actualworkingdays1",
                    "illness1",
                    "holiday1",

                    "year2",
                    "targetworkingdays2",
                    "actualworkingdays2",
                    "illness2",
                    "holiday2",

                    "year3",
                    "targetworkingdays3",
                    "actualworkingdays3",
                    "illness3",
                    "holiday3",

                    "year4",
                    "targetworkingdays4",
                    "actualworkingdays4",
                    "illness4",
                    "holiday4",

                    "year5",
                    "targetworkingdays5",
                    "actualworkingdays5",
                    "illness5",
                    "holiday5",

                    "year6",
                    "targetworkingdays6",
                    "actualworkingdays6",
                    "illness6",
                    "holiday6",

                    "year7",
                    "targetworkingdays7",
                    "actualworkingdays7",
                    "illness7",
                    "holiday7",

                    "year8",
                    "targetworkingdays8",
                    "actualworkingdays8",
                    "illness8",
                    "holiday8",

                    "year9",
                    "targetworkingdays9",
                    "actualworkingdays9",
                    "illness9",
                    "holiday9",

                    "year10",
                    "targetworkingdays10",
                    "actualworkingdays10",
                    "illness10",
                    "holiday10",

                    "year11",
                    "targetworkingdays11",
                    "actualworkingdays11",
                    "illness11",
                    "holiday11",

                    "year10",
                    "targetworkingdays10",
                    "actualworkingdays10",
                    "illness10",
                    "holiday10"
                ]}
                rows={[
                    ...tmpControls.map(canc => [
                        canc.region,
                        canc.employee,
                        canc.year1,
                        canc.targetworkingdays1,
                        canc.actualworkingdays1,
                        canc.illness1,
                        canc.holiday1,
                        canc.year2,
                        canc.targetworkingdays2,
                        canc.actualworkingdays2,
                        canc.illness2,
                        canc.holiday2,
                        canc.year3,
                        canc.targetworkingdays3,
                        canc.actualworkingdays3,
                        canc.illness3,
                        canc.holiday3,
                        canc.year4,
                        canc.targetworkingdays4,
                        canc.actualworkingdays4,
                        canc.illness4,
                        canc.holiday4,
                        canc.year5,
                        canc.targetworkingdays5,
                        canc.actualworkingdays5,
                        canc.illness5,
                        canc.holiday5,
                        canc.year6,
                        canc.targetworkingdays6,
                        canc.actualworkingdays6,
                        canc.illness6,
                        canc.holiday6,
                        canc.year7,
                        canc.targetworkingdays7,
                        canc.actualworkingdays7,
                        canc.illness7,
                        canc.holiday7,
                        canc.year8,
                        canc.targetworkingdays8,
                        canc.actualworkingdays8,
                        canc.illness8,
                        canc.holiday8,
                        canc.year9,
                        canc.targetworkingdays9,
                        canc.actualworkingdays9,
                        canc.illness9,
                        canc.holiday9,
                        canc.year10,
                        canc.targetworkingdays10,
                        canc.actualworkingdays10,
                        canc.illness10,
                        canc.holiday10,
                        canc.year11,
                        canc.targetworkingdays11,
                        canc.actualworkingdays11,
                        canc.illness11,
                        canc.holiday11,
                        canc.year12,
                        canc.targetworkingdays12,
                        canc.actualworkingdays12,
                        canc.illness12,
                        canc.holiday12
                    ])
                ]}
            />
        </Loading>
    );
};
