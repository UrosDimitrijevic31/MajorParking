import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputField, Button } from "components";
import { useTranslation } from "react-i18next";
import Routes from "routes";
import axios from "axios";
import { Api } from "services";

export const Login = (): JSX.Element => {
    const { t } = useTranslation();
    const [redirectTo, setRedirectTo] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [formError, setFormError] = useState({
        username: "",
        password: ""
    });

    const handleInputChange = (prop, e): void => {
        setFormData({
            ...formData,
            [prop]: e.currentTarget.value
        });
    };

    const handleLoginSubmit = (e): void => {
        e.preventDefault();
        let usernameError, passwordError;

        if (!formData.username) {
            usernameError = "username is required";
        } else if (formData.username !== "admin") {
            usernameError = "username is not valid";
        }

        if (!formData.password) {
            passwordError = "password is required";
        } else if (formData.password !== "admin") {
            passwordError = "password is not valid";
        }

        // setFormError({
        //     username: usernameError,
        //     password: passwordError
        // });

        axios
            .get(
                "http://192.168.1.90:8080/kuca/login/login?userName=" +
                    formData.username +
                    "&pwd=" +
                    formData.password
            )
            .then(result => {
                if (result.data.result === "ok") {
                    localStorage.setItem("token", result.data.token);
                    localStorage.setItem("role", result.data.roleName);
                    Api.defaults.headers.common[
                        "apiKey"
                    ] = localStorage.getItem("token");

                    if (result.data.inkasso) {
                        localStorage.setItem(
                            "inkassoName",
                            result.data.inkassoName
                        );
                        localStorage.setItem(
                            "inkassoId",
                            result.data.inkassoId
                        );
                    } else {
                        localStorage.setItem("inkassoName", "/");
                    }

                    if (result.data.client) {
                        localStorage.setItem(
                            "clientName",
                            result.data.clientName
                        );
                        localStorage.setItem("clientId", result.data.client.id);
                    } else {
                        localStorage.setItem("clientName", "/");
                    }

                    // if (localStorage.getItem("role") === "operator") {
                    //     setRedirectTo(Routes.dashboard.path + "/incaso");
                    // } else {
                    console.log(result.data, "Login");
                    if (result.data.inkasso) {
                        setRedirectTo(Routes.dashboard.path + "/inspection");
                    } else if (result.data.client) {
                        alert(result.data.client.name);
                        setRedirectTo(
                            Routes.dashboard.path + "/clientDashboard"
                        );
                    } else {
                        setRedirectTo(
                            Routes.dashboard.path + "/administration"
                        );
                    }
                    // }
                } else {
                    setFormError({
                        username: usernameError,
                        password: passwordError
                    });
                }
            })
            .catch(error => console.error(error));

        // if (!usernameError && !passwordError) {
        //     setRedirectTo(Routes.dashboard.path);
        // }
    };

    return (
        <>
            {redirectTo && <Redirect to={redirectTo} />}
            <section className="login w-screen h-screen flex items-center justify-center">
                <form
                    onSubmit={handleLoginSubmit}
                    className="card login__container text-center absolute max-w-2xl min-w-1/4"
                >
                    <FontAwesomeIcon
                        className="text-6xl text-seance"
                        icon="users"
                    />
                    <header className="login__header font-thin text-2xl uppercase text-center">
                        {t("appName")}
                    </header>
                    <div className="login__content">
                        <InputField
                            value={formData.username}
                            error={formError.username}
                            onChange={handleInputChange.bind(this, "username")}
                            className="mb-8"
                            label={t("general.username")}
                        />

                        <InputField
                            className="mb-6"
                            value={formData.password}
                            error={formError.password}
                            type="password"
                            onChange={handleInputChange.bind(this, "password")}
                            label={t("general.password")}
                        />
                    </div>
                    <Button type="submit">{t("general.login")}</Button>
                </form>
            </section>
        </>
    );
};
