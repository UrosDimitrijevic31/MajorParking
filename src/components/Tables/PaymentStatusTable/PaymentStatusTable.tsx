import React, { useState, useEffect } from "react";
import { IDefaultProps } from "types";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Loading } from "components";
import { getPaymentStatuses } from "services";
import { useDashboardState, useDashboardDispatch, SET_PRODUCTS } from "context";
import { toast } from "react-toastify";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

export const PaymentStatusTable = (): JSX.Element => {
    const { t } = useTranslation();
    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);

    const loadStatuses = (): void => {
        setTableDataLoading(true);
        getPaymentStatuses().then(res => {
            if (res.data.result === "ok") {
                setPaymentStatuses(res.data.paymentStatuses);
            }
            setTableDataLoading(false);
        });
    };
    useEffect(() => {
        loadStatuses();
    }, [setPaymentStatuses]);

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
            sortedArray = sort_asc_by_key(paymentStatuses, i);
        } else {
            sortedArray = sort_desc_by_key(paymentStatuses, i);
        }
    };
    return (
        <Table
            className="mb-4 header__pointer"
            headings={[t("general.type"), "", ""]}
            clicked={onSort}
            keys={["name"]}
            rows={[
                ...paymentStatuses.map((payment: IDefaultProps) => [
                    payment.name,
                    <div key={1} className="text-right">
                        <button key={1} className={buttonLinkStyle}></button>
                    </div>,

                    <div key={2} className="text-right">
                        <button className={buttonLinkStyle}></button>
                    </div>
                ])
            ]}
        />
    );
};
