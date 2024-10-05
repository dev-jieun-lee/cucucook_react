import { Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, TextField } from "@mui/material";
import { DialogForm, DialogTitleArea } from "../../../styles/CommonStyles";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { BoardButtonArea } from "../../../styles/BoardStyle";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { changePasswordByUser } from "../../../apis/mypageApi";
import Swal from "sweetalert2";

interface MemberPwDialogProps {
  open: boolean;
  onClose: () => void;
  memberId?: string;
}


function MemberPwChange({ open, onClose, memberId }: MemberPwDialogProps){
  const { t } = useTranslation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      memberId : memberId,
      newPassword: "",
    },
    // validationSchema: Yup.object({
    //   newPassword: Yup.string()
    //     .required(t("error.required", { value: t("menu.board.category_name") })) 
    //     .max(10, t("error.max_length", { value: t("menu.board.category_name"), length : 10 }))
    // }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      mutation.mutate(values as any); // mutation 실행
    },
  });

  const mutation = useMutation(
    (values: any) =>
      changePasswordByUser(memberId!, values.newPassword),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: "success",
          title: t("text.save"),
          text: t("menu.board.alert.save"),
          showConfirmButton: true,
          confirmButtonText: t("text.check"),
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      },
      onError: (error) => {
        Swal.fire({
          title: t("mypage.update_failed"),
          icon: "error",
          confirmButtonText: t("alert.ok"),
        });
      },
    }
  );

  return(
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: { overflow: "visible" },
      }}
    >
      <DialogTitleArea>
        <DialogTitle>
          <span className="title">
          {t("mypage.change_password")}
          </span>
        </DialogTitle>
        <IconButton className="close-btn" aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitleArea>
      <DialogContent dividers>
        <DialogForm onSubmit={formik.handleSubmit}>
          <FormControl className="input-form">
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label={t("members.password")}
              value={formik.values.newPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
            />
          </FormControl>
          <BoardButtonArea>
            <Button className="save-btn" type="submit" variant="contained">
              {t("text.save")}
            </Button>
          </BoardButtonArea>
        </DialogForm>
      </DialogContent>
    </Dialog>
  )
}

export default MemberPwChange;