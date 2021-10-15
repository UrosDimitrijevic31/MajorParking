import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import Routes from "routes";
import {
    getParkings,
    getIncassoParkingLocations,
    getInspectionItems,
    deleteParking,
    deleteParkingInspectionItem,
    getIncassoProfiles,
    saveIncassoProfile,
    getIncassoUsers,
    getRoles,
    saveIncassoUser,
    deleteInkasso,
    deleteInkassoUser
} from "services";
import { Button, Table, Modal, InputField, Select, Loading } from "components";
import {
    IParking,
    IFranchise,
    IInputError,
    ISelectOption,
    IIncassoProfiles,
    IIncassoParkingLocations,
    IIncassoUsers
} from "types";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_INCASSO_PARKING_LOCATIONS,
    SET_INSPECTION_ITEMS,
    SET_INCASSO_PROFILES,
    SET_INCASSO_USERS,
    SET_ROLES
} from "context";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { stringify } from "querystring";

const inputClass = "flex-1 mx-2 min-w-1/4 mb-6";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";
interface IAddIncassoForm {
    name: string;
    email: string;
}

const defaultModalData = {
    id: undefined,
    name: "",
    email: ""
    // active: false
};

const addItemFormData = {
    id: undefined,
    parkingName: "",
    client: null
};

const addItemFormUsersData = {
    id: undefined,
    roleName: null,
    password: "",
    userName: ""
};

const fieldCssClass = "mx-2 mb-4";

