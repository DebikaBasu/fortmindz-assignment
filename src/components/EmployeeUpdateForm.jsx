import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee } from "../redux/employeeSlice";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    CircularProgress,
    Avatar,
    Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaCloudUploadAlt } from "react-icons/fa";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: "2rem",
    backgroundColor: "#1E1E1E",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    color: "#fff"
}));

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#2D2D2D",
        borderRadius: "8px",
        "& fieldset": {
            borderColor: "#404040"
        },
        "&:hover fieldset": {
            borderColor: "#606060"
        },
        "&.Mui-focused fieldset": {
            borderColor: "#007FFF"
        }
    },
    "& .MuiInputLabel-root": {
        color: "#A0A0A0"
    },
    "& .MuiInputBase-input": {
        color: "#FFFFFF"
    },
    marginBottom: "1rem"
});

const StyledButton = styled(Button)({
    backgroundColor: "#007FFF",
    padding: "12px 24px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    "&:hover": {
        backgroundColor: "#0059B2",
        transform: "translateY(-2px)"
    }
});

const BackButton = styled(Button)({
    backgroundColor: "#2D2D2D",
    color: "#FFFFFF",
    padding: "8px 16px",
    borderRadius: "8px",
    marginBottom: "1rem",
    "&:hover": {
        backgroundColor: "#404040"
    }
});

const UploadButton = styled(Button)({
    backgroundColor: "#2D2D2D",
    color: "#FFFFFF",
    padding: "12px 24px",
    borderRadius: "8px",
    marginTop: "1rem",
    "&:hover": {
        backgroundColor: "#404040"
    }
});

const EmployeeUpdateForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { employeeData } = location.state || {};

    const { isLoading: isUpdating } = useSelector((state) => state.employees);

    const [formData, setFormData] = useState({
        fullName: employeeData?.fullName || "",
        age: employeeData?.age || "",
        salary: employeeData?.salary || "",
        phone: employeeData?.phone || "",
        email: employeeData?.email || "",
        image: employeeData?.image || null,
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(
        employeeData?.image || "images.unsplash.com/photo-1633332755192-727a05c4013d"
    );

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full name is required";
        if (!formData.age || formData.age < 18) newErrors.age = "Age must be 18 or above";
        if (!formData.salary) newErrors.salary = "Salary is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.phone) newErrors.phone = "Phone Number is required";
        console.log(formData.phone.length)
        if(formData.phone.length > 10) newErrors.phone = "Phone Number should not be greater than 10 digit";
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            // Dispatch updateEmployee event
            dispatch(updateEmployee({ ...formData, _id: employeeData._id }));
            navigate("/"); // Redirect to the emp listing page after update
        } else {
            setErrors(newErrors);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <StyledPaper elevation={3}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <BackButton startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
                        Back
                    </BackButton>
                    <Typography variant="h4" gutterBottom sx={{ mb: 0, flex: 1, textAlign: "center" }}>
                        Update Employee Details
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                            <Avatar
                                src={previewImage}
                                alt="Employee"
                                sx={{
                                    width: 150,
                                    height: 150,
                                    margin: "0 auto",
                                    mb: 2,
                                    border: "4px solid #404040",
                                }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                id="image-upload"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload">
                                <UploadButton component="span" startIcon={<FaCloudUploadAlt />}>
                                    Choose Image
                                </UploadButton>
                            </label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <StyledTextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                            />

                            <StyledTextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                error={!!errors.age}
                                helperText={errors.age}
                            />

                            <StyledTextField
                                fullWidth
                                label="Salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleInputChange}
                                error={!!errors.salary}
                                helperText={errors.salary}
                            />

                            <StyledTextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />

                            <StyledTextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, textAlign: "center" }}>
                        <StyledButton
                            type="submit"
                            variant="contained"
                            disabled={isUpdating}
                            startIcon={isUpdating && <CircularProgress size={20} color="inherit" />}
                        >
                            {isUpdating ? "Updating..." : "Update Employee"}
                        </StyledButton>
                    </Box>
                </form>
            </StyledPaper>
        </Container>
    );
};

export default EmployeeUpdateForm;