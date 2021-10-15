import React, { useState, useEffect } from "react";
import { IInputError, IHoliday } from "types";
import {
    Modal,
    Loading,
    Table,
    Datepicker,
    Button,
    InputField,
    Select
} from "components";
import {
    getEmployee,
    saveHoliday,
    deleteHoliday,
    getHolidayTypes
} from "services";
import { useTranslation } from "react-i18next";
import AnimateHeight from "react-animate-height";
import { formatDate, DATE_FORMAT } from "helpers";
import { toast } from "react-toastify";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IHolidaysModalProps {
    visible: boolean;
    selectedEmployeeId: string;
    onClose: () => void;
}

const defaultAddNewModalData = {
    visible: false,
    newHoliday: {
        id: undefined,
        holidayName: "",
        start: new Date(),
        end: new Date(),
        type: null
    }
};

export const HolidaysModal = ({
    visible,
    selectedEmployeeId,
    onClose
}: IHolidaysModalProps): JSX.Element => {
    const { t } = useTranslation();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [holidayTypes, setHolidayTypes] = useState(null);
    const [addNewModalData, setAddNewModalData] = useState({
        ...defaultAddNewModalData
    });
    useEffect(() => {
        if (visible && selectedEmployeeId) {
            getEmployee(selectedEmployeeId, true).then(res => {
                setSelectedEmployee(res.data.employee);
            });
        } else {
            setSelectedEmployee(null);
        }
    }, [selectedEmployeeId, visible]);

    useEffect(() => {
        if (visible && selectedEmployeeId) {
            getHolidayTypes().then(res => {
                const { holidayTypes } = res.data;
                setHolidayTypes([
                    ...holidayTypes.map(b => ({
                        label: b.name,
                        value: b.id
                    }))
                ]);
                console.log(holidayTypes, "Types");
            });
        } else {
            setSelectedEmployee(null);
        }
    }, [setHolidayTypes, visible]);

    const handleOpenAddNewHoliday = (): void => {
        setAddNewModalData({
            ...defaultAddNewModalData,
            visible: true
        });
    };

    const handleCancelAddNewHoliday = (): void => {
        setAddNewModalData({
            ...addNewModalData,
            visible: false
        });
    };

    const handleEditHoliday = (holiday: IHoliday): void => {
        setAddNewModalData({
            visible: true,
            newHoliday: {
                id: holiday.id,
                holidayName: holiday.name,
                start: new Date(holiday.start),
                end: new Date(holiday.end),
                type: { label: holiday.type?.name, value: holiday.type?.id }
            }
        });
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleNewHolidayChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddNewModalData({
            ...addNewModalData,
            newHoliday: {
                ...addNewModalData.newHoliday,
                [prop]: value
            }
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

    const handleAddNewHoliday = (): void => {
        const errors = [];

        if (!addNewModalData.newHoliday.holidayName) {
            errors.push({
                fieldName: "holidayName",
                error: t("general.isRequired", {
                    value: t("general.name")
                })
            });
        }

        if (!addNewModalData.newHoliday.type) {
            errors.push({
                fieldName: "type",
                error: t("general.isRequired", {
                    value: t("general.holidayType")
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            const fromDate = addNewModalData.newHoliday.start.getTime();
            const toDate = addNewModalData.newHoliday.end.getTime();
            saveHoliday({
                id: addNewModalData.newHoliday.id,
                name: addNewModalData.newHoliday.holidayName,
                start: fromDate,
                end: toDate,
                employeeId: selectedEmployeeId,
                typeId: addNewModalData.newHoliday.type.value
            }).then(res => {
                res;
                getEmployee(selectedEmployeeId, true).then(res => {
                    setSelectedEmployee(res.data.employee);
                });
                addNewModalData.newHoliday.holidayName = "";
                addNewModalData.newHoliday.start = new Date();
                addNewModalData.newHoliday.end = new Date();
                addNewModalData.newHoliday.type = null;
                console.log("submitted");
                handleCancelAddNewHoliday();
                // loadClients();
            });
        }
    };
    const deleteHolidayItem = (holiday): void => {
        console.log(holiday.id);
        deleteHoliday({
            id: holiday.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("employee.deleteHoliday"));
                getEmployee(selectedEmployeeId, true).then(res => {
                    setSelectedEmployee(res.data.employee);
                });
            }
        });
    };

    return (
        <Modal visible={visible} onClose={onClose}>
            <div className="employees-table__holiday-modal-content min-w-600">
                <Loading isLoading={!selectedEmployee}>
                    {selectedEmployee && (
                        <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                            {t("employee.holidaysModalTitle", {
                                employee: selectedEmployee.name
                            })}
                        </h3>
                    )}
                    {selectedEmployee?.holidays && (
                        <div className="mb-6">
                            <Table
                                headings={[
                                    "Name",
                                    "From",
                                    "To",
                                    "Holiday Type"
                                ]}
                                rows={[
                                    ...selectedEmployee.holidays.map(
                                        (h: IHoliday) => [
                                            h.name,
                                            formatDate(h.start),
                                            formatDate(h.end),
                                            h.type?.name,
                                            <button
                                                key={3}
                                                onClick={handleEditHoliday.bind(
                                                    this,
                                                    h
                                                )}
                                                className="underline hover:text-seance lowercase font-thin"
                                            >
                                                {t("general.edit")}
                                            </button>,
                                            <button
                                                key={1}
                                                className={buttonLinkStyle}
                                                onClick={deleteHolidayItem.bind(
                                                    this,
                                                    h
                                                )}
                                            >
                                                {t("general.delete")}
                                            </button>
                                        ]
                                    )
                                ]}
                            />
                        </div>
                    )}
                </Loading>
                <div className="flex justify-end">
                    <button
                        onClick={handleOpenAddNewHoliday}
                        className="underline hover:text-seance lowercase font-thin capitalize"
                    >
                        {t("employee.addNewHoliday")}
                    </button>
                </div>
            </div>
            <div className="absolute right-0 holidays-modal__add-new-modal">
                <AnimateHeight
                    contentClassName="card"
                    duration={300}
                    height={addNewModalData.visible ? "auto" : 0} // see props documentation below
                >
                    <h5 className="font-light text-center text-blue-oxford text-2xl">
                        {addNewModalData.newHoliday.id
                            ? t("employee.editHoliday")
                            : t("employee.addNewHoliday")}
                    </h5>
                    <div className="flex flex-col">
                        <div className="mr-4 mb-6">
                            <InputField
                                type="text"
                                label={t("general.name")}
                                value={addNewModalData.newHoliday.holidayName}
                                onChange={handleNewHolidayChange.bind(
                                    this,
                                    "holidayName"
                                )}
                                error={fieldError("holidayName")}
                            />
                        </div>
                        <div className="mr-4 mb-2 flex flex-row">
                            <span className="mr-3">{t("general.from")}:</span>

                            <Datepicker
                                dateFormat={DATE_FORMAT}
                                maxDate={addNewModalData.newHoliday.end}
                                selected={addNewModalData.newHoliday.start}
                                onChange={handleNewHolidayChange.bind(
                                    this,
                                    "start"
                                )}
                            />
                        </div>
                        <div className="mr-4 mb-4 flex flex-row">
                            <span className="mr-3">{t("general.to")}:</span>
                            <Datepicker
                                dateFormat={DATE_FORMAT}
                                minDate={addNewModalData.newHoliday.start}
                                selected={addNewModalData.newHoliday.end}
                                onChange={handleNewHolidayChange.bind(
                                    this,
                                    "end"
                                )}
                            />
                        </div>
                        <div className="mr-4 mb-4 flex flex-row">
                            <span className="mr-3"></span>
                            <Select
                                value={addNewModalData.newHoliday.type}
                                onChange={handleNewHolidayChange.bind(
                                    this,
                                    "type"
                                )}
                                label={t("general.holidayType")}
                                options={holidayTypes}
                                isClearable={false}
                            />
                        </div>
                        <div>
                            <Button
                                className="mr-4"
                                onClick={handleAddNewHoliday}
                            >
                                {addNewModalData.newHoliday.id
                                    ? t("general.save")
                                    : t("general.add")}
                            </Button>
                            <Button
                                color="danger"
                                onClick={handleCancelAddNewHoliday}
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </div>
                </AnimateHeight>
            </div>
        </Modal>
    );
};
