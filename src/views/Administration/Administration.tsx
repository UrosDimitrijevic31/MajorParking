import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Routes from "routes";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    UsersTable,
    VehiclesTable,
    Tabs,
    Tab,
    EmployeesTable,
    ClientLocations,
    ClientsTable,
    IncassoTable,
    Locations,
    FranchisesTable
} from "components";
import { AddEmployee } from "views";

export const Administration = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <section className="administration w-full">
            <header>
                <h2 className="heading heading--main">
                    {t("administration.label")}
                </h2>
            </header>
            <div className="administration__content flex flex-wrap flex-row w-full">
                <Switch>
                    <Route exact path={Routes.dashboard.administration.path}>
                        <section className="administration__tabs w-full">
                            <Tabs>
                                <Tab title={t("client.franchises")}>
                                    <FranchisesTable />
                                </Tab>
                                <Tab title={t("client.plural")}>
                                    <h4 className="card__header">
                                        {t("administration.clientsDescription")}
                                    </h4>

                                    <ClientsTable />
                                </Tab>
                                <Tab title={t("general.locations")}>
                                    <h4 className="card__header">
                                        {t("general.locationsDescription")}
                                    </h4>

                                    <Locations />
                                </Tab>
                                <Tab title={t("user.plural")}>
                                    <h4 className="card__header">
                                        {t("administration.usersDescription")}
                                    </h4>

                                    <UsersTable />
                                    {/* <NavLink
                                        className="btn btn--primary py-2 px-6 mt-4 inline-block"
                                        to={
                                            Routes.dashboard.administration.user
                                                .add
                                        }
                                    >
                                        {t("user.addUser")}
                                    </NavLink> */}
                                </Tab>
                                <Tab title={t("employee.plural")}>
                                    <h4 className="card__header">
                                        {t(
                                            "administration.employeesDescription"
                                        )}
                                    </h4>
                                    <EmployeesTable />
                                    {/* <NavLink
                                        className="btn btn--primary py-2 px-6 mt-4 inline-block"
                                        to={
                                            Routes.dashboard.administration
                                                .employee.add
                                        }
                                    >
                                        {t("employee.addEmployee")}
                                    </NavLink> */}
                                </Tab>
                                <Tab title={t("vehicles.plural")}>
                                    <h4 className="card__header">
                                        {t("vehicles.plural")}
                                    </h4>
                                    <VehiclesTable />
                                </Tab>
                                <Tab title={t("incasso.label")}>
                                    <h4 className="card__header">
                                        {t("incasso.label")}
                                    </h4>
                                    <IncassoTable />
                                </Tab>
                            </Tabs>
                        </section>
                    </Route>

                    <Route
                        path={Routes.dashboard.administration.employee.add}
                        component={AddEmployee}
                    />

                    <Route
                        path={Routes.dashboard.administration.employee.edit}
                        component={AddEmployee}
                    />

                    <Route
                        path={Routes.dashboard.administration.client.locations}
                        component={ClientLocations}
                    />

                    {/* <Route
                        path={
                            Routes.dashboard.administration.client.addLocations
                        }
                        component={AddLocation}
                    /> */}
                    {/* <Route
                        path={Routes.dashboard.administration.client.edit}
                        component={AddLocation}
                    /> */}

                    <Redirect to={Routes.dashboard.administration.path} />
                </Switch>
            </div>
        </section>
    );
};
