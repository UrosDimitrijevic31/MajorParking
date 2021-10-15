import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchableContentCard } from "components";
import Routes from "routes";
const ClientRoute = Routes.dashboard.administration.client;

const clients = [
    { itemId: "client-1", label: "Marko" },
    { itemId: "client-2", label: "Mirko" },
    { itemId: "client-3", label: "Stevan" },
    { itemId: "client-4", label: "Nikola" },
    { itemId: "client-5", label: "Nenad" }
];

export const ClientCard = (): JSX.Element => {
    const { t } = useTranslation();
    const [selectedItemId, setSelectedIdemId] = useState("");
    const [redirectTo, setRedirectTo] = useState("");

    const handleItemSelect = (itemId): void => {
        setSelectedIdemId(itemId);
    };

    const handleItemAdd = (): void => {
        setRedirectTo(ClientRoute.add);
    };

    const handleItemEdit = (): void => {
        setRedirectTo(`${ClientRoute.path}/${selectedItemId}/edit`);
    };

    const handleItemDelete = (): void => {
        setRedirectTo(`${ClientRoute.path}/${selectedItemId}/remove`);
    };

    return (
        <>
            {redirectTo && <Redirect to={redirectTo} />}
            <SearchableContentCard
                heading={t("administration.onlineClient")}
                onAdd={handleItemAdd}
                onDelete={handleItemDelete}
                onEdit={handleItemEdit}
                onItemSelect={handleItemSelect}
                listItems={clients}
                selectedItemId={selectedItemId}
                className="client-card"
            />
        </>
    );
};
