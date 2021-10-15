import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchableContentCard } from "components";
import Routes from "routes";
const EmployeeRoute = Routes.dashboard.administration.employee;

const employees = [
    { itemId: "employee-1", label: "Marko" },
    { itemId: "employee-2", label: "Mirko" },
    { itemId: "employee-3", label: "Stevan" },
    { itemId: "employee-4", label: "Nikola" },
    { itemId: "employee-5", label: "Nenad" }
];

export const EmployeeCard = (): JSX.Element => {
    const { t } = useTranslation();
    const [selectedItemId, setSelectedIdemId] = useState("");
    const [redirectTo, setRedirectTo] = useState("");

    const handleItemSelect = (itemId): void => {
        setSelectedIdemId(itemId);
    };

    const handleItemAdd = (): void => {
        setRedirectTo(EmployeeRoute.add);
    };

    const handleItemEdit = (): void => {
        setRedirectTo(`${EmployeeRoute.path}/${selectedItemId}/edit`);
    };

    const handleItemDelete = (): void => {
        setRedirectTo(`${EmployeeRoute.path}/${selectedItemId}/remove`);
    };

    return (
        <>
            {redirectTo && <Redirect to={redirectTo} />}
            <SearchableContentCard
                heading={t("administration.employee")}
                onAdd={handleItemAdd}
                onDelete={handleItemDelete}
                onEdit={handleItemEdit}
                onItemSelect={handleItemSelect}
                listItems={employees}
                selectedItemId={selectedItemId}
                className="employee-card"
            />
        </>
    );
};
