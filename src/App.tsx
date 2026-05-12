import {RouterProvider} from "react-router-dom";
import {router} from "./routes";
import {AuthProvider} from "./providers/AuthProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

function App() {
    return (
        <>
            <ThemeProvider>
                <AuthProvider>
                    <RouterProvider router={router}/>
                </AuthProvider>
            </ThemeProvider>
        </>
    )
}

export default App