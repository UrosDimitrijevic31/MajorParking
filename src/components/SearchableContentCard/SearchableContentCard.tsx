import React, { useState, useEffect, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { InputField, Button } from "components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IListItem {
    itemId: string;
    label: string;
}

export interface ISearchableContentCardProps {
    heading: string;
    className?: string;
    listItems: IListItem[];
    selectedItemId: string;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onItemSelect: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const SearchableContentCard = ({
    onAdd,
    onEdit,
    heading,
    onDelete,
    listItems,
    className,
    onItemSelect,
    selectedItemId
}: ISearchableContentCardProps): JSX.Element => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");

    const [filteredListItems, setFilteredListItems] = useState([...listItems]);

    const handleInputChange = (e): void => {
        setSearchValue(e.currentTarget.value);
    };

    useEffect(() => {
        setFilteredListItems([
            ...listItems.filter(item =>
                item.label.toLowerCase().includes(searchValue.toLowerCase())
            )
        ]);
    }, [searchValue]);

    return (
        <article className={`${className} card`}>
            <header className="card__header">{heading}</header>
            <InputField
                label={t("general.search")}
                icon="search"
                className="mb-6"
                value={searchValue}
                onChange={handleInputChange}
            />
            <ul className="searchable-content-card__list">
                {filteredListItems.map(item => {
                    return (
                        <li
                            key={`${item.itemId}`}
                            className={`searchable-content-card__list-item mb-2 cursor-default cursor-pointer font-light ${
                                item.itemId === selectedItemId
                                    ? "text-seance"
                                    : ""
                            }`}
                            onClick={onItemSelect.bind(this, item.itemId)}
                        >
                            {item.itemId === selectedItemId && (
                                <FontAwesomeIcon
                                    className="text-seance mx-1 text-sm"
                                    icon="check"
                                />
                            )}
                            {item.label}
                        </li>
                    );
                })}
            </ul>
            <Button className="w-full mb-2" onClick={onAdd}>
                {t("general.add")}
            </Button>
            <div className="flex flex-row">
                <div className="flex-1 pr-1">
                    <Button
                        className="w-full"
                        color="danger"
                        onClick={onDelete}
                    >
                        {t("general.delete")}
                    </Button>
                </div>
                <div className="flex-1 pl-1">
                    <Button className="w-full" color="info" onClick={onEdit}>
                        {t("general.edit")}
                    </Button>
                </div>
            </div>
        </article>
    );
};
