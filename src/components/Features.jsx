import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";

const items = [
  {
    icon: <DashboardRoundedIcon />,
    title: "To-do Dashboard",
    description:
      "View and manage all your tasks in one place, with a clear overview of your to-dos.",
    imageLight:
      'url("/static/images/templates/templates-images/dash-light.png")',
    imageDark: 'url("/static/images/templates/templates-images/dash-dark.png")',
  },
  {
    icon: <SearchRoundedIcon />,
    title: "Search, Filter & Sort",
    description:
      "Easily search, filter, and sort your tasks to stay organized and find what you need quickly.",
    imageLight:
      'url("/static/images/templates/templates-images/mobile-light.png")',
    imageDark:
      'url("/static/images/templates/templates-images/mobile-dark.png")',
  },
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features">
      <Grid item xs={12} md={6}>
        <div>
          <Typography
            component="h2"
            variant="h4"
            color="text.primary"
            sx={{
              textAlign: "center",
              marginBottom: "35px",
              fontWeight: "700",
            }}
          >
            Features
          </Typography>
        </div>
        <Grid
          container
          item
          gap={1}
          sx={{ display: { xs: "auto", sm: "none" } }}
        >
          {items.map(({ title }, index) => (
            <Chip
              key={index}
              label={title}
              onClick={() => handleItemClick(index)}
              sx={{
                borderColor: (theme) => {
                  if (theme.palette.mode === "light") {
                    return selectedItemIndex === index ? "primary.light" : "";
                  }
                  return selectedItemIndex === index ? "primary.light" : "";
                },
                background: (theme) => {
                  if (theme.palette.mode === "light") {
                    return selectedItemIndex === index ? "none" : "";
                  }
                  return selectedItemIndex === index ? "none" : "";
                },
                backgroundColor:
                  selectedItemIndex === index ? "primary.main" : "",
                "& .MuiChip-label": {
                  color: selectedItemIndex === index ? "#fff" : "",
                },
              }}
            />
          ))}
        </Grid>
        <Box
          component={Card}
          variant="outlined"
          sx={{
            display: { xs: "auto", sm: "none" },
            mt: 4,
          }}
        >
          <Box
            sx={{
              backgroundImage: (theme) =>
                theme.palette.mode === "light"
                  ? items[selectedItemIndex].imageLight
                  : items[selectedItemIndex].imageDark,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: 280,
            }}
          />
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography color="text.primary" variant="body2" fontWeight="bold">
              {selectedFeature.title}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
              {selectedFeature.description}
            </Typography>
            <Link
              color="primary"
              variant="body2"
              fontWeight="bold"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                "& > svg": { transition: "0.2s" },
                "&:hover > svg": { transform: "translateX(2px)" },
              }}
            >
              <ChevronRightRoundedIcon
                fontSize="small"
                sx={{ mt: "1px", ml: "2px" }}
              />
            </Link>
          </Box>
        </Box>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
          useFlexGap
          sx={{ width: "100%", display: { xs: "none", sm: "flex" } }}
        >
          {items.map(({ icon, title, description }, index) => (
            <Card
              key={index}
              variant="outlined"
              component={Button}
              onClick={() => handleItemClick(index)}
              sx={{
                p: 3,
                height: "fit-content",
                width: "100%",
                background: "none",
                backgroundColor:
                  selectedItemIndex === index ? "action.selected" : undefined,
                borderColor: (theme) => {
                  if (theme.palette.mode === "light") {
                    return selectedItemIndex === index
                      ? "primary.light"
                      : "grey.200";
                  }
                  return selectedItemIndex === index
                    ? "primary.dark"
                    : "grey.800";
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  textAlign: "left",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { md: "center" },
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    color: (theme) => {
                      if (theme.palette.mode === "light") {
                        return selectedItemIndex === index
                          ? "primary.main"
                          : "grey.300";
                      }
                      return selectedItemIndex === index
                        ? "primary.main"
                        : "grey.700";
                    },
                  }}
                >
                  {icon}
                </Box>
                <Box sx={{ textTransform: "none" }}>
                  <Typography
                    color="text.primary"
                    variant="body2"
                    fontWeight="bold"
                  >
                    {title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ my: 0.5 }}
                  >
                    {description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </Grid>
    </Container>
  );
}
