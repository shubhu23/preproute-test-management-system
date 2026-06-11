import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";

interface Props {
  status: string;
  subject: string;
  sort: string;

  onStatusChange: (
    value: string
  ) => void;

  onSubjectChange: (
    value: string
  ) => void;

  onSortChange: (
    value: string
  ) => void;

  onReset: () => void;

  subjects: string[];
}

export default function TestFilters({
  status,
  subject,
  sort,
  onStatusChange,
  onSubjectChange,
  onSortChange,
  onReset,
  subjects,
}: Props) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: { xs: 1, md: 2 },
        alignItems: 'flex-end',
      }}
    >
      <FormControl
        fullWidth={isMobile}
        sx={{ minWidth: isMobile ? '100%' : 160 }}
      >
        <InputLabel>
          Status
        </InputLabel>

        <Select
          value={status}
          label="Status"
          onChange={(e) =>
            onStatusChange(
              e.target.value
            )
          }
          size="small"
        >
          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="draft">
            Draft
          </MenuItem>

          <MenuItem value="live">
            Live
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl
        fullWidth={isMobile}
        sx={{ minWidth: isMobile ? '100%' : 160 }}
      >
        <InputLabel>
          Subject
        </InputLabel>

        <Select
          value={subject}
          label="Subject"
          onChange={(e) =>
            onSubjectChange(
              e.target.value
            )
          }
          size="small"
        >
          <MenuItem value="">
            All
          </MenuItem>

          {subjects.map(
            (subject) => (
              <MenuItem
                key={subject}
                value={subject}
              >
                {subject}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      <FormControl
        fullWidth={isMobile}
        sx={{ minWidth: isMobile ? '100%' : 160 }}
      >
        <InputLabel>
          Sort
        </InputLabel>

        <Select
          value={sort}
          label="Sort"
          onChange={(e) =>
            onSortChange(
              e.target.value
            )
          }
          size="small"
        >
          <MenuItem value="">
            Default
          </MenuItem>

          <MenuItem value="newest">
            Newest First
          </MenuItem>

          <MenuItem value="oldest">
            Oldest First
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        onClick={onReset}
        fullWidth={isMobile}
        size="small"
        sx={{ 
          minWidth: isMobile ? '100%' : 'auto',
          textTransform: 'none',
        }}
      >
        Clear Filters
      </Button>
    </Box>
  );
}