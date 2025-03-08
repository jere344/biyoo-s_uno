import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ProgressBackdrop from "../controls/ProgressBackdrop";
import UserDS from "../../data_services/UserDS";

function UserDelete() {
  const navigate: NavigateFunction = useNavigate();
  const [open, setOpen] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    // Close the dialog and navigate back to the user edit view.
    setOpen(false);
    navigate("/user-edit/me/");
  };

  const handleDelete = () => {
    setSubmitError("");
    setSubmitting(true);
    UserDS.deleteUser()
      .then(() => {
        // On successful deletion, navigate to the home page.
        navigate("/");
      })
      .catch(() => {
        setSubmitError("Une erreur s'est produite lors de la suppression du compte, veuillez réessayer.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container maxWidth="xs">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Supprimer votre compte</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
          </DialogContentText>
          {submitError !== "" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Annuler
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <ProgressBackdrop open={submitting} />
    </Container>
  );
}

export default UserDelete;
