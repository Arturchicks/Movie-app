import React from "react"
import { createRoot } from "react-dom/client"
import { Offline, Online } from "react-detect-offline"
import { Alert } from "antd"

import App from "./Components/App/app"

const domNode = document.getElementById("root")
const root = createRoot(domNode)
root.render(
  <>
    <Online>
      <App />
    </Online>
    <Offline>
      <Alert message="Please, check your connection" type="warning" />
    </Offline>
  </>
)
