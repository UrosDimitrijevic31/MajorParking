import React from "react";
import classnames from "classnames";

export interface IStyledCardHeaderProps {
    heading: string;
    subHeading?: string;
    theme?: "primary" | "warning";
}

export const StyledCardHeader = ({
    heading,
    subHeading,
    theme
}: IStyledCardHeaderProps): JSX.Element => {
    const className = classnames("styled-card-header p-4 mb-8", {
        ["styled-card-header--primary"]: !theme,
        [`styled-card-header--${theme}`]: theme
    });

    return (
        <header className={className}>
            <h4 className="styled-card-header__heading font-thin text-2xl text-white">
                {heading}
            </h4>
            <p className="styled-card-header__sub-heading text-base text-white">
                {subHeading}
            </p>
        </header>
    );
};

export default StyledCardHeader;
