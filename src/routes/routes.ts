const dashboardRoot = "/dashboard";
const administrationRoot = dashboardRoot + "/administration";
const locationRoot = administrationRoot + "/location";
const employeeRoot = administrationRoot + "/employee";
const clientRoot = administrationRoot + "/client";
const userRoot = administrationRoot + "/user";
const vehicleRoot = administrationRoot + "/vehicle";

export default {
    login: {
        path: "/login"
    },
    dashboard: {
        path: dashboardRoot,
        administration: {
            path: administrationRoot,
            location: {
                path: locationRoot,
                add: locationRoot + ":clientId/add",
                edit: locationRoot + "/:locationId/edit",
                remove: locationRoot + "/:locationId/remove"
            },
            employee: {
                path: employeeRoot,
                add: employeeRoot + "/add",
                edit: employeeRoot + "/:employeeId/add",
                remove: employeeRoot + "/:employeeId/remove"
            },
            client: {
                path: clientRoot,
                add: clientRoot + "/add",
                edit: clientRoot + "/:clientId/edit",
                remove: clientRoot + "/:clientId/remove",
                locations: clientRoot + "/:clientId/locations",
                addLocations: clientRoot + "/:clientId/addLocations",
                editLocations: clientRoot + "/:locationId/addLocations"
            },
            user: {
                path: userRoot,
                add: userRoot + "/add",
                edit: userRoot + "/:userId/edit",
                remove: userRoot + "/:userId/remove"
            },
            vehicle: {
                path: vehicleRoot,
                add: vehicleRoot + "/add",
                edit: vehicleRoot + "/:vehicleId/edit",
                remove: vehicleRoot + "/:vehicleId/remove"
            }
        },
        inspection: dashboardRoot + "/inspection",
        deletedTickets: dashboardRoot + "/deletedTickets",
        clientDashboard: dashboardRoot + "/clientDashboard",
        clientWhitelist: dashboardRoot + "/clientWhitelist",
        yellowcard: dashboardRoot + "/yellowcard",
        redcard: dashboardRoot + "/redcard",
        settings: dashboardRoot + "/settings",
        whitelist: dashboardRoot + "/whitelist",
        reporting: dashboardRoot + "/reporting",
        timeAndAttendance: dashboardRoot + "/timeAndAttendance",
        accounting: dashboardRoot + "/accounting",
        incaso: dashboardRoot + "/incaso",
        warnings: dashboardRoot + "/warnings",
        errors: dashboardRoot + "/errors"
    },
    inkasso: {
        path: dashboardRoot,
        inspection: dashboardRoot + "/inspection",
        incaso: dashboardRoot + "/incaso",
        warnings: dashboardRoot + "/warnings"
    }
};
