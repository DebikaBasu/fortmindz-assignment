import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EmployeeListing, UpdateEmployeePage } from "./components";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  localStorage.setItem('theme', 'dark');
  return (
    <BrowserRouter>
      <ThemeProvider theme={localStorage.getItem('theme') === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
          <Routes>
            <Route path="/" element={<EmployeeListing />}/>
            <Route path="update" element={<UpdateEmployeePage />} />
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