export const IncassoTable = (): JSX.Element => {
    const { t } = useTranslation();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [modalsVisibility, setModalsVisibility] = useState({
        addIncassoProfile: false,
        incassoParkingLocation: false,
        incassoViewUsersModal: false,
        addInspectionItemModal: false,
        currentLocation: null,
        currentIncassoId: ""
    });
    const { parkingInspectionItems, inspectionItems } = useDashboardState();
    // const { clientId } = useParams(); ovo treba
    const clientId = "3eb0d2358f1ae917x-66e3dfc1x1722ccea39fx-654b";
    const [client, setClient] = useState<IFranchise>();
    const [locations, setLocations] = useState<IParking[]>([]);
    const { incassoProfiles } = useDashboardState();
    const { incassoUsers } = useDashboardState();
    const { roles } = useDashboardState();
    const { incassoParkingLocations } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [modalData, setModalData] = useState({
        ...defaultModalData
    });
    const [modalInspData, setInspModalData] = useState({
        ...addItemFormData
    });
    const [modalUserData, setUserModalData] = useState({
        ...addItemFormUsersData
    });
    const loadIncassoProfiles = (): void => {
        setTableDataLoading(true);
        getIncassoProfiles().then(res => {
            dashboardDispatch({
                type: SET_INCASSO_PROFILES,
                payload: [...res.data.inkasso]
            });
            setTableDataLoading(false);
        });
    };
    const loadRoles = (): void => {
        setTableDataLoading(true);
        getRoles().then(res => {
            dashboardDispatch({
                type: SET_ROLES,
                payload: [...res.data]
            });
            setTableDataLoading(false);
        });
    };

    useEffect(() => {
        if (!incassoProfiles.length) {
            loadIncassoProfiles();
        }
        if (!roles.length) {
            getRoles().then(res => {
                const { roles } = res.data;
                dashboardDispatch({
                    type: SET_ROLES,
                    payload: [...roles]
                });
            });
        }
    }, []);

    const handleModalLocationsToggle = (modal, value, location): void => {
        if (value) {
            modalsVisibility.currentLocation = location;

            getIncassoParkingLocations(location.id).then(res => {
                const incassoParkingLocations = res.data.parkings;
                dashboardDispatch({
                    type: SET_INCASSO_PARKING_LOCATIONS,
                    payload: incassoParkingLocations
                });
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const handleModalUsersToggle = (modal, value, user): void => {
        console.log("kad se otvori user modal");
        modalsVisibility.currentIncassoId = user.id;
        console.log(modalsVisibility.currentIncassoId, "inkasso id");
        if (value) {
            modalsVisibility.incassoViewUsersModal = user;
            getIncassoUsers(user.id).then(res => {
                const incassoUsers = res.data.users;
                dashboardDispatch({
                    type: SET_INCASSO_USERS,
                    payload: incassoUsers
                });
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const handleAddModalUserToggle = (modal, value, item): void => {
        if (value) {
            if (item) {
                modalUserData.id = item.id;
                modalUserData.userName = item.userName;
                modalUserData.roleName = {
                    value: item.role.id,
                    label: item.role.name
                };
                console.log(modalUserData);
            } else {
                modalUserData.id = undefined;
                modalUserData.userName = "";
                modalUserData.password = "";
                modalUserData.roleName = "";
                // modalUserData.inkasso = null;
            }
            console.log(
                modalsVisibility.currentIncassoId,
                "inkasso id u handleAddModalUserToggle"
            );

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

    const handleModalItemChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setInspModalData({
            ...modalInspData,
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

    //editovanje i dodavanje incasso elementa
    const handleAddModalToggle = (modal, value, incassoProfile): void => {
        if (value) {
            if (incassoProfile) {
                modalData.id = incassoProfile.id;
                modalData.name = incassoProfile.name;
                modalData.email = incassoProfile.email;
            } else {
                modalData.id = undefined;
                modalData.name = "";
                modalData.email = "";
            }

            setModalData({
                ...modalData
            });
        }
        setModalsVisibility({
            ...modalsVisibility,
            [modal]: value ? value : !modalsVisibility[modal]
        });
    };

    const fieldError = (fieldName): string =>
        inputErrors?.find(err => err.fieldName === fieldName)?.error;

    const handleModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setModalData({
            ...modalData,
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

    const isFormValid = (): boolean => {
        const validationErrors = [];

        if (!modalData.name) {
            validationErrors.push({
                fieldName: "name",
                error: t("general.isRequired", {
                    value: t("general.name")
                })
            });
        }

        setInputErrors([...validationErrors]);
        console.log(validationErrors, "this is validation errors");
        return !validationErrors.length;
    };

    const isFormAddUserValid = (): boolean => {
        const validationErrors = [];

        Object.keys(modalUserData).map(k => {
            if (
                k === "id" ||
                k === "inkasso" ||
                k === "client" ||
                k === "roleName"
            ) {
                return;
            }
            if (!modalUserData[k]) {
                validationErrors.push({
                    fieldName: k,
                    error: t("general.isRequired", {
                        value: t("general.field")
                    })
                });
            }
        });

        setInputErrors([...validationErrors]);
        console.log(validationErrors, "this is validation errors");
        return !validationErrors.length;
    };

    const handleAddIncassoProfileSubmit = (e): void => {
        e.preventDefault();
        const { id, email, name } = modalData;
        setTableDataLoading(true);
        if (isFormValid()) {
            saveIncassoProfile({
                id,
                name,
                email
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    modalData.id === undefined
                        ? toast(t("incasso.inkassoAdded"))
                        : toast(t("incasso.inkassoUpdate"));
                    loadIncassoProfiles();
                    console.log("submited");
                    const modal = "addIncassoProfile";
                    const value = false;
                    setModalsVisibility({
                        ...modalsVisibility,
                        [modal]: value ? value : !modalsVisibility[modal]
                    });
                }
            });
        }
    };
    const handleAddUserSubmit = (e): void => {
        e.preventDefault();
        console.log(
            modalsVisibility.currentIncassoId,
            "inkasso id u addUser Submit"
        );
        if (isFormAddUserValid()) {
            saveIncassoUser({
                id: modalUserData.id,
                userName: modalUserData.userName,
                password: modalUserData.password,
                roleId: modalUserData.roleName?.value,
                inkassoId: modalsVisibility.currentIncassoId
            }).then(res => {
                if (res.data.result === "error") {
                    toast.error(res.data.reason);
                } else {
                    modalUserData.id === undefined
                        ? toast(t("user.added"))
                        : toast(t("user.updated"));
                    getIncassoUsers(modalsVisibility.currentIncassoId).then(
                        res => {
                            const incassoUsers = res.data.users;
                            dashboardDispatch({
                                type: SET_INCASSO_USERS,
                                payload: incassoUsers
                            });
                        }
                    );

                    const modal = "addInspectionItemModal";
                    const value = false;
                    setModalsVisibility({
                        ...modalsVisibility,
                        [modal]: value ? value : !modalsVisibility[modal]
                    });
                }
            });
        }
    };
    const deleteInkassoProfile = (inkasso): void => {
        deleteInkasso({
            id: inkasso.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deletedInkasso"));
                loadIncassoProfiles();
            }
        });
    };
    const deleteUserItem = (item): void => {
        deleteInkassoUser({
            id: item.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deletedUser"));
                getIncassoUsers(modalsVisibility.currentIncassoId).then(res => {
                    const incassoUsers = res.data.users;
                    dashboardDispatch({
                        type: SET_INCASSO_USERS,
                        payload: incassoUsers
                    });
                });
            }
        });
    };

    const [sortedData, setSortedData] = useState({
        key: "",
        asc: false
    });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
    const onSort = (i): void => {
        let sortedArray = [];
        let sortAsc = true;
        console.log(i);
        console.log(sortedData.key);
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
        sortedData.key = i;

        //setuj key koji je sortiran i da li je asc ili desc
        const tmp = { key: i, asc: sortAsc };
        setSortedData({ ...tmp });
        console.log(sortedData);

        if (sortAsc) {
            sortedArray = sort_asc_by_key(incassoProfiles, i);
        } else {
            sortedArray = sort_desc_by_key(incassoProfiles, i);
        }
        console.log(sortedArray, "Sortirano");
        dashboardDispatch({
            type: SET_INCASSO_PROFILES,
            payload: [...sortedArray]
        });
    };

    return (
        <section className="client-locations card w-full">
            <div className="client-locations__content header__pointer">
                <Loading isLoading={tableDataLoading}>
                    <Table
                        headings={[t("general.name"), t("general.email")]}
                        keys={["name", "email"]}
                        clicked={onSort}
                        rows={[
                            ...incassoProfiles.map((l: IIncassoProfiles) => [
                                l.name,
                                l.email,
                                <div key={1} className="text-right">
                                    <button
                                        onClick={handleModalUsersToggle.bind(
                                            this,
                                            "incassoViewUsersModal",
                                            true,
                                            l
                                        )}
                                        className={buttonLinkStyle}
                                    >
                                        {t("user.view")}
                                    </button>
                                </div>,
                                <div key={1} className="text-right">
                                    <button
                                        onClick={handleModalLocationsToggle.bind(
                                            this,
                                            "incassoParkingLocation",
                                            true,
                                            l
                                        )}
                                        className={buttonLinkStyle}
                                    >
                                        {t("client.viewLocations")}
                                    </button>
                                </div>,
                                <div key={1} className="text-right">
                                    <button
                                        onClick={handleAddModalToggle.bind(
                                            this,
                                            "addIncassoProfile",
                                            true,
                                            l
                                        )}
                                        className={buttonLinkStyle}
                                    >
                                        {t("general.edit")}
                                    </button>
                                </div>,
                                <div key={1} className="text-right">
                                    <button
                                        key={1}
                                        className={buttonLinkStyle}
                                        onClick={deleteInkassoProfile.bind(
                                            this,
                                            l
                                        )}
                                    >
                                        {t("general.delete")}
                                    </button>
                                </div>
                            ])
                        ]}
                    />
                    <Button
                        onClick={handleAddModalToggle.bind(
                            this,
                            "addIncassoProfile",
                            true,
                            null
                        )}
                        className="btn btn--primary py-2 px-6 mt-4 inline-block"
                    >
                        {t("general.add")}
                    </Button>
                </Loading>
            </div>

            {/* MODAL ZA DODAVANJE I EDITOVANJE INKASSO ITEMA */}
            <Modal
                visible={modalsVisibility.addIncassoProfile}
                onClose={handleAddModalToggle.bind(
                    this,
                    "addIncassoProfile",
                    false
                )}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-6">
                        {t("general.add")}
                    </h3>
                    <form onSubmit={handleAddIncassoProfileSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                value={modalData.email}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "email"
                                )}
                                className={inputClass}
                                label={t("general.email")}
                                error={fieldError("email")}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <InputField
                                value={modalData.name}
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "name"
                                )}
                                className={inputClass}
                                label={t("general.name")}
                                error={fieldError("name")}
                            />
                        </div>
                        <div className="text-center">
                            <Button
                                type="submit"
                                color="success"
                                className="mr-4"
                            >
                                {t("general.save")}
                            </Button>
                            <Button
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    "addIncassoProfile",
                                    false
                                )}
                                color="danger"
                                type="button"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* MODAL ZA PRIKAZIVANJE LOKACIJE ZA INKASSO ITEM */}
            <Modal
                visible={modalsVisibility.incassoParkingLocation}
                onClose={handleModalLocationsToggle.bind(
                    this,
                    "incassoParkingLocation",
                    false
                )}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("general.locations")}
                </h3>
                <Table
                    className="mb-4"
                    headings={[t("settings.parkingName"), t("client.name")]}
                    rows={[
                        ...incassoParkingLocations.map(
                            (item: IIncassoParkingLocations) => [
                                item.name,
                                item.client.name
                                // <div key={1} className="text-right">
                                //     <button
                                //         className={buttonLinkStyle}
                                //         onClick={handleAddModalUserToggle.bind(
                                //             this,
                                //             "addInspectionItemModal",
                                //             true,
                                //             item
                                //         )}
                                //     >
                                //         {t("general.edit")}
                                //     </button>
                                // </div>,
                                // <div key={2} className="text-right">
                                //     <button
                                //         key={1}
                                //         className={buttonLinkStyle}
                                //         onClick={deleteParkingInspectionItemS.bind(
                                //             this,
                                //             item
                                //         )}
                                //     >
                                //         {t("general.delete")}
                                //     </button>
                                // </div>
                            ]
                        )
                    ]}
                />
                <form action="">
                    <div className="text-center">
                        {/* <Button
                            onClick={handleAddModalUserToggle.bind(
                                this,
                                "addInspectionItemModal",
                                true,
                                null
                            )}
                            className="mr-4"
                            type="button"
                            color="success"
                        >
                            {t("general.add")}
                        </Button> */}
                        <Button
                            onClick={handleModalLocationsToggle.bind(
                                this,
                                "incassoParkingLocation",
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
            {/* MODAL ZA PRIKAZIVANJE USERA ZA INKASSO ITEM */}
            <Modal
                visible={modalsVisibility.incassoViewUsersModal}
                onClose={handleModalLocationsToggle.bind(
                    this,
                    "incassoViewUsersModal",
                    false
                )}
            >
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("user.plural")}
                </h3>
                <Table
                    className="mb-4"
                    headings={[t("general.username"), t("general.role")]}
                    rows={[
                        ...incassoUsers.map((item: IIncassoUsers) => [
                            item.userName,
                            item.roleName,
                            <div key={1} className="text-right">
                                <button
                                    className={buttonLinkStyle}
                                    onClick={handleAddModalUserToggle.bind(
                                        this,
                                        "addInspectionItemModal",
                                        true,
                                        item
                                    )}
                                >
                                    {t("general.edit")}
                                </button>
                            </div>,
                            <div key={2} className="text-right">
                                <button
                                    key={1}
                                    className={buttonLinkStyle}
                                    onClick={deleteUserItem.bind(this, item)}
                                >
                                    {t("general.delete")}
                                </button>
                            </div>
                        ])
                    ]}
                />
                <form action="">
                    <div className="text-center">
                        <Button
                            onClick={handleAddModalUserToggle.bind(
                                this,
                                "addInspectionItemModal",
                                true,
                                null
                            )}
                            className="mr-4"
                            type="button"
                            color="success"
                        >
                            {t("general.add")}
                        </Button>
                        <Button
                            onClick={handleModalLocationsToggle.bind(
                                this,
                                "incassoViewUsersModal",
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

            {/* MODAL ZA DODAVANJE I EDITOVANJE USERA */}
            <Modal
                visible={modalsVisibility.addInspectionItemModal}
                onClose={handleAddModalUserToggle.bind(
                    this,
                    "addInspectionItemModal",
                    false,
                    null
                )}
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
                            value={modalUserData.password}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "password"
                            )}
                            className={inputClass}
                            label={t("general.password")}
                            error={fieldError("password")}
                        />
                    </div>
                    {/* <div className={inputClass}>
                        <Select
                            value={modalUserData.roleName}
                            onChange={handleModalUserDataChange.bind(
                                this,
                                "roleName"
                            )}
                            label={t("general.role")}
                            options={roles.map(v => ({
                                label: `${v.name}`,
                                value: v.id
                            }))}
                            isClearable={true}
                            error={fieldError("roles")}
                        />
                    </div> */}
                    <div className="text-center">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button
                            onClick={handleAddModalUserToggle.bind(
                                this,
                                "addInspectionItemModal",
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
        </section>
    );
};
