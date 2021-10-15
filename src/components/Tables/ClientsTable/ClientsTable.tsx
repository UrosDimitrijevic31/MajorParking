import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Routes from "routes";
import { useTranslation } from "react-i18next";
import {
    Table,
    Loading,
    Button,
    InputField,
    Modal,
    Select,
    formatOptions,
    Checkbox
} from "components";
import { saveClient, getClients, getFranchises, deleteClient } from "services";
import { IClient } from "types";
import { IFranchise } from "types";
import {
    useDashboardState,
    useDashboardDispatch,
    SET_CLIENTS,
    SET_FRANCHISES
} from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

export const ClientsTable = (): JSX.Element => {
    const { t } = useTranslation();
    const { clients } = useDashboardState();
    const { franchises } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    // const [inputErrors, setInputErrors] = useState<IInputError[]>([]);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        nameClient: "",
        idClient: "",
        franchise: null,
        whitelistLimit: 0,
        whitelistUnlimited: false
    });

    const loadClients = (): void => {
        setTableDataLoading(true);
        getClients().then(res => {
            dashboardDispatch({
                type: SET_CLIENTS,
                payload: res.data.clients
            });

            setTableDataLoading(false);
        });
    };

    useEffect(() => {
        if (!clients.length) {
            loadClients();
        }
    }, []);

    useEffect(() => {
        if (!franchises.length) {
            getFranchises().then(res => {
                const franchises = res.data.franchise as IFranchise[];

                dashboardDispatch({
                    type: SET_FRANCHISES,
                    payload: franchises
                });
            });
        }
    }, []);

    const handleAddModalToggle = (value, client): void => {
        console.log(client, "klijent id");
        if (client) {
            addModalData.idClient = client.id;
            addModalData.nameClient = client.name;
            addModalData.whitelistLimit = client.whitelistLimit;
            addModalData.whitelistUnlimited = client.whitelistUnlimited;
            if (client.franchise) {
                addModalData.franchise = {
                    value: client.franchise.id,
                    label: client.franchise.name
                };
            }
        } else {
            addModalData.idClient = undefined;
            addModalData.nameClient = "";
            addModalData.franchise = null;
            addModalData.whitelistLimit = 0;
            addModalData.whitelistUnlimited = false;
        }
        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleEditModalDataChange = (prop, e): void => {
        let value;
        if (e != undefined) {
            value = e.currentTarget ? e.currentTarget.value : e;
        } else {
            value = "";
        }
        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleEditClientSubmit = (e): void => {
        e.preventDefault();
        const {
            nameClient,
            idClient,
            franchise,
            whitelistLimit,
            whitelistUnlimited
        } = addModalData;

        saveClient({
            name: nameClient,
            id: idClient,
            franchiseId: franchise?.value,
            whitelistLimit: whitelistLimit,
            whitelistUnlimited: whitelistUnlimited
        }).then(res => {
            console.log(res);
            loadClients();
        });
        // addModalData.idClient = undefined;
        // addModalData.nameClient = "";
        // addModalData.franchise = null;
        handleAddModalToggle(false, null);
    };

    const deleteClientItem = (client): void => {
        console.log(client.id);
        deleteClient({
            id: client.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("client.deleteClient"));
                // setNewRole("");
                loadClients();
            }
            console.log("delete");
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
            sortedArray = sort_asc_by_key(clients, i);
        } else {
            sortedArray = sort_desc_by_key(clients, i);
        }
    };
    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                headings={[
                    t("client.franchise"),
                    t("general.name"),
                    t("client.numberOfLocations")
                ]}
                className={"header__pointer"}
                clicked={onSort}
                keys={["franchiseName", "name", "numberOfParkings"]}
                rows={[
                    ...clients.map((client: IClient) => [
                        client.franchiseName,
                        client.name,
                        client.numberOfParkings,
                        <div key={1} className="text-right">
                            <button
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    client
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,
                        <NavLink
                            key={4}
                            className="underline hover:text-seance text-right"
                            to={`${Routes.dashboard.administration.client.path}/${client.id}/locations`}
                        >
                            {t("client.viewLocations")}
                        </NavLink>,
                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteClientItem.bind(this, client)}
                            >
                                {t("general.delete")}
                            </button>
                        </div>
                    ])
                ]}
            />
            <Button
                onClick={handleAddModalToggle.bind(this, true, null)}
                className="btn btn--primary py-2 px-6 mt-4 inline-block"
            >
                {t("client.addClient")}
            </Button>
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false, null)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("client.addClient")}
                    </h3>
                    <form onSubmit={handleEditClientSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.nameClient}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "nameClient"
                                )}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Select
                                value={addModalData.franchise}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "franchise"
                                )}
                                label={t("client.franchise")}
                                options={formatOptions(franchises)}
                                isClearable={true}
                            />
                        </div>
                        <div className={fieldCssClass}>
                            <Checkbox
                                label={`${t("general.whitelistUnlimited")}`}
                                defaultChecked={addModalData.whitelistUnlimited}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "whitelistUnlimited",
                                    !addModalData.whitelistUnlimited
                                )}
                            />
                            <InputField
                                label={t("general.whitelistLimit")}
                                value={addModalData.whitelistLimit}
                                onChange={handleEditModalDataChange.bind(
                                    this,
                                    "whitelistLimit"
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
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    false,
                                    null
                                )}
                                color="danger"
                            >
                                {t("general.cancel")}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </Loading>
    );
};
