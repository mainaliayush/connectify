import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage/index";
import ProfilePage from "./scenes/profilePage";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);                          //GRABS INITIAL STATE OF THE MODE FROM THE GLOBAL STORE
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);    //Will set up the theme
  const isAuth = Boolean(useSelector((state) => state.token));             //Whether they are logged in or not

  return (
    <div className="app">                        
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />   {/*This component is used to add some basic styling to our application like box-sizing, background color, etc like CSS RESET for our application on top of Theme. */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />

            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;