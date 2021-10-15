import React, { ReactNode, useState, Children, ReactElement } from "react";
import { ITabProps } from "components";
import classnames from "classnames";

export interface ITabsProps {
    className?: string;
    children: ReactNode;
    headerColor?: "primary" | "secondary" | "warning" | "info";
}

const tabNavItemCssClasses =
    "tabs__nav-item cursor-pointer text-white py-3 px-4 mx-2 whitespace-no-wrap";

export const Tabs = ({
    className,
    headerColor,
    children
}: ITabsProps): JSX.Element => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const cssClassName = classnames("tabs card", {
        ["tabs--primary"]: !headerColor,
        ["tabs--secondary"]: headerColor === "secondary",
        ["tabs--warning"]: headerColor === "warning"
    });

    const handleSetActiveTab = (index): void => {
        setActiveTabIndex(index);
    };

    return (
        <section className={`${cssClassName} ${className}`}>
            <header className="tabs__header p-4 flex flex-wrap justify-around">
                {Children.map(children, (child: ReactElement<ITabProps>, i) => (
                    <div
                        key={i}
                        onClick={handleSetActiveTab.bind(this, i)}
                        className={`${tabNavItemCssClasses} ${
                            activeTabIndex == i ? "tabs__nav-item--active" : ""
                        }`}
                    >
                        {child.props.title}
                    </div>
                ))}
            </header>

            {Children.map(children, (child: ReactElement<ITabProps>, i) => (
                <>{activeTabIndex == i && child}</>
            ))}
        </section>
    );
};
