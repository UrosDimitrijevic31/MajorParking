import { IDashboardState } from "context";
import {
    IDefaultProps,
    ICarColor,
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

export const SET_CAR_COLORS = "setCarColors";
export const SET_CAR_BRANDS = "setCarBrands";
export const SET_FRANCHISES = "setFranchises";
export const SET_ROLES = "setRoles";
export const SET_REGIONS = "setRegions";
export const SET_CANCELLATIONS = "setCancellations";
export const SET_ALL_CANCELLATIONS = "setAllCancellations";
export const SET_EMPLOYEE_CONTROLS = "setEmployeeControls";
export const SET_TOTAL_TIME = "setTotalTime";
export const SET_VEHICLES = "setVehicles";
export const SET_EMPLOYEES = "setEmployees";
export const SET_PARKING_TYPES = "setParkingTypes";
export const SET_CLIENTS = "setClients";
export const SET_PARKING = "setParking";
export const SET_PRODUCTS = "setProducts";
export const SET_USERS = "setUsers";
export const SET_EXIBITIONS = "setExibitions";
export const SET_INSPECTION_ITEMS = "setInspectionItems";
export const SET_PARKING_INSPECTION_ITEMS = "setParkingInspectionItems";
export const SET_INCASSO_PROFILES = "setIncassoProfiles";
export const SET_INCASSO_PARKING_LOCATIONS = "setIncassoParkingLocations";
export const SET_INCASSO_USERS = "setIncassoUsers";
export const SET_REPORTING_PARKING_DATA = "setReportingParkingData";

export type DashboardAction =
    | {
          type: typeof SET_CAR_COLORS;
          payload: ICarColor[];
      }
    | {
          type: typeof SET_REPORTING_PARKING_DATA;
          payload: IReportDataParking[];
      }
    | {
          type: typeof SET_INCASSO_USERS;
          payload: IIncassoUsers[];
      }
    | {
          type: typeof SET_CANCELLATIONS;
          payload: ICancellation[];
      }
    | {
          type: typeof SET_EMPLOYEE_CONTROLS;
          payload: IEmployeeControl[];
      }
    | {
          type: typeof SET_TOTAL_TIME;
          payload: ITotalTime[];
      }
    | {
          type: typeof SET_ALL_CANCELLATIONS;
          payload: IAllCancellation[];
      }
    | {
          type: typeof SET_USERS;
          payload: IUser[];
      }
    | {
          type: typeof SET_INCASSO_PARKING_LOCATIONS;
          payload: IIncassoParkingLocations[];
      }
    | {
          type: typeof SET_INCASSO_PROFILES;
          payload: IIncassoProfiles[];
      }
    | {
          type: typeof SET_INSPECTION_ITEMS;
          payload: IInspectionItem[];
      }
    | {
          type: typeof SET_EXIBITIONS;
          payload: IDefaultProps[];
      }
    | {
          type: typeof SET_CAR_BRANDS;
          payload: IDefaultProps[];
      }
    | {
          type: typeof SET_FRANCHISES;
          payload: IFranchise[];
      }
    | {
          type: typeof SET_ROLES;
          payload: IDefaultProps[];
      }
    | {
          type: typeof SET_REGIONS;
          payload: IRegion[];
      }
    | {
          type: typeof SET_VEHICLES;
          payload: IVehicle[];
      }
    | {
          type: typeof SET_EMPLOYEES;
          payload: IEmployee[];
      }
    | {
          type: typeof SET_PARKING_TYPES;
          payload: IDefaultProps[];
      }
    | {
          type: typeof SET_PARKING_INSPECTION_ITEMS;
          payload: IParkingInspectionItem[];
      }
    | {
          type: typeof SET_CLIENTS;
          payload: IClient[];
      }
    | {
          type: typeof SET_PRODUCTS;
          payload: IDefaultProps[];
      }
    | {
          type: typeof SET_PARKING;
          payload: IParking[];
      };

export type DashboardDispatch = (action: DashboardAction) => void;

export const dashboardReducer = (
    state: IDashboardState,
    action: DashboardAction
): IDashboardState => {
    switch (action.type) {
        case SET_CAR_COLORS: {
            return {
                ...state,
                carColors: [...action.payload]
            };
        }
        case SET_REPORTING_PARKING_DATA: {
            return {
                ...state,
                onParkingData: [...action.payload]
            };
        }
        case SET_INCASSO_USERS: {
            return {
                ...state,
                incassoUsers: [...action.payload]
            };
        }
        case SET_CANCELLATIONS: {
            return {
                ...state,
                cancellations: [...action.payload]
            };
        }
        case SET_TOTAL_TIME: {
            return {
                ...state,
                totalTime: [...action.payload]
            };
        }
        case SET_ALL_CANCELLATIONS: {
            return {
                ...state,
                allCancellations: [...action.payload]
            };
        }
        case SET_EMPLOYEE_CONTROLS: {
            return {
                ...state,
                allControls: [...action.payload]
            };
        }
        case SET_INCASSO_PARKING_LOCATIONS: {
            return {
                ...state,
                incassoParkingLocations: [...action.payload]
            };
        }
        case SET_INCASSO_PROFILES: {
            return {
                ...state,
                incassoProfiles: [...action.payload]
            };
        }
        case SET_USERS: {
            return {
                ...state,
                users: [...action.payload]
            };
        }
        case SET_INSPECTION_ITEMS: {
            return {
                ...state,
                inspectionItems: [...action.payload]
            };
        }
        case SET_PARKING_INSPECTION_ITEMS: {
            return {
                ...state,
                parkingInspectionItems: [...action.payload]
            };
        }
        case SET_CAR_BRANDS: {
            return {
                ...state,
                carBrands: [...action.payload]
            };
        }
        case SET_FRANCHISES: {
            return {
                ...state,
                franchises: [...action.payload]
            };
        }
        case SET_ROLES: {
            return {
                ...state,
                roles: [...action.payload]
            };
        }
        case SET_REGIONS: {
            return {
                ...state,
                regions: [...action.payload]
            };
        }
        case SET_VEHICLES: {
            return {
                ...state,
                vehicles: [...action.payload]
            };
        }
        case SET_EMPLOYEES: {
            return {
                ...state,
                employees: [...action.payload]
            };
        }
        case SET_PARKING_TYPES: {
            return {
                ...state,
                parkingTypes: [...action.payload]
            };
        }
        case SET_CLIENTS: {
            return {
                ...state,
                clients: [...action.payload]
            };
        }
        case SET_PARKING: {
            return {
                ...state,
                parkings: [...action.payload]
            };
        }
        case SET_PRODUCTS: {
            return {
                ...state,
                products: [...action.payload]
            };
        }
        case SET_EXIBITIONS: {
            return {
                ...state,
                exibitions: [...action.payload]
            };
        }
    }
};
