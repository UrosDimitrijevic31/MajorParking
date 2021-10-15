export interface IDefaultProps {
    id: string;
    name: string;
}

export interface IFranchise extends IDefaultProps {
    description: string;
}

export interface IClient extends IDefaultProps {
    franchise: IFranchise;
    franchiseName: string;
    numberOfParkings: number;
}

export interface IRole extends IDefaultProps {
    name: string;
}

export interface IUser extends IDefaultProps {
    userName: string;
    role: IRole;
    roleName: string;
    pwd: string;
    inkassoName: string;
    inkasso: IIncassoProfiles;
    client: IClient;
    clientName: string;
}

export interface IParking extends IDefaultProps {
    parkingType: IDefaultProps;
    franchise: IFranchise;
    product: IDefaultProps;
    exibition: IDefaultProps;
    inkasso: IIncassoProfiles;
    latitude: number;
    longitude: number;
    costCenter: number;
    numberOfSigns: number;
    contactPerson: string;
    contractPeriod: string;
    contractNumber: string;
    paidCancellations: number;
    phone: string;
    region: IRegion;
    psaNumber: string;
    whitelistApproved: boolean;
    workingTimeStart: string;
    workingTimeEnd: string;
    monthlyFee: number;
    client: IClient;
    warning: string;
    parking: string;
    city: string;
    address: string;
    zipCode: number;
    comment: string;
    warningEnabled: boolean;
    warningDays: number;
    inkassoDays: number;
    yellowCardEnabled: boolean;
    deleteYellowCardDays: number;
    yellowCardPrice: number;
    completeAddress: string;
    active: boolean;
}

export interface IVehicle extends IDefaultProps {
    carBrand: IDefaultProps;
    brandName: string;
    plates: string;
    model: string;
}

export interface ICarColor extends IDefaultProps {
    code: string;
}

export interface IInspectionItem extends IDefaultProps {
    freeMinutes: number;
    doubleScan: boolean;
}

export interface IParkingInspectionItem extends IDefaultProps {
    inspectionItem: IInspectionItem;
    price: number;
}

export interface IRegion extends IDefaultProps {
    description: string;
}

export interface IHoliday {
    id: string;
    name: string;
    start: number;
    end: number;
    type: IHolidayType;
}

export interface IHolidayType {
    id: string;
    name: string;
}

export interface IEmployee extends IDefaultProps {
    userName: string;
    lastName: string;
    serviceNumber: string;
    role: IDefaultProps;
    holidays: IHoliday[];
    phone: string;
    region: IRegion;
    deviceNumber: string;
    workingHours: number;
    email: string;
    printerSerial: string;
    vehicle: IVehicle;
    smartphone: string;
    hourlyRate: number;
    active: boolean;
}

export interface ITicket extends IDefaultProps {
    parking: IParking;
    ticketNumber: string;
    vehicle: IVehicle;
    employee: IEmployee;
    stamp: string;
    paymentStamp: string;
    paymentStatus: IDefaultProps;
    comment: string;
    regionName: string;
    plates: string;
    price: number;
    countryMark: string;
    carBrand: IDefaultProps;
    carColor: ICarColor;
    parkingType: IParking;
    parkingInspectionItem: IParkingInspectionItem;
    warningFee: number;
    inkassoFee: number;
    total: number;
    warningFeeWithoutVat: number;
    inkassoFeeWithoutVat: number;
    totalWithoutVat: number;
    priceWithoutVat: number;
    employeeServiceNumber: number;
    checked: boolean;
    inkassoSent: number;
    warningSent: number;
    ticketType: number;
    yellowCard: ITicket;
    deleteUserName: string;
}

export interface IWhitelist extends IDefaultProps {
    parking: IParking;
    // vehicle: IVehicle;
    carColor: ICarColor;
    carBrand: IDefaultProps;
    plates: string;
    client: IClient;
    contract: string;
    customerName: string;
    dateFrom: Date;
    dateTo: Date;
}

export interface ISelectOption {
    value: string;
    label: string;
}

export interface IInputError {
    fieldName: string;
    error: string;
}

export interface IIncassoProfiles extends IDefaultProps {
    email: string;
}
export interface IIncassoParkingLocations extends IDefaultProps {
    client: IClient;
}
export interface IReportDataParking extends IDefaultProps {
    parking: IParking;
}
export interface IIncassoUsers extends IDefaultProps {
    roleName: IDefaultProps;
    userName: string;
}

export interface ICancellation extends IDefaultProps {
    franchise: string;
    client: string;
    parking: string;
    paymentstatus: string;
    user: string;
    cancellationfee: number;
    count: number;
    paidcancellations: number;
    stamp: number;
}

export interface ITotalTime extends IDefaultProps {
    parking: string;
    canceledFree3: number;
    franchise: string;
    canceledFree2: number;
    canceledFree1: number;
    totalTimeHours1: number;
    totalTimeHours2: number;
    eurosForEmployee3: number;
    totalTimeHours3: number;
    eurosForEmployee2: number;
    eurosForEmployee1: number;
    canceledAgTickets1: number;
    canceledAgTickets3: number;
    canceledAgTickets2: number;
    totalTime1: number;
    totalTime2: number;
    totalTime3: number;
    ticketsForPay2: number;
    client: string;
    ticketsForPay3: number;
    totalIncome3: number;
    totalIncome2: number;
    totalIncome1: number;
    ticketsForPay1: number;

    totalTicketsFee1: number;
    totalTicketsFee2: number;
    totalTicketsFee3: number;
}

export interface IAllCancellation extends IDefaultProps {
    franchise: string;
    client: string;
    parking: string;
    paymentstatus: string;
    cancellationfee: number;
    count: number;
    paidcancellations: number;
    stamp: number;
    ticketstamp: number;
    price: number;
    username: string;
    inspectionitem: string;
    clientcancel: string;
    stampstring: string;
    ticketstampstring: string;
}

export interface IEmployeeControl extends IDefaultProps {
    franchise: string;
    client: string;
    parking: string;
    count: number;
    region: string;
    employeename: string;
    employeelastname: string;
    costcenter: number;
    parkingtype: string;
    controls: [];
}
