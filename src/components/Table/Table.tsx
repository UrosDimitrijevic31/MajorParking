import React, { useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface ITableProps {
    className?: string;
    headings: string[];
    params?: string;
    data?: string;
    rows: (string | ReactNode)[][];
    sortKey?: number;
    keys?: string[];
    clicked?: (i) => void;
    noDataLabel?: string;
}

const tdCssClasses = "py-3 px-2 text-sm font-thin text-left whitespace-no-wrap";

export const Table = ({
    className,
    headings,
    rows,
    clicked,
    keys,
    noDataLabel,
    sortKey
}: ITableProps): JSX.Element => {
    const { t } = useTranslation();
    const tableHeadings = [
        ...headings,
        ...Array.from({ length: rows[0]?.length - headings.length }).map(
            () => ""
        )
    ];

    return (
        <div
            className={`table__container table-wrapper w-full overflow-x-auto ${
                className ? className : ""
            }`}
        >
            <table className="table w-full">
                <thead>
                    <tr className="border-gray-400 border-b whitespace-no-wrap">
                        {tableHeadings.map((value, i) => (
                            <th
                                key={i}
                                className={`${tdCssClasses} `}
                                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                                onClick={() => clicked(keys[i])}
                            >
                                {value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {!!rows.length &&
                        rows.map((row, i) => (
                            <tr
                                key={i}
                                className="border-gray-400 border-b hover:bg-gray-gallery"
                            >
                                {row.map((value, i) => (
                                    <td key={i} className={tdCssClasses}>
                                        {value}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
            {!rows.length && (
                <p className="font-thin text-center w-full p-4">
                    {noDataLabel || t("table.noData")}
                </p>
            )}
        </div>
    );
};
