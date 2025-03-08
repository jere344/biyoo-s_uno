import { UseFormRegisterReturn } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

export type FormTextFieldProps = TextFieldProps & {
  errorText?: string | null;
  registerReturn?: UseFormRegisterReturn;
};

function FormTextField({
  errorText,
  registerReturn,
  ...others
}: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      margin="normal"
      {...others}
      {...(errorText && { error: true, helperText: errorText })}
      {...(registerReturn && { ...registerReturn })}
    />
  );
}

export default FormTextField;
