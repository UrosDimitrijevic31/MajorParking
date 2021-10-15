import React, {
    ReactNode,
    DetailedHTMLProps,
    ButtonHTMLAttributes
} from "react";
import classnames from "classnames";

export interface IButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    className?: string;
    children?: ReactNode;
    color?: "primary" | "secondary" | "danger" | "info" | "success" | "warning";
}

export const Button = ({
    children,
    className,
    color,
    ...rest
}: IButtonProps): JSX.Element => {
    const cssClass = classnames("btn py-2 px-6", {
        ["btn--primary"]: !color,
        [`btn--${color}`]: color
    });
    return (
        <button className={`${className} ${cssClass}`} {...rest}>
            {children}
        </button>
    );
};
