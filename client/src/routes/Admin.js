import React from "react";
import { useRouteMatch, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { AdminLayout } from "../layouts";
import { UsersView, StoriesView } from "../views";
import { loadUsers, loadStories } from "../store/actions";

const Admin = ({ currentUser, loadUsers, loadStories }) => {
  const { path } = useRouteMatch();

  React.useEffect(() => {
    if (!localStorage.admin_url) {
      localStorage.setItem("admin_url", "/admin/users");
    }
    return () => {
      localStorage.removeItem("admin_url");
    };
  }, []);
  React.useEffect(() => {
    if (currentUser) {
      loadUsers();
      loadStories();
    }
  }, [loadUsers, currentUser, loadStories]);

  return (
    <AdminLayout>
      <Redirect
        to={
          localStorage.admin_url
            ? localStorage.getItem("admin_url")
            : `/admin/users`
        }
      />
      <Switch>
        <Route path={`${path}/users`} component={UsersView} />
        <Route path={`${path}/stories`} component={StoriesView} />
        {/* <Route path={`${path}/*`}>
          <Redirect to={`${path}/users`} />
        </Route> */}
      </Switch>
    </AdminLayout>
  );
};

const mapState = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapState, { loadUsers, loadStories })(Admin);
