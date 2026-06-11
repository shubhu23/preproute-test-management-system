import AddIcon from "@mui/icons-material/Add";

import {
  Button,
} from "@mui/material";

interface Props {
  onClick: () => void;
}

export default function CreateTestButton({
  onClick,
}: Props) {
  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      size="large"
      onClick={onClick}
      sx={{
        borderRadius: 2,
        textTransform: "none",
        px: 3,
      }}
    >
      Create New Test
    </Button>
  );
}