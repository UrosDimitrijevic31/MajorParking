import React, { ReactNode } from "react";

export interface ITabProps {
    title: string;
    children: ReactNode;
}

export const Tab = ({ children }: ITabProps): JSX.Element => {
    return <div className="tab">{children}</div>;
};
