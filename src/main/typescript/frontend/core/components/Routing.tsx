
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Dashboard from './Dashboard'

const PVModule = React.lazy(() => import("@axwt/path-visualizer"))

export const Routing: React.FC = () => <Switch>
    <Route path="/path-visualizer">
        <PVModule/>
    </Route>
    <Route path="/">
        <Dashboard/>
    </Route>
    <Route path="*">
        <Redirect to="/"/>
    </Route>
</Switch>


export default Routing


