import React, { forwardRef } from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ICustomDateInputProps {
    value?: string;
    onClick?: () => void;
}

// eslint-disable-next-line react/display-name
const CustomDateInput = forwardRef(
    (
        { value, onClick }: ICustomDateInputProps,
        ref: React.Ref<HTMLButtonElement>
    ): JSX.Element => (
        <button
            ref={ref}
            type="button"
            className="cursor-pointer text-sm flex justify-center"
            onClick={onClick}
        >
            <FontAwesomeIcon
                className="text-blue-sanJuan text-xl mr-2"
                icon="calendar-day"
            />
            {value}
        </button>
    )
);

// export interface IDatepickerProps extends ReactDatePickerProps {}

export const Datepicker = ({ ...rest }: ReactDatePickerProps): JSX.Element => {
    return (
        <DatePicker
            dateFormat="dd.MM.yyyy"
            {...rest}
            customInput={<CustomDateInput />}
        />
    );
};
