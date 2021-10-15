import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Datepicker, Select, Button, Table } from "components";

const employeeOptions = [
    {
        label: "Operator 1",
        value: "operator1"
    },
    {
        label: "Operator 2",
        value: "operator2"
    }
];

const tableData = [
    ["Peter", "20.05.2020", "68 min", "East", "100e", "16:48", "08:05", 10, 60],
    ["Peter", "20.05.2020", "68 min", "East", "100e", "16:48", "08:05", 10, 60],
    ["Peter", "20.05.2020", "68 min", "East", "100e", "16:48", "08:05", 10, 60]
];

export const TimeAndAttendence = (): JSX.Element => {
    const { t } = useTranslation();
    const [filtersData, setFiltersData] = useState({
        dateFrom: new Date(),
        dateTo: new Date(),
        employee: null
    });

    const handleFiltersChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };
    return (
        <section className="time-and-attendence">
            <header>
                <h2 className="heading heading--main">
                    {t("timeAndAttendance.label")}
                </h2>
            </header>
            <div className="time-and-attendence__content card">
                <div className="inspection__filters mb-12">
                    <div className="flex mb-4">
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
                    <div className="max-w-sm mb-6">
                        <Select
                            value={filtersData.employee}
                            onChange={handleFiltersChange.bind(
                                this,
                                "employee"
                            )}
                            label={t("employee.label")}
                            options={employeeOptions}
                        />
                    </div>
                    <div>
                        <Button className="mr-4">{t("general.show")}</Button>
                        <Button color="secondary">{t("general.export")}</Button>
                    </div>
                </div>
                <div className="time-and-attendence__table">
                    <Table
                        headings={[
                            t("general.name"),
                            t("general.date"),
                            t("timeAndAttendance.drivingTime"),
                            t("general.region"),
                            t("timeAndAttendance.costs"),
                            t("timeAndAttendance.checkoutTime"),
                            t("timeAndAttendance.firstDetection"),
                            t("timeAndAttendance.numberOfTickets"),
                            t("timeAndAttendance.scannedVehicles")
                        ]}
                        rows={tableData}
                    />
                </div>
            </div>
        </section>
    );
};
