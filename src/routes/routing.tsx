import React, { useState, useEffect } from "react";
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect
} from "react-router-dom";

import Routes from "routes";
import { Login, DashboardWithContext } from "views";
import { Api } from "services";

interface IPrivateRouteProps {
    component: React.FC;
    path: string;
    exact?: boolean;
}

const PrivateRoute = ({
    component: Component,
    ...rest
}: IPrivateRouteProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(true);
        setIsLoading(false);
    }, []);

    const renderRoute = (props): JSX.Element => {
        return (
            <>
                {isLoggedIn && <Component {...props} />}
                {isLoading && <>Loading...</>}
                {!isLoggedIn && !isLoading && <Redirect to="/" />}
            </>
        );
    };

    return <Route {...rest} render={renderRoute} />;
};

Api.defaults.headers.common["apiKey"] = localStorage.getItem("token");

export const routing = (
    <Router>
        <Switch>
            <Route path={Routes.login.path} component={Login} />
            <PrivateRoute
                path={Routes.dashboard.path}
                component={DashboardWithContext}
            />
            <Redirect to={Routes.login.path} />
        </Switch>
    </Router>
);

// PrivateRoute.whyDidYouRender = true;
