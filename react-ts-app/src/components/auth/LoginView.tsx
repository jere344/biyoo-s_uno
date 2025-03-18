import { useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Box, Button, IconButton, InputAdornment, Link, Typography, Container, Paper } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import FormTextField from "../controls/FormTextField";
import ProgressBackdrop from "../controls/ProgressBackdrop";
import UserDS from "../../data_services/UserDS";
import { motion } from "framer-motion";

type FormLoginFields = {
    username: string;
    password: string;
};

function LoginView() {
    const navigate: NavigateFunction = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [submitWarning, setSubmitWarning] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const formSchema = yup.object().shape({
        username: yup.string().required("Le nom d'utilisateur est obligatoire"),
        password: yup.string().required("Le mot de passe est obligatoire"),
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormLoginFields>({
        resolver: yupResolver(formSchema),
    });

    const handleShowPasswordClick = (): void => {
        setShowPassword((prev) => !prev);
    };

    const submitLogin = (data: FormLoginFields) => {
        UserDS.login(data.username, data.password)
            .then(() => {
                // Check if there's a saved path to redirect to
                const redirectPath = localStorage.getItem("redirectPath");
                if (redirectPath) {
                    localStorage.removeItem("redirectPath"); // Clear the saved path
                    navigate(redirectPath);
                } else {
                    navigate("/");
                }
            })
            .catch((err) => {
                if (err.response.status === 401 && err.response.data === "no_active_account") {
                    setSubmitWarning("Aucun compte actif n'a été trouvé.");
                } else {
                    setSubmitError("Une erreur s'est produite lors de la connexion, veuillez réessayer.");
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleFormSubmit = (data: FormLoginFields): void => {
        setSubmitWarning("");
        setSubmitError("");
        setSubmitting(true);

        submitLogin(data);
    };

    const handleSignUpClick = () => {
        navigate("/signup/");
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #303f9f 0%, #1a237e 50%, #0d47a1 100%)",
                minHeight: "100vh",
                padding: "2rem 0",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    zIndex: 0,
                },
            }}
        >
            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <Paper
                        elevation={10}
                        sx={{
                            padding: 4,
                            backgroundColor: "rgba(0,0,0,0.65)",
                            borderRadius: "15px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: [10, 0] }}
                            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "#3949ab",
                                    borderRadius: "50%",
                                    padding: 2,
                                    mb: 2,
                                    boxShadow: "0 0 20px rgba(33, 150, 243, 0.6)",
                                    border: "3px solid rgba(255,255,255,0.2)",
									width: "85px",
									height: "85px"
                                }}
                            >
                                <LockOpenIcon sx={{ fontSize: 50, color: "#fff" }} />
                            </Box>
                        </motion.div>
                        
                        <Typography 
                            component="h1" 
                            variant="h4"
                            sx={{ 
                                color: "#fff", 
                                fontWeight: 700, 
                                mb: 3,
                                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                                letterSpacing: "2px"
                            }}
                        >
                            CONNEXION
                        </Typography>
                        
                        <Box 
                            component="form" 
                            noValidate 
                            onSubmit={handleSubmit(handleFormSubmit)} 
                            sx={{ width: "100%" }}
                        >
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FormTextField
                                    autoComplete="username"
                                    autoFocus
                                    errorText={errors.username?.message}
                                    label="Nom d'utilisateur"
                                    registerReturn={register("username")}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: "#64b5f6" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(33, 150, 243, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#2196f3" }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)"
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff"
                                        }
                                    }}
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <FormTextField
                                    autoComplete="current-password"
                                    errorText={errors.password?.message}
                                    label="Mot de passe"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOpenIcon sx={{ color: "#64b5f6" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleShowPasswordClick}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                        edge="end"
                                                        sx={{ color: "rgba(255,255,255,0.7)" }}
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    registerReturn={register("password")}
                                    type={showPassword ? "text" : "password"}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(33, 150, 243, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#2196f3" }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)"
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff"
                                        }
                                    }}
                                />
                            </motion.div>
                            
                            {submitWarning !== "" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Alert severity="warning" sx={{ mt: 2, background: "rgba(237, 108, 2, 0.15)", color: "#ffb74d" }}>
                                        {submitWarning}
                                    </Alert>
                                </motion.div>
                            )}
                            
                            {submitError !== "" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Alert severity="error" sx={{ mt: 2, background: "rgba(211, 47, 47, 0.15)", color: "#ef5350" }}>
                                        {submitError}
                                    </Alert>
                                </motion.div>
                            )}
                            
                            <motion.div 
                                whileHover={{ scale: 1.03 }} 
                                whileTap={{ scale: 0.97 }}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button 
                                    fullWidth 
                                    type="submit" 
                                    variant="contained"
                                    sx={{ 
                                        mb: 2, 
                                        mt: 3, 
                                        py: 1.5,
                                        background: "linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)",
                                        boxShadow: "0 4px 20px rgba(33, 150, 243, 0.5)",
                                        borderRadius: "10px",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        border: "2px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    Se connecter
                                </Button>
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <Link
                                    component="div"
                                    onClick={handleSignUpClick}
                                    sx={{ 
                                        cursor: "pointer", 
                                        color: "#90caf9",
                                        textAlign: "center",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            color: "#bbdefb"
                                        }
                                    }}
                                    variant="body1"
                                >
                                    Vous n'avez pas de compte? S'inscrire
                                </Link>
                            </motion.div>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
            <ProgressBackdrop open={submitting} />
        </Box>
    );
}

export default LoginView;
