import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Routes from "routes";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Select, Loading } from "components";
import {
    getIncassoProfiles,
    getClients,
    getRoles,
    getUsers,
    saveIncassoUser,
    deleteUser
} from "services";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_USERS,
    SET_ROLES
} from "context";
import { toast } from "react-toastify";
import { IInputError } from "types";

// const users = [
//     {
//         userId: 0,
//         email: "user@email.com",
//         name: "Marko Markovic",
//         role: "admin"
//     },
//     {
//         userId: 1,
//         email: "user@email.com",
//         name: "Stefan Stefanovic",
//         role: "admin"
//     },
//     {
//         userId: 2,
//         email: "user@email.com",
//         name: "Mirko Mirkovic",
//         role: "editor"
//     }
// ];

export const UsersTable = (): JSX.Element => {
    const { t } = useTranslation();
    const { users } = useDashboardState();

    const [tmpUsers, setTmpUsers] = useState();
    const [tmpRoles, setTmpRoles] = useState([]);
    const [tmpClients, setTmpClients] = useState([]);
    const [tmpInkasso, setTmpInkasso] = useState([]);

    const [modalsVisibility, setModalsVisibility] = useState({
        addUser: false,
        clientUser: false,
        inkassoUser: false,
        deleteUser: false
    });
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [modalUserData, setUserModalData] = useState({
        visible: false,
        id: "",
        userName: "",
        pwd: "",
        inkasso: null,
        role: null,
        client: null
    });
    const [modalDeleteData, setModalDeleteData] = useState({
        id: "",
        username: ""
    });
    const fieldCssClass = "mx-2 mb-4";
    const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
    const buttonLinkStyle =
        "text-right underline hover:text-orange-treePoppy lowercase font-thin";
    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;
    const loadUsers = (): void => {
        setTableDataLoading(true);
        getUsers().then(res => {
            setTmpUsers(res.data.users);

            dashboardDispatch({
                type: SET_USERS,
                payload: [...res.data.users]
            });

            setTableDataLoading(false);
        });
    };
    useEffect(() => {
        loadUsers();
    }, [setTmpUsers]);

    const loadRoles = (): void => {
        getRoles().then(res => {
            //setTmpRoles(res.data.roles);
            const rls = res.data.roles;
            setTmpRoles([
                ...rls.map(b => ({
                    label: b?.name,
                    value: b?.id
                }))
            ]);
        });
    };

    useEffect(() => {
        loadRoles();
    }, [setTmpRoles]);

    const loadClients = (): void => {
        getClients().then(res => {
            const rls = res.data.clients;
            console.log(rls, "clients");
            setTmpClients([
                ...rls.map(b => ({
                    label: b?.name,
                    value: b?.id
                }))
            ]);
        });
    };

    useEffect(() => {
        loadClients();
    }, [setTmpClients]);

    const loadInkasso = (): void => {
        getIncassoProfiles().then(res => {
            const rls = res.data.inkasso;
            console.log(rls, "inkasso");
            setTmpInkasso([
                ...rls.map(b => ({
                    label: b?.name,
                    value: b?.id
                }))
            ]);
        });
    };
    useEffect(() => {
        loadInkasso();
    }, [setTmpInkasso]);

    const showDeleteModal = (modal, value, item): void => {
        modalDeleteData.id = item.id;
        modalDeleteData.username = item.userName;
        setModalDeleteData({
            ...modalDeleteData
        });
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const removeUser = (): void => {
        // modalDeleteData.id = item.id;
        // modalDeleteData.username = item.userName;
        // setModalDeleteData({
        //     ...modalDeleteData
        // });
        // setModalsVisibility({
        //     ...modalsVisibility,
        //     [modal]: value ? value : !modalsVisibility[modal]
        // });
        deleteUser({
            id: modalDeleteData.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                loadUsers();
                const value = false;
                const modal = "deleteUser";
                setModalsVisibility({
                    ...modalsVisibility,
                    [modal]: value ? value : !modalsVisibility[modal]
                });
            }
        });
    };

    const showUserModal = (modal, value, item): void => {
        if (value) {
            modalUserData.client = {};
            modalUserData.inkasso = {};
            if (item) {
                modalUserData.id = item.id;
                modalUserData.userName = item.userName;
                modalUserData.pwd = "";
                modalUserData.role = {
                    value: item.role.id,
                    label: item.role.name
                };
                if (item.client) {
                    modal = "clientUser";
                    modalUserData.client = {
                        value: item.client.id,
                        label: item.client.name
                    };
                }
                if (item.inkasso) {
                    modal = "inkassoUser";
                    modalUserData.inkasso = {
                        value: item.inkasso.id,
                        label: item.inkasso.name
                    };
                }
                console.log(modalUserData, "User");
            } else {
                modalUserData.id = undefined;
                modalUserData.userName = "";
                modalUserData.pwd = "";
                modalUserData.role = {};
                modalUserData.inkasso = null;
                modalUserData.client = null;
                // modalUserData.inkasso = null;
            }

            setUserModalData({
                ...modalUserData
            });
            // });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };
    const handleModalUserDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;
        console.log(value, "ovo je value");
        setUserModalData({
            ...modalUserData,
            [prop]: value
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
    const handleAddUserSubmit = (e): void => {
        e.preventDefault();

        if (true) {
            console.log(modalUserData, " Userdata");
            saveIncassoUser({
                id: modalUserData.id,
                userName: modalUserData.userName,
                password: modalUserData.pwd,
                roleId: modalUserData.role?.value,
                inkassoId: modalUserData.inkasso?.value,
                clientId: modalUserData.client?.value
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    modalUserData.id === undefined
                        ? toast(t("user.added"))
                        : toast(t("user.updated"));
                    loadUsers();

                    const value = false;
                    if (modalsVisibility.addUser) {
                        const modal = "addUser";
                        setModalsVisibility({
                            ...modalsVisibility,
                            [modal]: value ? value : !modalsVisibility[modal]
                        });
                    }

                    if (modalsVisibility.clientUser) {
                        let modal = "addUser";
                        modal = "clientUser";
                        setModalsVisibility({
                            ...modalsVisibility,
                            [modal]: value ? value : !modalsVisibility[modal]
                        });
                    }

                    if (modalsVisibility.inkassoUser) {
                        let modal = "addUser";
                        modal = "inkassoUser";
                        setModalsVisibility({
                            ...modalsVisibility,
                            [modal]: value ? value : !modalsVisibility[modal]
                        });
                    }
                }
            });
        }
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
            sortedArray = sort_asc_by_key(users, i);
        } else {
            sortedArray = sort_desc_by_key(users, i);
        }
    };
    return (
        <section>
            <Table
                className="header__pointer"
                headings={[
                    t("incasso.label"),
                    t("client.label"),
                    t("general.username"),
                    t("general.role"),
                    "",
                    ""
                ]}
                keys={["inkassoName", "clientName", "userName", "roleName"]}
                clicked={onSort}
                rows={[
                    ...users.map(user => [
                        user.inkassoName,
                        user.clientName,
                        user.userName,
                        user.roleName,
                        <button
                            key={3}
                            className={buttonLinkStyle}
                            onClick={showUserModal.bind(
                                this,
                                "addUser",
                                true,
                                user
                            )}
                        >
                            {t("general.edit")}
                        </button>,
                        <button
                            key={3}
                            className={buttonLinkStyle}
                            onClick={showDeleteModal.bind(
                                this,
                                "deleteUser",
                                true,
                                user
                            )}
                        >
                            {t("general.delete")}
                        </button>
                    ])
                ]}
            />
            <Button
                type="button"
                className="mr-4"
                onClick={showUserModal.bind(this, "addUser", true, null)}
            >
                {t("user.addUser")}
            </Button>
            <Button
                type="button"
                className="mr-4"
                onClick={showUserModal.bind(this, "clientUser", true, null)}
            >
                {t("user.addClientUser")}
            </Button>
            <Button
                type="button"
                className="mr-4"
                onClick={showUserModal.bind(this, "inkassoUser", true, null)}
            >
                {t("user.addInkassoUser")}
            </Button>
            <Modal
                visible={modalsVisibility.addUser}
                onClose={showUserModal.bind(this, "addUser", false, null)}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("user.addUser")}
                </h3>
                <form onSubmit={handleAddUserSubmit}>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.userName}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "userName"
                            )}
                            className={inputClass}
                            label={t("general.username")}
                            error={fieldError("userName")}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.pwd}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "pwd"
                            )}
                            className={inputClass}
                            label={t("general.password")}
                            error={fieldError("password")}
                        />
                    </div>
                    <div className={inputClass}>
                        <Select
                            value={modalUserData.role}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "role"
                            )}
                            label={t("general.role")}
                            options={tmpRoles}
                            isClearable={true}
                            error={fieldError("roles")}
                        />
                    </div>
                    <div className="text-center">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button
                            onClick={showUserModal.bind(this, "addUser", false)}
                            color="danger"
                            type="button"
                        >
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                visible={modalsVisibility.clientUser}
                onClose={showUserModal.bind(this, "clientUser", false, null)}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("user.addUser")}
                </h3>
                <form onSubmit={handleAddUserSubmit}>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.userName}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "userName"
                            )}
                            className={inputClass}
                            label={t("general.username")}
                            error={fieldError("userName")}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.pwd}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "pwd"
                            )}
                            className={inputClass}
                            label={t("general.password")}
                            error={fieldError("password")}
                        />
                    </div>
                    <div className={inputClass}>
                        <Select
                            value={modalUserData.client}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "client"
                            )}
                            label={t("client.label")}
                            options={tmpClients}
                            isClearable={true}
                            error={fieldError("clients")}
                        />
                    </div>
                    <div className="text-center">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button
                            onClick={showUserModal.bind(
                                this,
                                "clientUser",
                                false
                            )}
                            color="danger"
                            type="button"
                        >
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                visible={modalsVisibility.inkassoUser}
                onClose={showUserModal.bind(this, "inkassoUser", false, null)}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("user.addUser")}
                </h3>
                <form onSubmit={handleAddUserSubmit}>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.userName}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "userName"
                            )}
                            className={inputClass}
                            label={t("general.username")}
                            error={fieldError("userName")}
                        />
                    </div>
                    <div className={fieldCssClass}>
                        <InputField
                            value={modalUserData.pwd}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "pwd"
                            )}
                            className={inputClass}
                            label={t("general.password")}
                            error={fieldError("password")}
                        />
                    </div>
                    <div className={inputClass}>
                        <Select
                            value={modalUserData.inkasso}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "inkasso"
                            )}
                            label={t("incasso.label")}
                            options={tmpInkasso}
                            isClearable={true}
                            error={fieldError("inkasso")}
                        />
                    </div>
                    <div className="text-center">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button
                            onClick={showUserModal.bind(
                                this,
                                "inkassoUser",
                                false
                            )}
                            color="danger"
                            type="button"
                        >
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </Modal>
            <Modal
                visible={modalsVisibility.deleteUser}
                onClose={showDeleteModal.bind(this, "deleteUser", false, null)}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("general.deleteUserPrompt")}: {modalDeleteData.username}
                </h3>
                <form>
                    <div className="text-center">
                        <Button
                            type="button"
                            color="success"
                            className="mr-4"
                            onClick={removeUser.bind(this)}
                        >
                            {t("general.yes")}
                        </Button>
                        <Button
                            onClick={showDeleteModal.bind(
                                this,
                                "deleteUser",
                                false
                            )}
                            color="danger"
                            type="button"
                        >
                            {t("general.no")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </section>
    );
};
