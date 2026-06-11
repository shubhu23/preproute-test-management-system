import {
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from
"@mui/icons-material/Search";

interface Props {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder="Search test name..."
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      sx={{
        "& .MuiOutlinedInput-root": {
          fontSize: { xs: "13px", md: "14px" },
          borderRadius: "8px",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
            >
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}