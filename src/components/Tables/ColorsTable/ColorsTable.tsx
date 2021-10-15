import React, { useEffect, useState } from "react";
import { ICarColor, IInputError } from "types";
import { useTranslation } from "react-i18next";
import { getCarColors, saveCarColor, deleteCarColor } from "services";
import { Table, InputField, Button, Loading, Modal } from "components";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_CAR_COLORS
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IColorsTableProps {
    enableAddNew?: boolean;
}

const defaultNewColorValues = {
    name: "",
    code: "",
    nameErr: "",
    codeErr: "",
    id: undefined
};

export const ColorsTable = ({
    enableAddNew
}: IColorsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { carColors } = useDashboardState();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const dashboardDispatch = useDashboardDispatch();
    const [newColor, setNewColor] = useState({
        ...defaultNewColorValues
    });

    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameColor: "",
        codeColor: "",
        idColor: ""
    });
    const loadCarColors = (): void => {
        setTableDataLoading(true);
        getCarColors().then(res => {
            dashboardDispatch({
                type: SET_CAR_COLORS,
                payload: [...res.data.carColors]
            });

            setTableDataLoading(false);
        });
    };

    const handleAddModalToggle = (value, color): void => {
        addModalData.idColor = color.id;
        addModalData.nameColor = color.name;
        addModalData.codeColor = color.code;
        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleEditModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleEditBrandNametSubmit = (e): void => {
        e.preventDefault();
        const { nameColor, idColor, codeColor } = addModalData;
        setTableDataLoading(true);
        saveCarColor({
            name: nameColor,
            id: idColor,
            code: codeColor
        }).then(res => {
            res;
            console.log("submitted");
            loadCarColors();
        });

        handleAddModalToggle(false, idColor);
    };

    useEffect(() => {
        if (!carColors.length) {
            loadCarColors();
        }
    }, []);

    const handleNewColorChange = (prop, e): void => {
        setNewColor({
            ...newColor,
            [prop]: e.currentTarget.value
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

    const handleAddNewColor = (e): void => {
        e.preventDefault();

        const errors = [];

        if (!newColor.name) {
            errors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: `${t("color.label")} ${t("general.name")}`
                })
            });
        }

        if (!newColor.code) {
            errors.push({
                fieldName: "code",
                error: t("general.isRequired", {
                    value: `${t("color.label")} ${t("color.code")}`
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            saveCarColor(newColor).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("settings.newValueSuccessfullyAdded"));
                    setNewColor({
                        ...defaultNewColorValues
                    });
                    loadCarColors();
                }
            });
        }
    };
    const deleteCarColorItem = (color): void => {
        deleteCarColor({
            id: color.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteCarBrand"));
                loadCarColors();
            }
        });
    };
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
            sortedArray = sort_asc_by_key(carColors, i);
        } else {
            sortedArray = sort_desc_by_key(carColors, i);
        }
    };
    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4 header__pointer"
                headings={[t("general.color"), t("color.code")]}
                clicked={onSort}
                keys={["name", "code"]}
                rows={[
                    ...carColors.map((color: ICarColor) => [
                        color.name,
                        color.code,
                        <div key={2} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    color
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <div key={3} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteCarColorItem.bind(this, color)}
                            >
                                {t("general.delete")}
                            </button>
                        </div>
                    ])
                ]}
            />
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("color.edit")}
                    </h3>
                    <form onSubmit={handleEditBrandNametSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameColor}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameColor"
                                )}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("color.code")}
                                value={addModalData.codeColor}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "codeColor"
                                )}
                            />
                        </div>
                        <div className="text-right">
                            <Button
                                type="submit"
                                color="success"
                                className="mr-4"
                            >
                                {t("general.save")}
                            </Button>
                            <Button
                                onClick={handleAddModalToggle.bind(this, false)}
                                color="danger"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
            {enableAddNew && (
                <form onSubmit={handleAddNewColor}>
                    <div className="flex flex-row justify-end">
                        <div className="mr-4 capitalize">
                            <InputField
                                label={`${t("color.label")} ${t(
                                    "general.name"
                                )}`}
                                value={newColor.name}
                                className="mb-6"
                                onChange={handleNewColorChange.bind(
                                    this,
                                    "name"
                                )}
                                error={fieldError("name")}
                            />
                        </div>
                        <div className="mr-4 capitalize">
                            <InputField
                                label={`${t("color.label")} ${t("color.code")}`}
                                value={newColor.code}
                                className="mb-6"
                                onChange={handleNewColorChange.bind(
                                    this,
                                    "code"
                                )}
                                error={fieldError("code")}
                            />
                        </div>
                        <div className="flex items-center">
                            <Button color="secondary" type="submit">
                                {t("general.add")}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </Loading>
    );
};
