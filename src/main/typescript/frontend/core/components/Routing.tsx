
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Dashboard from './Dashboard'

const PVModule = React.lazy(() => import("@axwt/path-visualizer"))
const ULModule = React.lazy(() => import("@axwt/user-list"))

export const Routing: React.FC = () => <Switch>
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


