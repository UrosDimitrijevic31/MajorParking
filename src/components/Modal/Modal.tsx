import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface IModalProps {
    visible: boolean;
    onClose: () => void;
    className?: string;
    children: ReactNode;
}

export const Modal = ({
    visible,
    onClose,
    className,
    children
}: IModalProps): JSX.Element => {
    const cssClassNames = classnames(
        "modal absolute w-screen h-screen top-0 left-0 bottom-0 right-0 flex justify-center",
        {
            ["modal--visible"]: visible
        }
    );

    if (!visible) {
        return null;
    }

    return createPortal(
        <section className={`${className ? className : ""} ${cssClassNames}`}>
            <div
                onClick={onClose}
                className="modal__background-overlay absolute top-0 left-0 w-screen h-screen"
            />
            <div className="modal__content card mb-auto mt-6 relative">
                <FontAwesomeIcon
                    onClick={onClose}
                    className="absolute top-0 right-0 m-4 cursor-pointer"
                    icon="times"
                />
                {children}
            </div>
        </section>,
        document.getElementById("modal")
    );
};
