import React from "react";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Routes from "routes";
import { Button } from "../Button/Button";
import { Api } from "services";

export interface ISidebarProps {
    opened: boolean;
}

interface INavLinkProps {
    label: string;
    url: string;
    exact?: boolean;
    icon?: string;
}

export const Sidebar = ({ opened }: ISidebarProps): JSX.Element => {
    const { t } = useTranslation();
    const className = classnames("sidebar h-screen overflow-auto relative", {
        ["sidebar--opened"]: opened
    });
    const buttonLinkStyle =
        "text-right underline hover:text-orange-treePoppy lowercase font-thin";

    let dat = [
        // {
        //     label: t("dashboard.label"),
        //     url: Routes.dashboard.path,
        //     exact: true
        // },
        {
            label: t("administration.label"),
            url: Routes.dashboard.administration.path
        },
        {
            label: t("inspection.label"),
            url: Routes.dashboard.inspection
        },
        {
            label: t("general.deletedTickets"),
            url: Routes.dashboard.deletedTickets
        },
        {
            label: t("general.yellowCard"),
            url: Routes.dashboard.yellowcard
        },
        {
            label: t("general.redCard"),
            url: Routes.dashboard.redcard
        },
        {
            label: t("settings.label"),
            url: Routes.dashboard.settings
        },
        {
            label: t("whitelist.label"),
            url: Routes.dashboard.whitelist
        },
        // {
        //     label: t("timeAndAttendance.label"),
        //     url: Routes.dashboard.timeAndAttendance
        // },
        {
            label: t("accounting.label"),
            url: Routes.dashboard.accounting
        },
        {
            label: t("incasso.label"),
            url: Routes.dashboard.incaso
        },
        {
            label: t("general.warning"),
            url: Routes.dashboard.warnings
        },
        {
            label: t("reporting.label"),
            url: Routes.dashboard.reporting
        }
        // {
        //     label: t("errors.label"),
        //     url: Routes.dashboard.errors
        // }
    ];
    console.log(localStorage.getItem("inkassoName"), "INK");
    if (localStorage.getItem("inkassoName") != "/") {
        dat = [
            // {
            //     label: t("dashboard.label"),
            //     url: Routes.dashboard.path,
            //     exact: true
            // },
            // {
            //     label: t("administration.label"),
            //     url: Routes.dashboard.administration.path
            // },
            {
                label: t("inspection.label"),
                url: Routes.dashboard.inspection
            },
            // {
            //     label: t("settings.label"),
            //     url: Routes.dashboard.settings
            // },
            // {
            //     label: t("whitelist.label"),
            //     url: Routes.dashboard.whitelist
            // },
            // {
            //     label: t("timeAndAttendance.label"),
            //     url: Routes.dashboard.timeAndAttendance
            // },
            // {
            //     label: t("accounting.label"),
            //     url: Routes.dashboard.accounting
            // },
            {
                label: t("incasso.label"),
                url: Routes.dashboard.incaso
            },
            {
                label: t("general.warning"),
                url: Routes.dashboard.warnings
            }
            // ,
            // {
            //     label: t("reporting.label"),
            //     url: Routes.dashboard.reporting
            // }
            // {
            //     label: t("errors.label"),
            //     url: Routes.dashboard.errors
            // }
        ];
    } else if (localStorage.getItem("clientName") != "/") {
        dat = [
            // {
            //     label: t("dashboard.label"),
            //     url: Routes.dashboard.path,
            //     exact: true
            // },
            // {
            //     label: t("administration.label"),
            //     url: Routes.dashboard.administration.path
            // },
            {
                label: t("inspection.label"),
                url: Routes.dashboard.clientDashboard
            },
            {
                label: t("whitelist.label"),
                url: Routes.dashboard.clientWhitelist
            }
            // {
            //     label: t("settings.label"),
            //     url: Routes.dashboard.settings
            // },
            // {
            //     label: t("whitelist.label"),
            //     url: Routes.dashboard.whitelist
            // },
            // {
            //     label: t("timeAndAttendance.label"),
            //     url: Routes.dashboard.timeAndAttendance
            // },
            // {
            //     label: t("accounting.label"),
            //     url: Routes.dashboard.accounting
            // },
            // {
            //     label: t("incasso.label"),
            //     url: Routes.dashboard.incaso
            // },
            // {
            //     label: t("general.warning"),
            //     url: Routes.dashboard.warnings
            // }
            // ,
            // {
            //     label: t("reporting.label"),
            //     url: Routes.dashboard.reporting
            // }
            // {
            //     label: t("errors.label"),
            //     url: Routes.dashboard.errors
            // }
        ];
    }

    const navLinks: INavLinkProps[] = dat;

    const logout = (): void => {
        localStorage.setItem("token", null);
        Api.defaults.headers.common["apiKey"] = null;
        window.open("/login", "_self");
    };

    return (
        <section className={className}>
            <header className="sidebar__header p-4 relative z-10">
                <figure>
                    <img src="/img/logo-gold.svg" alt={t("general.appName")} />
                </figure>
            </header>
            <div className="sidebar__content relative z-10">
                <nav className="sidebar__nav">
                    <div className="sidebar__link-container">
                        {navLinks.map((link, i) => (
                            <NavLink
                                exact={link.exact}
                                key={`${link.label}-${i}`}
                                activeClassName="sidebar__link--active"
                                className="sidebar__link text-white bg-husk px-4 py-3 mx-4 mt-3 block relative"
                                to={link.url}
                            >
                                {link.label}

                                {link.icon && (
                                    <span className="sidebar__link-icon">
                                        <FontAwesomeIcon
                                            icon={link.icon as IconProp}
                                        />
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
                <br /> <br />
                &nbsp;&nbsp;&nbsp;
                <Button onClick={logout}>Logout</Button>
            </div>
        </section>
    );
};
