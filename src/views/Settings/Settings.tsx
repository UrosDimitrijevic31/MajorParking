import React from "react";
import { useTranslation } from "react-i18next";
import {
    Tabs,
    Tab,
    BrandsTable,
    ParkingTypesTable,
    ColorsTable,
    InspectionItemsTable,
    PaymentStatusTable,
    RolesTable,
    ProductsTable,
    RegionsTable
} from "components";

export const Settings = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <section className="settings">
            <header>
                <h2 className="heading heading--main">{t("settings.label")}</h2>
            </header>
            <div className="settings__content flex flex-wrap flex-row w-full">
                <Tabs headerColor="secondary" className="w-full">
                    <Tab title={`${t("car.label")} ${t("general.brand")}`}>
                        <h4 className="card__header capitalize">
                            {t("car.label")} {t("general.brand")}
                        </h4>
                        <div className="block lg:flex">
                            <div className="flex-1 pr-4 mb-4">
                                <BrandsTable enableAddNew={true} />
                            </div>
                        </div>
                    </Tab>
                    <Tab title={t("settings.parkingTypes")}>
                        <h4 className="card__header">
                            {t("settings.parkingTypes")}
                        </h4>
                        <ParkingTypesTable enableAddNew={true} />
                    </Tab>
                    <Tab title={`${t("car.label")} ${t("general.color")}`}>
                        <h4 className="card__header">
                            {`${t("car.label")} ${t("general.color")}`}
                        </h4>
                        <ColorsTable enableAddNew={true} />
                    </Tab>
                    <Tab title={t("settings.inspectionItems")}>
                        <h4 className="card__header">
                            {t("settings.inspectionItems")}
                        </h4>

                        <InspectionItemsTable enableAddNew={true} />
                    </Tab>
                    <Tab title={t("general.paymentStatus")}>
                        <h4 className="card__header">
                            {t("general.paymentStatus")}
                        </h4>

                        <PaymentStatusTable />
                    </Tab>
                    {/* <Tab title={t("settings.cooperateRoles")}>
                        <h4 className="card__header">
                            {t("settings.cooperateRoles")}
                        </h4>

                        <RolesTable enableAddNew={true} />
                    </Tab> */}
                    <Tab title={t("general.product")}>
                        <h4 className="card__header">{t("general.product")}</h4>

                        <ProductsTable enableAddNew={true} />
                    </Tab>
                    <Tab title={t("general.region")}>
                        <h4 className="card__header">{t("general.region")}</h4>

                        <RegionsTable enableAddNew={true} />
                    </Tab>
                </Tabs>
            </div>
        </section>
    );
};
