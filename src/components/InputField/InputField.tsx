import React, { useState, DetailedHTMLProps, InputHTMLAttributes } from "react";
import classnames from "classnames";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IInputFieldProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    label?: string;
    value?: string | number;
    className?: string;
    icon?: IconProp;
    error?: string;
}

export const InputField = ({
    label,
    className,
    icon,
    value,
    error,
    ...rest
}: IInputFieldProps): JSX.Element => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocusChange = (value): void => {
        setIsFocused(value);
    };

    const cssClass = classnames("input-field relative", {
        ["input-field--focused"]: isFocused,
        ["input-field--has-value"]: value || value === 0,
        ["input-field--has-error"]: error
    });

    return (
        <div className={`${cssClass} ${className || ""} mt-6`}>
            <label className="input-field__label text-gray-silverChalice text-sm absolute pointer-events-none">
                {label}
            </label>
            <input
                className="input-field__input pr-4 w-full h-5 font-light"
                onFocus={handleFocusChange.bind(this, true)}
                onBlur={handleFocusChange.bind(this, false)}
                value={value}
                {...rest}
            />
            {error && (
                <span className="input-field__error text-xs text-red-600 absolute left-0">
                    {error}
                </span>
            )}
            {icon && (
                <FontAwesomeIcon
                    className="absolute input-field__icon"
                    icon={icon}
                />
            )}
        </div>
    );
};
