import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Routes from "routes";
import { useTranslation } from "react-i18next";
import {
    Table,
    Loading,
    InputField,
    Button,
    Select,
    formatOptions,
    Checkbox,
    Modal
} from "components";
import { IEmployee, ISelectOption, IInputError } from "types";
import {
    getEmployees,
    deleteEmployee,
    getRoles,
    getRegions,
    getVehicles,
    saveEmployee
} from "services";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_ROLES,
    SET_REGIONS,
    SET_VEHICLES,
    SET_EMPLOYEES
} from "context";
import { toast } from "react-toastify";
import { HolidaysModal } from "./HolidaysModal";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";
const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
interface IAddEmployForm {
    id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    userName: string;
    phone: string;
    serviceNumber: string;
    region: ISelectOption;
    vehicle: ISelectOption;
    role: ISelectOption;
    printerSerial: string;
    // androidVersion: string;
    smartphone: string;
    deviceNumber: string;
    workingHours: number;
    hourlyRate: number;
    active: boolean;
}

const defaultFormValues = {
    id: null,
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    userName: "",
    phone: "",
    serviceNumber: "",
    region: null,
    vehicle: null,
    role: null,
    printerSerial: "",
    // androidVersion: "",
    smartphone: "",
    deviceNumber: "",
    workingHours: 0,
    hourlyRate: 0,
    active: true
};
export const EmployeesTable = (): JSX.Element => {
    const { t } = useTranslation();
    const dashboardDispatch = useDashboardDispatch();
    // const { employees } = useDashboardState();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const { regions, roles, vehicles, employees } = useDashboardState();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [modalsVisibility, setModalsVisibility] = useState({
        addEmployeeModal: false
    });
    const [holidaysModalData, setHolidaysModalData] = useState({
        visible: false,
        selectedEmployeeId: ""
    });
    const [formData, setFormData] = useState<IAddEmployForm>({
        ...defaultFormValues
    });

    useEffect(() => {
        if (!employees.length) {
            setTableDataLoading(true);
            getEmployees().then(res => {
                const { employees } = res.data;

                dashboardDispatch({
                    type: SET_EMPLOYEES,
                    payload: employees
                });

                setTableDataLoading(false);
            });
        }
    }, []);

    useEffect(() => {
        if (!roles.length) {
            getRoles().then(res => {
                const { roles } = res.data;

                dashboardDispatch({
                    type: SET_ROLES,
                    payload: roles
                });
            });
        }
        if (!regions.length) {
            getRegions().then(res => {
                const { regions } = res.data;

                dashboardDispatch({
                    type: SET_REGIONS,
                    payload: regions
                });
            });
        }
        if (!vehicles.length) {
            getVehicles().then(res => {
                const { vehicles } = res.data;

                dashboardDispatch({
                    type: SET_VEHICLES,
                    payload: vehicles
                });
            });
        }
    }, []);

    const handleHolidaysModalToggle = (value, employeeId): void => {
        const visible =
            value !== undefined ? value : !holidaysModalData.visible;

        if (visible) {
            setHolidaysModalData({
                visible,
                selectedEmployeeId: employeeId
            });
        } else {
            setHolidaysModalData({
                visible,
                selectedEmployeeId: ""
            });
        }
    };
    const deleteEmployeeItem = (client): void => {
        console.log(client.id);
        deleteEmployee({
            id: client.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("employee.deleteEmployee"));
                getEmployees().then(res => {
                    const { employees } = res.data;
                    dashboardDispatch({
                        type: SET_EMPLOYEES,
                        payload: employees
                    });

                    setTableDataLoading(false);
                });
            }
        });
    };

    const handleAddEmployeeModal = (modal, value, item): void => {
        if (value) {
            if (item) {
                formData.id = item.id;
                formData.firstName = item.name;
                formData.lastName = item.lastName;
                formData.password = item.password;
                formData.email = item.email;
                formData.userName = item.userName;
                formData.phone = item.phone;
                formData.serviceNumber = item.serviceNumber;

                formData.region = {
                    value: item.region?.id,
                    label: item.region?.name
                };
                formData.vehicle = {
                    value: item.vehicle?.id,
                    label:
                        item.vehicle?.brandName +
                        " " +
                        item.vehicle?.model +
                        ", " +
                        item.vehicle.plates
                };
                formData.role = {
                    value: item.role?.id,
                    label: item.role?.name
                };

                formData.printerSerial = item.printerSerial;
                formData.smartphone = item.smartphone;
                formData.deviceNumber = item.deviceNumber;
                formData.workingHours = item.workingHours;
                formData.hourlyRate = item.hourlyRate;
                formData.active = item.active;
            } else {
                formData.id = null;
                formData.firstName = null;
                formData.lastName = null;
                formData.password = null;
                formData.email = null;
                formData.userName = null;
                formData.phone = null;
                formData.serviceNumber = null;

                formData.region = null;
                formData.vehicle = null;
                formData.role = null;

                formData.printerSerial = null;
                formData.smartphone = null;
                formData.deviceNumber = null;
                formData.workingHours = null;
                formData.hourlyRate = null;
                formData.active = true;
            }

            setFormData(formData);
            // });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const isFormValid = (): boolean => {
        const validationErrors = [];

        if (!formData.firstName) {
            validationErrors.push({
                fieldName: "firstName",
                error: t("general.isRequired", {
                    value: t("general.firstName")
                })
            });
        }
        if (!formData.lastName) {
            validationErrors.push({
                fieldName: "lastName",
                error: t("general.isRequired", {
                    value: t("general.lastName")
                })
            });
        }
        if (!formData.role) {
            validationErrors.push({
                fieldName: "role",
                error: t("general.isRequired", {
                    value: t("general.role")
                })
            });
        }
        if (!formData.region) {
            validationErrors.push({
                fieldName: "region",
                error: t("general.isRequired", {
                    value: t("general.region")
                })
            });
        }
        if (!formData.vehicle) {
            validationErrors.push({
                fieldName: "vehicle",
                error: t("general.isRequired", {
                    value: t("general.vehicle")
                })
            });
        }

        setInputErrors([...validationErrors]);

        return !validationErrors.length;
    };

    const handleFormSubmit = (e): void => {
        e.preventDefault();
        console.info(formData);

        if (isFormValid()) {
            const saveEmployeeParams = {
                ...formData,
                regionId: formData.region?.value,
                roleId: formData.role?.value,
                vehicleId: formData.vehicle?.value
            };

            // if (isEditMode()) {
            //     saveEmployeeParams["id"] = employeeId;
            // }
            console.log(saveEmployeeParams, "Save employee params");

            saveEmployee(saveEmployeeParams).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("employee.createEmployeeSuccessMessage"));
                    setFormData({ ...defaultFormValues });

                    setTableDataLoading(true);
                    getEmployees().then(res => {
                        const { employees } = res.data;

                        dashboardDispatch({
                            type: SET_EMPLOYEES,
                            payload: employees
                        });

                        setTableDataLoading(false);
                    });
                    modalsVisibility.addEmployeeModal = false;
                }
            });
        }
    };

    const handleFormDataChange = (prop, e): void => {
        let value;

        if (e != undefined) {
            value = e.currentTarget ? e.currentTarget.value : e;
        } else {
            value = "";
        }

        setFormData({
            ...formData,
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
            sortedArray = sort_asc_by_key(employees, i);
        } else {
            sortedArray = sort_desc_by_key(employees, i);
        }
    };

    return (
        <>
            <Loading isLoading={tableDataLoading}>
                <Button
                    onClick={handleAddEmployeeModal.bind(
                        this,
                        "addEmployeeModal",
                        true,
                        null
                    )}
                    className="btn btn--primary py-2 px-6 mt-4 inline-block"
                >
                    {t("employee.addEmployee")}
                </Button>
                <Table
                    className="header__pointer"
                    headings={[
                        t("general.name"),
                        t("general.surname"),
                        // t("general.password"),
                        t("general.email"),
                        t("general.username"),
                        t("general.phone"),
                        t("employee.serviceNumber"),
                        t("employee.region"),
                        t("general.role"),
                        // t("employee.androidVersion"),
                        t("employee.printerSerial"),
                        t("employee.workingHoursPerDay"),
                        t("vehicles.plates"),
                        t("general.status")
                    ]}
                    clicked={onSort}
                    keys={[
                        "name",
                        "lastName",
                        "email",
                        "userName",
                        "phone",
                        "serviceNumber",
                        "regionName",
                        "roleName",
                        "printerSerial",
                        "workingHours",
                        "plates",
                        "active"
                    ]}
                    rows={[
                        ...employees.map((employee: IEmployee) => [
                            employee.name,
                            employee.lastName,
                            // employee.password,
                            employee.email,
                            employee.userName,
                            employee.phone,
                            employee.serviceNumber,
                            employee.region.name,
                            employee.role.name,
                            // employee.androidVersion,
                            employee.printerSerial,
                            employee.workingHours,
                            employee.vehicle?.plates,
                            employee.active
                                ? t("general.active")
                                : t("general.inactive"),
                            // <NavLink
                            //     key={11}
                            //     className="underline hover:text-seance lowercase"
                            //     to={`${Routes.dashboard.administration.employee.path}/${employee.id}/add`}
                            // >
                            //     {t("general.edit")}
                            // </NavLink>,
                            <button
                                key={12}
                                className="underline hover:text-seance lowercase font-thin"
                                onClick={handleAddEmployeeModal.bind(
                                    this,
                                    "addEmployeeModal",
                                    true,
                                    employee
                                )}
                            >
                                {t("general.edit")}
                            </button>,
                            <button
                                key={12}
                                className="underline hover:text-seance lowercase font-thin"
                                onClick={handleHolidaysModalToggle.bind(
                                    this,
                                    true,
                                    employee.id
                                )}
                            >
                                {t("employee.holidays")}
                            </button>,
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteEmployeeItem.bind(
                                    this,
                                    employee
                                )}
                            >
                                {t("general.delete")}
                            </button>
                        ])
                    ]}
                />
            </Loading>
            <Modal
                visible={modalsVisibility.addEmployeeModal}
                onClose={handleAddEmployeeModal.bind(
                    this,
                    "addEmployeeModal",
                    false,
                    null
                )}
            >
                <div className="add-employee__content">
                    <form
                        onSubmit={handleFormSubmit}
                        className="add-employee__form "
                    >
                        <div className="flex flex-wrap mb-4">
                            <InputField
                                value={formData.firstName}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "firstName"
                                )}
                                className={inputClass}
                                label={t("general.firstName")}
                                error={fieldError("firstName")}
                            />
                            <InputField
                                value={formData.lastName}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "lastName"
                                )}
                                className={inputClass}
                                label={t("general.lastName")}
                                error={fieldError("lastName")}
                            />
                            <InputField
                                value={formData.password}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "password"
                                )}
                                className={inputClass}
                                label={t("general.password")}
                                type="password"
                            />
                            <InputField
                                value={formData.email}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "email"
                                )}
                                className={inputClass}
                                label={t("general.email")}
                                type="email"
                            />
                            <InputField
                                value={formData.userName}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "userName"
                                )}
                                className={inputClass}
                                label={t("general.username")}
                                type="text"
                            />
                            <InputField
                                value={formData.phone}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "phone"
                                )}
                                className={inputClass}
                                label={t("general.phone")}
                                type="text"
                            />
                            <div className={inputClass}>
                                <Select
                                    value={formData.vehicle}
                                    onChange={handleFormDataChange.bind(
                                        this,
                                        "vehicle"
                                    )}
                                    label={t("general.vehicle")}
                                    options={vehicles.map(v => ({
                                        label: `${v.carBrand.name} ${v.model}, ${v.plates}`,
                                        value: v.id
                                    }))}
                                    isClearable={true}
                                    error={fieldError("vehicle")}
                                />
                            </div>
                            <div className={inputClass}>
                                <Select
                                    value={formData.region}
                                    onChange={handleFormDataChange.bind(
                                        this,
                                        "region"
                                    )}
                                    label={t("employee.region")}
                                    options={formatOptions(regions)}
                                    isClearable={true}
                                    error={fieldError("region")}
                                />
                            </div>
                            <div className={inputClass}>
                                <Select
                                    value={formData.role}
                                    onChange={handleFormDataChange.bind(
                                        this,
                                        "role"
                                    )}
                                    label={t("general.role")}
                                    options={formatOptions(roles)}
                                    isClearable={true}
                                    error={fieldError("role")}
                                />
                            </div>
                            <InputField
                                value={formData.serviceNumber}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "serviceNumber"
                                )}
                                className={inputClass}
                                label={t("employee.serviceNumber")}
                                type="text"
                            />
                            <InputField
                                value={formData.deviceNumber}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "deviceNumber"
                                )}
                                className={`${inputClass} min-w-1/2`}
                                label={t("employee.smartphoneDeviceNumber")}
                                type="text"
                            />
                            {/* <InputField
                            value={formData.androidVersion}
                            onChange={handleFormDataChange.bind(
                                this,
                                "androidVersion"
                            )}
                            className={`${inputClass}`}
                            label={t("employee.androidVersion")}
                            type="text"
                        /> */}
                            <InputField
                                value={formData.smartphone}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "smartphone"
                                )}
                                className={`${inputClass}`}
                                label={t("employee.smartphoneType")}
                                type="text"
                            />
                            <InputField
                                value={formData.printerSerial}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "printerSerial"
                                )}
                                className={`${inputClass}`}
                                label={t("employee.printerDeviceNumber")}
                                type="text"
                            />
                            <InputField
                                value={formData.workingHours}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "workingHours"
                                )}
                                className={`${inputClass}`}
                                label={t("employee.numberOfHoursDays")}
                                type="number"
                            />
                            <InputField
                                value={formData.hourlyRate}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "hourlyRate"
                                )}
                                className={`${inputClass}`}
                                label={t("employee.hourlyRate")}
                                type="number"
                            />
                        </div>
                        <div className="flex items-left mb-4">
                            <Checkbox
                                label={`${t("general.active")}/${t(
                                    "general.inactive"
                                )}`}
                                defaultChecked={formData.active}
                                onChange={handleFormDataChange.bind(
                                    this,
                                    "active",
                                    !formData.active
                                )}
                            />
                        </div>
                        <Button type="submit">{t("general.save")}</Button>{" "}
                        &nbsp; &nbsp;
                        <Button
                            type="button"
                            onClick={handleAddEmployeeModal.bind(
                                this,
                                "addEmployeeModal",
                                false,
                                null
                            )}
                        >
                            {t("general.cancel")}
                        </Button>
                    </form>
                </div>
            </Modal>

            <HolidaysModal
                visible={holidaysModalData.visible}
                selectedEmployeeId={holidaysModalData.selectedEmployeeId}
                onClose={handleHolidaysModalToggle.bind(this, false)}
            />
        </>
    );
};
