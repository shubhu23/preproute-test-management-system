import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTestDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Test
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want
          to delete this test?
        </Typography>

        <Typography
          color="error"
          sx={{ mt: 2 }}
        >
          This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? "Deleting..."
            : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}