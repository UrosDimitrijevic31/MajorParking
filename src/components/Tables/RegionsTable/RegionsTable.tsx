import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Table, Modal, InputField, Loading } from "components";
import { getRegions, saveRegion, deleteRegion } from "services";
import { useDashboardState, useDashboardDispatch, SET_REGIONS } from "context";
import { toast } from "react-toastify";

const fieldCssClass = "mx-2 mb-4";
const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase font-thin";

interface IRegionsTableProps {
    enableAddNew?: boolean;
}

export const RegionsTable = ({}: IRegionsTableProps): JSX.Element => {
    const { t } = useTranslation();
    const { regions } = useDashboardState();
    const dashboardDispatch = useDashboardDispatch();
    const [tableDataLoading, setTableDataLoading] = useState(false);
    const [addModalData, setAddModalData] = useState({
        visible: false,
        regionName: "",
        regionID: undefined
    });
    const loadRegions = (): void => {
        setTableDataLoading(true);
        getRegions().then(res => {
            dashboardDispatch({
                type: SET_REGIONS,
                payload: [...res.data.regions]
            });
            setTableDataLoading(false);
        });
    };
    useEffect(() => {
        if (!regions.length) {
            loadRegions();
        }
    });

    const handleAddModalToggle = (value, region): void => {
        if (region) {
            addModalData.regionName = region.name;
            addModalData.regionID = region.id;
        } else {
            addModalData.regionName = "";
            addModalData.regionID = undefined;
        }
        setAddModalData({
            ...addModalData,
            visible: value ? value : !addModalData.visible
        });
    };

    const handleAddModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setAddModalData({
            ...addModalData,
            [prop]: value
        });
    };

    const handleAddRegionSubmit = (e): void => {
        e.preventDefault();
        const { regionName, regionID } = addModalData;
        setTableDataLoading(true);
        saveRegion({
            id: regionID,
            name: regionName
        }).then(res => {
            res;
            console.log("submitted");
            loadRegions();
        });
        handleAddModalToggle(false, null);
    };

    const deleteRegionItem = (vehicle): void => {
        deleteRegion({
            id: vehicle.id
        }).then(res => {
            if (res.data.result === "error") {
                toast.error(res.data.reason);
            } else {
                toast(t("general.deleteRegion"));
                loadRegions();
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
            sortedArray = sort_asc_by_key(regions, i);
        } else {
            sortedArray = sort_desc_by_key(regions, i);
        }
    };

    return (
        <Loading isLoading={tableDataLoading}>
            <Table
                className="header__pointer"
                headings={[t("general.name"), t(""), t("")]}
                clicked={onSort}
                keys={["name"]}
                rows={[
                    ...regions.map(regions => [
                        regions.name,
                        <div key={1} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={handleAddModalToggle.bind(
                                    this,
                                    true,
                                    regions
                                )}
                            >
                                {t("general.edit")}
                            </button>
                        </div>,

                        <div key={2} className="text-right">
                            <button
                                key={1}
                                className={buttonLinkStyle}
                                onClick={deleteRegionItem.bind(this, regions)}
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
                {t("general.addRegion")}
            </Button>
            <Modal
                visible={addModalData.visible}
                onClose={handleAddModalToggle.bind(this, false)}
            >
                <div className="whitelist__add-modal-content">
                    <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                        {t("general.addRegion")}
                    </h3>
                    <form onSubmit={handleAddRegionSubmit}>
                        <div className={fieldCssClass}>
                            <InputField
                                label={t("general.name")}
                                value={addModalData.regionName}
                                onChange={handleAddModalDataChange.bind(
                                    this,
                                    "regionName"
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
                                    null,
                                    false
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
