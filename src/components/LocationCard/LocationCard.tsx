import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SearchableContentCard } from "components";
import Routes from "routes";
const LocationRoute = Routes.dashboard.administration.location;

const locations = [
    {
        itemId: "lokacija-1",
        label: "Lidl"
    },
    {
        itemId: "lokacija-2",
        label: "Aldi"
    },
    {
        itemId: "lokacija-3",
        label: "Maxi"
    },
    {
        itemId: "lokacija-4",
        label: "IDEA"
    },
    {
        itemId: "lokacija-5",
        label: "Tempo"
    },
    {
        itemId: "lokacija-6",
        label: "Aman"
    }
];

export const LocationCard = (): JSX.Element => {
    const { t } = useTranslation();
    const [selectedItemId, setSelectedIdemId] = useState("");
    const [redirectTo, setRedirectTo] = useState("");

    const handleItemSelect = (itemId): void => {
        setSelectedIdemId(itemId);
    };

    const handleItemAdd = (): void => {
        setRedirectTo(LocationRoute.add);
    };

    const handleItemEdit = (): void => {
        setRedirectTo(`${LocationRoute.path}/${selectedItemId}/edit`);
    };

    const handleItemDelete = (): void => {
        setRedirectTo(`${LocationRoute.path}/${selectedItemId}/remove`);
    };

    return (
        <>
            {redirectTo && <Redirect to={redirectTo} />}
            <SearchableContentCard
                heading={t("administration.location")}
                onAdd={handleItemAdd}
                onDelete={handleItemDelete}
                onEdit={handleItemEdit}
                onItemSelect={handleItemSelect}
                listItems={locations}
                selectedItemId={selectedItemId}
                className="location-card"
            />
        </>
    );
};
