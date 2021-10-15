import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Table, UploadFile, Datepicker, Button } from "components";
import { getFilterTransactions } from "services";
import { sub } from "date-fns";

export const Accounting = (): JSX.Element => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        allTickets: false,
        outstandingTickets: false
    });
    const [filtersData, setFiltersData] = useState({
        dateFrom: sub(new Date(), { months: 1 }),
        dateTo: new Date()
    });

    const [trans, setTransactions] = useState();
    const [data, setData] = useState({
        transactions: []
    });
    const [file, setUploadFile] = useState(null);

    const handleFormDataChange = (prop, e): void => {
        file;
        let value;

        if (e != undefined) {
            value = e.currentTarget ? e.currentTarget.value : e;
        } else {
            value = "";
        }
        setFilters({
            ...filters,
            [prop]: value
        });
    };

    const showTransactions = (): void => {
        getFilterTransactions(filtersData.dateFrom, filtersData.dateTo).then(
            res => {
                if (res.data.result === "ok") {
                    setTransactions(res.data.transactions);
                    setData({
                        transactions: res.data.transactions
                    });
                }
            }
        );
    };
    useEffect(() => {
        showTransactions();
    }, [setTransactions]);

    const handleFiltersChange = (prop, e): void => {
        const value = e && e.currentTarget ? e.currentTarget.value : e;
        setFiltersData({
            ...filtersData,
            [prop]: value
        });
    };
    const handleFileSelect = (e): void => {
        setUploadFile(e.currentTarget);
    };

    return (
        <section className="accounting w-full">
            <header>
                <h2 className="heading heading--main">
                    {t("accounting.label")}
                </h2>
            </header>
            <div className="accounting__content card">
                <div className="inspection__filters mb-12">
                    <div className="flex">
                        Number of transactions: {data.transactions.length}
                    </div>
                    <br />
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
                </div>
                <Button className="mr-4" onClick={showTransactions}>
                    {t("general.show")}
                </Button>
                <Table
                    headings={[
                        "Transaction ID",
                        "Amount",
                        "Details",
                        "Ticket number",
                        "Ticket fee",
                        "Date payed"
                    ]}
                    rows={[
                        ...data.transactions.map(transaction => [
                            transaction.reference,
                            transaction.amount,
                            transaction.details,
                            transaction.ticketNumber,
                            transaction.ticketPrice,
                            new Date(transaction.stampPayed).toLocaleString(
                                "de-DE"
                            )
                        ])
                    ]}
                />
                {/* <div className="mt-12 max-w-sm">
                    <span>{t("accounting.uploadCSVlabel")}</span>
                    <UploadFile onFileSelect={handleFileSelect} />
                </div> */}
            </div>
        </section>
    );
};
