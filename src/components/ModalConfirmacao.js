import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalConfirmacao({ 
  open, 
  onClose, 
  title, 
  content, 
  onConfirm 
}) {
  const handleConfirm = () => {
    onConfirm(true); // Retorna true para a página pai
    onClose(); // Fecha o modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{minHeight: "100px"}}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{minHeight: "100px"}}>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
