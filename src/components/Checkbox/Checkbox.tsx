import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ICheckboxProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    label: string;
    labelPosition?: "left" | "right";
    onChange: () => void;
}

export const Checkbox = ({
    label,
    labelPosition,
    onChange,
    ...rest
}: ICheckboxProps): JSX.Element => (
    <div
        className={`checkbox__container flex items-center justify-center ${
            labelPosition && labelPosition === "right"
                ? "flex-row-reverse"
                : "flex-row"
        }`}
    >
        <input
            type="checkbox"
            className="checkbox__input hidden absolute"
            {...rest}
        />
        <span
            className="checkbox__checkmark flex items-center justify-center w-6 h-6 cursor-pointer rounded-sm"
            onClick={onChange}
        >
            <FontAwesomeIcon icon="check" className="text-husk" />
        </span>
        <label className="checkbox__label mx-2 text-sm">{label}</label>
    </div>
);
