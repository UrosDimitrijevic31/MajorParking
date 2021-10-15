import React, { createContext, useContext, PropsWithChildren } from "react";
import { DashboardDispatch, dashboardReducer } from "context";
import {
    ICarColor,
    IDefaultProps,
    IFranchise,
    IRegion,
    IVehicle,
    IEmployee,
    IClient,
    IUser,
    IParking,
    IInspectionItem,
    IParkingInspectionItem,
    IIncassoProfiles,
    IIncassoParkingLocations,
    IIncassoUsers,
    IReportDataParking,
    ICancellation,
    IAllCancellation,
    ITotalTime,
    IEmployeeControl
} from "types";

export interface IDashboardState {
    carColors: ICarColor[];
    carBrands: IDefaultProps[];
    franchises: IFranchise[];
    roles: IDefaultProps[];
    regions: IRegion[];
    vehicles: IVehicle[];
    employees: IEmployee[];
    parkingTypes: IDefaultProps[];
    clients: IClient[];
    parkings: IParking[];
    products: IDefaultProps[];
    users: IUser[];
    exibitions: IDefaultProps[];
    inspectionItems: IInspectionItem[];
    parkingInspectionItems: IParkingInspectionItem[];
    incassoProfiles: IIncassoProfiles[];
    incassoParkingLocations: IIncassoParkingLocations[];
    incassoUsers: IIncassoUsers[];
    onParkingData: IReportDataParking[];
    cancellations: ICancellation[];
    allCancellations: IAllCancellation[];
    allControls: IEmployeeControl[];
    totalTime: ITotalTime[];
}

const defaultDashboardState = {
    carColors: [],
    carBrands: [],
    franchises: [],
    roles: [],
    regions: [],
    vehicles: [],
    employees: [],
    parkingTypes: [],
    clients: [],
    users: [],
    parkings: [],
    products: [],
    exibitions: [],
    inspectionItems: [],
    parkingInspectionItems: [],
    incassoProfiles: [],
    incassoParkingLocations: [],
    incassoUsers: [],
    onParkingData: [],
    cancellations: [],
    allCancellations: [],
    allControls: [],
    totalTime: []
};

const DashboardStateContext = createContext<IDashboardState>(
    defaultDashboardState
);
const DashboardDispatchContext = createContext<DashboardDispatch>(undefined);

const useDashboardState = (): IDashboardState => {
    const context = useContext(DashboardStateContext);
    if (context === undefined) {
        throw new Error(
            "useDashboardState must be used within a DashboardProvider"
        );
    }
    return context;
};

const useDashboardDispatch = (): DashboardDispatch => {
    const context = React.useContext(DashboardDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useDashboardDispatch must be used within a DashboardProvider"
        );
    }

    return context;
};

const DashboardProvider = ({
    children
}: PropsWithChildren<{}>): JSX.Element => {
    const [state, dispatch] = React.useReducer(
        dashboardReducer,
        defaultDashboardState
    );

    return (
        <DashboardStateContext.Provider value={state}>
            <DashboardDispatchContext.Provider value={dispatch}>
                {children}
            </DashboardDispatchContext.Provider>
        </DashboardStateContext.Provider>
    );
};

export const withDashboardProvider = (Component: React.FC): JSX.Element => (
    <DashboardProvider>
        <Component />
    </DashboardProvider>
);

export { useDashboardState, useDashboardDispatch, DashboardProvider };
