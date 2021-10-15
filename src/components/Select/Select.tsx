/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import ReactSelect, { Props, Styles } from "react-select";

export const formatOptions = (options, valueProp = "id", labelProp = "name") =>
    options.map(o => ({
        label: o[labelProp],
        value: o[valueProp]
    }));

// * styles docs https://react-select.com/styles
const customStyles = {
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";
        const fontSize = "14px";
        return { ...provided, opacity, transition, fontSize };
    },
    placeholder: provided => ({
        ...provided,
        fontSize: "14px"
    }),
    option: provided => ({
        ...provided,
        fontSize: "14px"
    })
} as Styles;

export interface ISelectProps extends Props {
    label?: string;
    error?: string;
}

export const Select = ({
    label,
    error,
    ...rest
}: ISelectProps): JSX.Element => {
    const selectStyles = { ...customStyles };
    if (error) {
        selectStyles.control = provided => ({
            ...provided,
            border: "#e53e3e 1px solid"
        });
    }
    return (
        <div className="custom-select relative">
            {label && (
                <label className="text-sm text-gray-800 mb-1 block">
                    {label}
                </label>
            )}
            <ReactSelect {...rest} styles={selectStyles} />
            {error && (
                <span className="custom-select__error text-xs text-red-600 absolute left-0">
                    {error}
                </span>
            )}
        </div>
    );
};
