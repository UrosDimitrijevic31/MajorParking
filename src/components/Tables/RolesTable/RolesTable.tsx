import React, { useEffect, useState } from "react";
import { IDefaultProps, IInputError } from "types";
import { useTranslation } from "react-i18next";
import { getRoles, saveRole, deleteRole } from "services";
import { Table, Button, InputField, Loading, Modal } from "components";
import { useDashboardState, useDashboardDispatch, SET_ROLES } from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IRolesTableProps {
    enableAddNew?: boolean;
}

export const RolesTable = ({ enableAddNew }: IRolesTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { roles } = useDashboardState();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const dashboardDispatch = useDashboardDispatch();
    const [newRole, setNewRole] = useState("");
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameRole: "",
        role: ""
    });
    const handleAddModalToggle = (value, role): void => {
        console.log(role);
        addModalData.role = role.id;
        addModalData.nameRole = role.name;

        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const loadRoles = (): void => {
        getRoles().then(res => {
            dashboardDispatch({
                type: SET_ROLES,
                payload: [...res.data.roles]
            });
        });
    };

    const handleEditModalDataChange = (prop, e): void => {
        console.log(e.currentTarget.value, "handleEditModalDataChange"); //kad krenem da kucam
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleEditRolestSubmit = (e): void => {
        e.preventDefault();
        const { nameRole, role } = addModalData;
        setTableDataLoading(true);
        saveRole({
            name: nameRole,
            id: role
        }).then(res => {
            res;
            console.log("submitted");
            loadRoles();
        });
        handleAddModalToggle(false, role);
    };
    useEffect(() => {
        if (!roles.length) {
            setTableDataLoading(true);
            loadRoles();
        } else {
            setTableDataLoading(false);
        }
    }, [roles]);

    const handleNewRoleChange = (e): void => {
        setNewRole(e.currentTarget.value);
        setInputErrors([]);
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleAddNewRole = (e): void => {
        e.preventDefault();

        const errors = [];

        if (!newRole) {
            errors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: t("general.role")
                })
            });
        }

        setInputErrors([...errors]);

        if (!errors.length) {
            saveRole({ name: newRole, id: undefined }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    toast(t("settings.newValueSuccessfullyAdded"));
                    setNewRole("");
                    loadRoles();
                }
            });
        }
    };

    const deletedeleteRoleItem = (role): void => {
        deleteRole({
            id: role.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("settings.deleteRole"));
                loadRoles();
            }
        });
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="mb-4"
                headings={[t("general.type"), "", ""]}
                rows={[
                    ...roles.map((role: IDefaultProps) => [
                        role.name,
                        <div key={1} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    role
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,

                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deletedeleteRoleItem.bind(this, role)}
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
                        {t("settings.editRole")}
                    </h3>
                    <form onSubmit={handleEditRolestSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameRole}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameRole"
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
                <form onSubmit={handleAddNewRole}>
                    <div className="flex flex-row justify-end">
                        <div className="mr-4">
                            <InputField
                                label={t("general.role")}
                                value={newRole}
                                className="mb-6"
                                onChange={handleNewRoleChange}
                                error={fieldError("name")}
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
