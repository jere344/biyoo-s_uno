import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Typography,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import FormTextField from "../controls/FormTextField";
import ProgressBackdrop from "../controls/ProgressBackdrop";
import IUser from "../../data_interfaces/IUser";
import UserDS from "../../data_services/UserDS";

type FormUserEditFields = {
  email: string;
  username: string;
  profile_picture: FileList;
};

function UserEditView() {
  const navigate: NavigateFunction = useNavigate();
  const [isValidUser, setIsValidUser] = useState<boolean | null>(null);
  const [submitWarning, setSubmitWarning] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const storageUsernameKey = "username";

  const formSchema = yup.object().shape({
    username: yup
      .string()
      .required("Le nom d'utilisateur est obligatoire")
      .max(150, "Le nom d'utilisateur doit contenir au plus 150 caractères"),
    email: yup
      .string()
      .required("Le courriel est obligatoire")
      .email("Le courriel doit être valide")
      .max(100, "Le courriel doit contenir au plus 100 caractères"),
    profile_picture: yup
      .mixed()
      .nullable()
      .test("fileSize", "Le fichier est trop volumineux", (value) => {
        if (!value || value.length === 0) return true;
        return value[0].size <= 2000000; // 2MB limit
      })
      .test("fileType", "Le format du fichier n'est pas supporté", (value) => {
        if (!value || value.length === 0) return true;
        return ["image/jpeg", "image/png"].includes(value[0].type);
      }),
  });

  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm<FormUserEditFields>({
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    UserDS.get()
      .then((response) => {
        const formFields: FormUserEditFields = {
          email: response.data.email,
          username: response.data.username,
          profile_picture: [],
        };
        reset(formFields);
        setIsValidUser(true);
      })
      .catch((err) => {
        console.error("ERROR: An error occurred while getting user info", err);
        setIsValidUser(false);
      });
  }, [reset]);

  const handleFormSubmit = (data: FormUserEditFields): void => {
    setSubmitWarning("");
    setSubmitError("");

    if (isDirty) {
      setSubmitting(true);

      const userToSave: IUser = {
        email: data.email,
        username: data.username,
        profile_picture:
          data.profile_picture && data.profile_picture[0]
            ? data.profile_picture[0]
            : undefined,
      };

      UserDS.save(userToSave)
        .then((response) => {
          localStorage.setItem(storageUsernameKey, response.data.username);
          if (response.data.profile_picture) {
            localStorage.setItem("profilePicture", response.data.profile_picture);
          }
          setSubmitSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        })
        .catch((err) => {
          if (
            err.response.status === 400 &&
            err.response.data === "username_already_exists"
          ) {
            setSubmitWarning(
              "Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre."
            );
          } else if (
            err.response.status === 400 &&
            err.response.data === "email_already_exists"
          ) {
            setSubmitWarning(
              "Ce courriel est déjà utilisé, veuillez en choisir un autre."
            );
          } else {
            setSubmitError(
              "Une erreur s'est produite lors de la modification de votre utilisateur, veuillez réessayer."
            );
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      navigate("/");
    }
  };

  const handlePasswordEditClick = (): void => {
    navigate("/password-edit/me/");
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
              <Avatar
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
                <PersonIcon sx={{ fontSize: 50, color: "#fff" }} />
              </Avatar>
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
              MODIFICATION DE PROFIL
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
                  autoComplete="email"
                  disabled={isValidUser !== true}
                  errorText={errors.email?.message}
                  label="Courriel"
                  registerReturn={register("email")}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#64b5f6" }} />
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
                  autoComplete="username"
                  disabled={isValidUser !== true}
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
              
              <Box sx={{ color: "#999", fontSize: "11px", textAlign: "center", mt: 1 }}>
                Lettres, chiffres et @/./+/-/_ uniquement.
              </Box>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <input
                    accept="image/*"
                    id="profile-picture-upload"
                    type="file"
                    style={{ display: "none" }}
                    {...register("profile_picture")}
                  />
                  <label htmlFor="profile-picture-upload">
                    <IconButton
                      color="primary"
                      component="span"
                      sx={{ color: "#64b5f6" }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  {errors.profile_picture && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {errors.profile_picture.message}
                    </Alert>
                  )}
                </Box>
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
                transition={{ delay: 0.7 }}
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
                  Enregistrer
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  disabled={isValidUser !== true}
                  onClick={handlePasswordEditClick}
                  size="small"
                  sx={{ fontSize: "14px", textTransform: "none", color: "#90caf9" }}
                  variant="text"
                >
                  Cliquez ici pour changer votre mot de passe
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={() => {
                    navigate("/delete-me/");
                  }}
                  size="small"
                  sx={{ fontSize: "14px", textTransform: "none", color: "#ef5350" }}
                  variant="text"
                >
                  Supprimer mon compte
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      <ProgressBackdrop open={submitting} />
    </Box>
  );
}

export default UserEditView;
