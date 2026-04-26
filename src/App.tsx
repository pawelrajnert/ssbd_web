import {RouterProvider} from "react-router-dom";
import {router} from "./routes";
import {AuthProvider} from "./providers/AuthProvider.tsx";

function App() {
    return (
        <>
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
        </>
    )
}

export default App