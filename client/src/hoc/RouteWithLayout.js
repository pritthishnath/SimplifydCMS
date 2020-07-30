import React from "react";
import { Route } from "react-router-dom";

const RouteWithLayout = (props) => {
  const { layout: Layout, component: Component, children, ...rest } = props;

  return (
    <React.Fragment>
      {Component ? (
        <Route
          {...rest}
          render={(matchProps) => (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          )}
        />
      ) : (
        <Route {...rest}>
          <Layout>{children}</Layout>
        </Route>
      )}
    </React.Fragment>
  );
};

export default RouteWithLayout;
