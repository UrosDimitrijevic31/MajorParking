import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Routes from "routes";
import { useParams } from "react-router-dom";
import {
    StyledCardHeader,
    InputField,
    Button,
    Select,
    formatOptions,
    Checkbox
} from "components";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_ROLES,
    SET_REGIONS,
    SET_VEHICLES,
    SET_EMPLOYEES
} from "context";
import {
    getRoles,
    getRegions,
    getVehicles,
    saveEmployee,
    getEmployees
} from "services";
import { toast } from "react-toastify";
import { IEmployee, ISelectOption, IInputError } from "types";
const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
interface IAddEmployForm {
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

export const AddEmployee = (): JSX.Element => {
    const { t } = useTranslation();
    const { regions, roles, vehicles, employees } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const { employeeId } = useParams();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [formData, setFormData] = useState<IAddEmployForm>({
        ...defaultFormValues
    });

    const isEditMode = (): boolean => !!employeeId;

    const loadEmployees = useCallback(() => {
        getEmployees().then(res => {
            const { employees } = res.data;
            dashboardDispatch({
                type: SET_EMPLOYEES,
                payload: employees
            });
        });
    }, []);

    useEffect(() => {
        if (!employees.length) {
            loadEmployees();
        }
    }, []);

    useEffect(() => {
        if (isEditMode()) {
            const emp = employees.find(e => e.id === employeeId) as IEmployee;

            if (emp) {
                const {
                    name,
                    lastName,
                    email,
                    userName,
                    phone,
                    role,
                    region,
                    vehicle,
                    serviceNumber,
                    printerSerial,
                    workingHours,
                    smartphone,
                    deviceNumber,
                    hourlyRate
                } = emp;

                setFormData({
                    ...defaultFormValues,
                    firstName: name,
                    lastName,
                    email,
                    userName,
                    phone,
                    serviceNumber,
                    hourlyRate,
                    role: {
                        value: role.id,
                        label: role.name
                    },
                    region: {
                        value: region.id,
                        label: region.name
                    },
                    vehicle: {
                        value: vehicle.id,
                        label: `${vehicle.carBrand.name} ${vehicle.model}`
                    },
                    printerSerial: printerSerial || "",
                    workingHours: workingHours,
                    smartphone: smartphone,
                    deviceNumber: deviceNumber
                });
            }
        }
    }, [employees, employeeId]);

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

            if (isEditMode()) {
                saveEmployeeParams["id"] = employeeId;
            }

            saveEmployee(saveEmployeeParams).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("employee.createEmployeeSuccessMessage"));
                    setFormData({ ...defaultFormValues });

                    loadEmployees();
                }
            });
        }
    };

    return (
        <section className="whitelist__add-modal-content  w-full max-w-5xl card">
            {isEditMode() ? (
                <StyledCardHeader
                    heading={t("employee.editEmployeeFormTitle")}
                    subHeading={t("employee.editEmployeeFormDescription")}
                />
            ) : (
                <StyledCardHeader
                    heading={t("employee.addEmployeeFormTitle")}
                    subHeading={t("employee.addEmployeeFormDescription")}
                />
            )}

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
                            onChange={handleFormDataChange.bind(this, "email")}
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
                            onChange={handleFormDataChange.bind(this, "phone")}
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
                                    label: `${v.carBrand.name} ${v.model}`,
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

                    <Button type="submit">
                        {isEditMode()
                            ? t("employee.saveChanges")
                            : t("employee.addEmployee")}
                    </Button>
                    <NavLink key={13} to={`${Routes.dashboard.administration}`}>
                        <Button className="btn btn--secondary py-2 px-6 ml-4 mt-4 inline-block">
                            {t("general.cancel")}
                        </Button>
                    </NavLink>
                </form>
            </div>
        </section>
    );
};
