
import React from 'react'
import ReactDOM from 'react-dom'

// Import fonts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import StoreManager from './StoreManager'
import {BrowserRouter as Router} from 'react-router-dom'

import {AXWT, ControlBarBase, ErrorSnackbar, Loading, Routing} from './components'
import {CoreProvider} from './providers'



const container = document.createElement("div")
container.id = "axwt-container"
document.body.appendChild(container)

const storeManager = new StoreManager()


ReactDOM.render(<storeManager.Provider>
    <CoreProvider>
        <Router basename="/axwt/">
            <AXWT>
                <ControlBarBase/>
                <React.Suspense fallback={<Loading/>}>
                    <Routing/>
                </React.Suspense>
                <ErrorSnackbar/>
            </AXWT>
        </Router>
    </CoreProvider>
</storeManager.Provider>, container)

console.log("[AXWT] Started Application")