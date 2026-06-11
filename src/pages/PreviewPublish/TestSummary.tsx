import {
 Card,
 CardContent,
 Typography,
 Grid,
} from "@mui/material";

export default function TestSummary({
 test,
}: any) {
 return (
  <Card>
   <CardContent>

    <Typography
      variant="h5"
      gutterBottom
    >
      Test Details
    </Typography>

    <Grid
      container
      spacing={2}
    >
      <Grid size={6}>
        <Typography>
          Name:
          {test.name}
        </Typography>
      </Grid>

      <Grid size={6}>
        <Typography>
          Subject:
          {test.subject}
        </Typography>
      </Grid>

      <Grid size={6}>
        <Typography>
          Difficulty:
          {test.difficulty}
        </Typography>
      </Grid>

      <Grid size={6}>
        <Typography>
          Total Marks:
          {test.total_marks}
        </Typography>
      </Grid>

      <Grid size={6}>
        <Typography>
          Total Time:
          {test.total_time}
          mins
        </Typography>
      </Grid>

      <Grid size={6}>
        <Typography>
          Status:
          {test.status}
        </Typography>
      </Grid>
    </Grid>

   </CardContent>
  </Card>
 );
}