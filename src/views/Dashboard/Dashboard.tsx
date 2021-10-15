import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Routes from "routes";
import { Sidebar } from "components";
import {
    Administration,
    Inspection,
    Settings,
    Whitelist,
    TimeAndAttendence,
    Accounting,
    Incaso,
    Reporting,
    Warnings,
    ClientDashboard,
    ClientWhitelist,
    DeletedTickets
} from "views";
import {
    useDashboardDispatch,
    SET_CAR_COLORS,
    DashboardProvider,
    SET_CAR_BRANDS
} from "context";
import { getCarColors, getCarBrands } from "services";
import { YellowCard } from "../YellowCard/YellowCard";
import { RedCard } from "../YellowCard/RedCard";
const Dashboard = (): JSX.Element => {
    const [sidebarOpened, setSidebarOpened] = useState(true);
    const dashboardDispatch = useDashboardDispatch();

    setSidebarOpened;
    useEffect(() => {
        getCarColors().then(res => {
            const { carColors } = res.data;

            dashboardDispatch({
                type: SET_CAR_COLORS,
                payload: [...carColors]
            });
        });

        getCarBrands().then(res => {
            const { carBrands } = res.data;

            dashboardDispatch({
                type: SET_CAR_BRANDS,
                payload: [...carBrands]
            });
        });
    }, []);

    return (
        <div className="dashboard flex flex-row h-screen overflow-auto">
            <Sidebar opened={sidebarOpened} />
            <main className="dashboard__main overflow-auto h-screen px-4 py-4 flex-1">
                <Switch>
                    <Route
                        path={Routes.dashboard.administration.path}
                        component={Administration}
                    />
                    <Route
                        path={Routes.dashboard.inspection}
                        component={Inspection}
                    />
                    <Route
                        path={Routes.dashboard.deletedTickets}
                        component={DeletedTickets}
                    />
                    <Route
                        path={Routes.dashboard.yellowcard}
                        component={YellowCard}
                    />

                    <Route
                        path={Routes.dashboard.redcard}
                        component={RedCard}
                    />
                    <Route
                        path={Routes.dashboard.clientDashboard}
                        component={ClientDashboard}
                    />
                    <Route
                        path={Routes.dashboard.clientWhitelist}
                        component={ClientWhitelist}
                    />
                    <Route
                        path={Routes.dashboard.settings}
                        component={Settings}
                    />
                    <Route
                        path={Routes.dashboard.whitelist}
                        component={Whitelist}
                    />
                    <Route
                        path={Routes.dashboard.timeAndAttendance}
                        component={TimeAndAttendence}
                    />
                    <Route path={Routes.dashboard.incaso} component={Incaso} />
                    <Route
                        path={Routes.dashboard.warnings}
                        component={Warnings}
                    />
                    <Route
                        path={Routes.dashboard.reporting}
                        component={Reporting}
                    />
                    <Route
                        path={Routes.dashboard.accounting}
                        component={Accounting}
                    />
                    <Redirect to={Routes.dashboard.path} />
                </Switch>
            </main>
        </div>
    );
};

export const DashboardWithContext = (): JSX.Element => (
    <DashboardProvider>
        <Dashboard />
    </DashboardProvider>
);
