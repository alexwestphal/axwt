
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Dashboard from './Dashboard'

const HTModule = React.lazy(() => import("@axwt/http-tester"))
const PVModule = React.lazy(() => import("@axwt/path-visualizer"))
const ULModule = React.lazy(() => import("@axwt/user-list"))

export const Routing: React.FC = () => <Switch>
    <Route path="/http-tester">
        <HTModule/>
    </Route>
    <Route path="/path-visualizer">
        <PVModule/>
    </Route>
    <Route path="/user-list">
        <ULModule/>
    </Route>
    <Route path="/">
        <Dashboard/>
    </Route>
    <Route path="*">
        <Redirect to="/"/>
    </Route>
</Switch>


export default Routing


