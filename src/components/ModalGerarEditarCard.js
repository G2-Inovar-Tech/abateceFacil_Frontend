import React, {useState, useEffect} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalGerarEditarCard({
  open,
  onClose,
  mode,
  cardNumber,
  initialData,
  onSubmit,
}) {
  const isEdicao = mode === "editar";
  const [formValues, setFormValues] = useState({ setor: "", responsavel: "" });
  const [isButtonEnabled, setButtonEnabled] = useState(false);

  // Carrega os valores iniciais no modo "editar"
  useEffect(() => {
    if (isEdicao && initialData) {
      setFormValues(initialData);
    } else {
      setFormValues({ setor: "", responsavel: "" });
    }
  }, [isEdicao, initialData]);

  // Verifica se o botão deve estar habilitado
  useEffect(() => {
    if (isEdicao) {
      const hasChanged =
        formValues?.setor !== initialData?.setor ||
        formValues?.responsavel.trim() !== initialData?.responsavel.trim();
      setButtonEnabled(hasChanged);
    } else {
      const allFieldsFilled =
        formValues.setor?.trim() !== "" && formValues.responsavel?.trim() !== "";
      setButtonEnabled(allFieldsFilled);
    }
  }, [formValues, isEdicao, initialData]);

  // Manipula a mudança de valores nos campos
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    if (
      (field === "setor" && value.length <= 30) ||
      (field === "responsavel" && value.length <= 40)
    ) {
      setFormValues((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Envia os dados para a página pai
  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleFormSubmit,
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {isEdicao ? "Editar Cartão" : "Gerar Cartão"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isEdicao ? (
          <>
            <Typography sx={{ mb: 2 }}>
              <strong>Número do Cartão:</strong> {cardNumber}
            </Typography>
            <Typography sx={{ mb: 2 }}>
              <strong>Setor:</strong> {formValues.setor}
            </Typography>
          </>
        ) : (
          <></>
        )}
        {/* <TextField
          autoFocus
          required
          margin="dense"
          name="setor"
          label="Setor"
          value={formValues.setor}
          onChange={handleChange("setor")}
          fullWidth
          disabled={isEdicao}
        /> */}
        <TextField
          required
          style={{minWidth: "290px"}}
          fullWidth
          margin="dense"
          name="responsavel"
          label="Responsável"
          value={formValues.responsavel}
          onChange={handleChange("responsavel")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isButtonEnabled}
        >
          {isEdicao ? "Salvar" : "Gerar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
