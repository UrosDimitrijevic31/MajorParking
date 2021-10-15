import React from "react";

export const withContext = (Context, Component) => {
    // eslint-disable-next-line react/display-name
    return (props): JSX.Element => {
        return (
            <Context.Consumer>
                {(context): JSX.Element => (
                    <Component {...props} context={context} />
                )}
            </Context.Consumer>
        );
    };
};
