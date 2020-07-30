import React from "react";
import { useRouteMatch, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Cookie from "js-cookie";

import RouteWithLayout from "../hoc/RouteWithLayout";
import { AdminLayout, StoryPreviewLayout } from "../layouts";
import { UsersView, StoriesView, StoryDetailsView } from "../views";
import { loadUsers, loadStories, loadUser, authLogout } from "../store/actions";

const Admin = ({
  currentUser,
  publications,
  loadUser,
  loadUsers,
  loadStories,
}) => {
  const { path } = useRouteMatch();
  React.useEffect(() => {
    const user = Cookie.get("user");
    if (user) {
      loadUser();
    }
  }, [loadUser]);

  React.useEffect(() => {
    if (currentUser) {
      loadUsers();
      loadStories();
    }
  }, [loadUsers, currentUser, loadStories]);

  return (
    <React.Fragment>
      {window.location.pathname === "/admin" && (
        <Redirect to='/admin/al/users' />
      )}
      <Switch>
        <RouteWithLayout
          path={`${path}/al/users`}
          component={UsersView}
          layout={AdminLayout}
        />
        <RouteWithLayout
          path={`${path}/al/stories`}
          component={StoriesView}
          layout={AdminLayout}
        />
        {publications.map((pub) => (
          <RouteWithLayout
            key={pub._id}
            path={`${path}/story/${pub.permalink}`}
            layout={StoryPreviewLayout}>
            <StoryDetailsView story={pub} />
          </RouteWithLayout>
        ))}
        {/* <Route path={`${path}/*`}>
          <Redirect to={`${path}/users`} />
        </Route> */}
      </Switch>
    </React.Fragment>
  );
};

const mapState = (state) => ({
  currentUser: state.auth.currentUser,
  publications: state.stories.publications,
});

export default connect(mapState, {
  loadUser,
  loadUsers,
  loadStories,
  authLogout,
})(Admin);
