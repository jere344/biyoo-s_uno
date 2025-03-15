import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Box, Button, Link, Typography, Container, Paper, InputAdornment } from "@mui/material";
import FormTextField from "../controls/FormTextField";
import ProgressBackdrop from "../controls/ProgressBackdrop";
import IUser from "../../data_interfaces/IUser";
import UserDS from "../../data_services/UserDS";
import { motion } from "framer-motion";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SecurityIcon from "@mui/icons-material/Security";

type FormSignUpFields = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
};

function SignUpView() {
    const navigate: NavigateFunction = useNavigate();
    const [submitWarning, setSubmitWarning] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const formSchema = yup.object().shape({
        username: yup
            .string()
            .required("Le nom d'utilisateur est obligatoire")
            .max(150, "Le nom d'utilisageur doit contenir au plus 150 caractères"),
        email: yup
            .string()
            .required("Le courriel est obligatoire")
            .email("Le courriel doit être valide")
            .max(100, "Le courriel doit contenir au plus 100 caractères"),
        password: yup
            .string()
            .required("Le mot de passe est obligatoire")
            .max(100, "Le mot de passe doit contenir au plus 100 caractères")
            .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        confirmPassword: yup
            .string()
            .required("La confirmation du mot de passe est obligatoire")
            .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
    });

    const {
        formState: { errors },
        handleSubmit,
        register,
    } = useForm<FormSignUpFields>({
        resolver: yupResolver(formSchema),
    });

    const handleFormSubmit = (data: FormSignUpFields): void => {
        setSubmitWarning("");
        setSubmitError("");
        setSubmitting(true);

        const newUser: IUser = {
            username: data.username,
            email: data.email,
        };

        submitRegister(newUser, data.password);
    };

    const submitRegister = (newUser: IUser, password: string, recaptchaToken: string) => {
        // Ensure your UserDS.register method sends the recaptchaToken in the request body
        UserDS.register(newUser, password, recaptchaToken)
            .then(() => {
                navigate("/login/");
            })
            .catch((err) => {
                if (err.response.status === 400 && err.response.data === "username_already_exists") {
                    setSubmitWarning("Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre.");
                } else if (err.response.status === 400 && err.response.data === "email_already_exists") {
                    setSubmitWarning("Ce courriel est déjà utilisé, veuillez en choisir un autre.");
                } else {
                    setSubmitError("Une erreur s'est produite lors de l'inscription, veuillez réessayer.");
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleLoginClick = () => {
        navigate("/login/");
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(135deg, #673ab7 0%, #512da8 50%, #311b92 100%)",
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
                                    backgroundColor: "#7e57c2",
                                    borderRadius: "50%",
                                    padding: 2,
                                    mb: 2,
                                    boxShadow: "0 0 20px rgba(126, 87, 194, 0.6)",
                                    border: "3px solid rgba(255,255,255,0.2)",
                                    width: "85px",
                                    height: "85px",
                                }}
                            >
                                <PersonAddIcon sx={{ fontSize: 50, color: "#fff" }} />
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
                                letterSpacing: "2px",
                            }}
                        >
                            INSCRIPTION
                        </Typography>

                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit(handleFormSubmit)}
                            sx={{ width: "100%" }}
                        >
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <FormTextField
                                    autoComplete="email"
                                    autoFocus
                                    errorText={errors.email?.message}
                                    label="Courriel"
                                    registerReturn={register("email")}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon sx={{ color: "#b39ddb" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(126, 87, 194, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#7e57c2" },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff",
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <FormTextField
                                    autoComplete="username"
                                    errorText={errors.username?.message}
                                    label="Nom d'utilisateur"
                                    registerReturn={register("username")}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon sx={{ color: "#b39ddb" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(126, 87, 194, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#7e57c2" },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff",
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                                <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", mb: 1, ml: 2 }}>
                                    Lettres, chiffres et @/./+/-/_ uniquement.
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <FormTextField
                                    autoComplete="new-password"
                                    errorText={errors.password?.message}
                                    label="Mot de passe"
                                    registerReturn={register("password")}
                                    type="password"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon sx={{ color: "#b39ddb" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(126, 87, 194, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#7e57c2" },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff",
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                                <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", mb: 1, ml: 2 }}>
                                    Votre mot de passe doit contenir au moins 8 caractères.
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.9 }}
                            >
                                <FormTextField
                                    autoComplete="new-password"
                                    errorText={errors.confirmPassword?.message}
                                    label="Confirmation du mot de passe"
                                    registerReturn={register("confirmPassword")}
                                    type="password"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SecurityIcon sx={{ color: "#b39ddb" }} />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "rgba(255,255,255,0.05)",
                                            borderRadius: "10px",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                            "&:hover fieldset": { borderColor: "rgba(126, 87, 194, 0.5)" },
                                            "&.Mui-focused fieldset": { borderColor: "#7e57c2" },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "rgba(255,255,255,0.7)",
                                        },
                                        "& .MuiOutlinedInput-input": {
                                            color: "#fff",
                                        },
                                    }}
                                />
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                                <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", mb: 1, ml: 2 }}>
                                    Entrez le même mot de passe que précédemment pour vérification.
                                </Box>
                            </motion.div>

                            {submitWarning !== "" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Alert
                                        severity="warning"
                                        sx={{ mt: 2, background: "rgba(237, 108, 2, 0.15)", color: "#ffb74d" }}
                                    >
                                        {submitWarning}
                                    </Alert>
                                </motion.div>
                            )}

                            {submitError !== "" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <Alert
                                        severity="error"
                                        sx={{ mt: 2, background: "rgba(211, 47, 47, 0.15)", color: "#ef5350" }}
                                    >
                                        {submitError}
                                    </Alert>
                                </motion.div>
                            )}

                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.1 }}
                            >
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        mb: 2,
                                        mt: 3,
                                        py: 1.5,
                                        background: "linear-gradient(45deg, #9c27b0 30%, #7e57c2 90%)",
                                        boxShadow: "0 4px 20px rgba(156, 39, 176, 0.5)",
                                        borderRadius: "10px",
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        border: "2px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    S'inscrire
                                </Button>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                                <Link
                                    component="div"
                                    onClick={handleLoginClick}
                                    sx={{
                                        cursor: "pointer",
                                        color: "#d1c4e9",
                                        textAlign: "center",
                                        "&:hover": {
                                            textDecoration: "underline",
                                            color: "#e8eaf6",
                                        },
                                    }}
                                    variant="body1"
                                >
                                    Vous avez déjà un compte? Se connecter
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

export default SignUpView;
