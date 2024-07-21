import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Select from "react-select";
import LogoutIcon from "@mui/icons-material/Logout";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
  MDBTooltip,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTodos } from "../context/TodoContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    backgroundColor: "#F5F5F5", // Light pastel gray
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const filterOptions = [
  { value: 1, label: "All" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Active" },
];

const sortOptions = [
  { value: 1, label: "Ascending (A to Z)" },
  { value: 2, label: "Descending (Z to A)" },
  { value: 3, label: "Due Date (Past)" }, // New option for due date sorting
  { value: 4, label: "Due Date (Upcoming)" }, // New option for due date sorting
];

export default function Task() {
  const theme = useTheme();
  const { addTodo, todos, updateTodo, deleteTodo } = useTodos(); // Use the addTodo function from context
  const [newTodo, setNewTodo] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(null); // New state for date
  const [isEditing, setIsEditing] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editDate, setEditDate] = React.useState(null); // New state for editing date
  const [filter, setFilter] = React.useState(filterOptions[0].value);
  const [sort, setSort] = React.useState(sortOptions[0].value);
  const [searchQuery, setSearchQuery] = React.useState(""); // New state for search query

  const { user } = useAuth(); // Get the authenticated user
  const { logout } = useAuth(); // Destructure logout from useAuth
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/"); // Redirect to the homepage
  };

  const handleFilterChange = (selectedOption) => {
    console.log("Selected filter:", selectedOption.value);
    setFilter(selectedOption.value);
  };

  const handleSortChange = (selectedOption) => {
    console.log("Selected sort:", selectedOption.value);
    setSort(selectedOption.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Sorting logic
  const sortedTodos = todos
    .filter((todo) => todo.userId === user.id) // Filter todos by userId
    .filter((todo) => {
      if (filter === 1) return true; // Show all
      if (filter === 2) return todo.completed; // Show only completed
      if (filter === 3) return !todo.completed; // Show only active
      return true;
    })

    .filter((todo) => {
      // Filter by search query
      return todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    })

    .sort((a, b) => {
      if (sort === 1) {
        // Ascending (A to Z)
        return a.title.localeCompare(b.title);
      } else if (sort === 2) {
        // Descending (Z to A)
        return b.title.localeCompare(a.title);
      } else if (sort === 3) {
        // Due Date (Upcoming)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // Sort by due date in ascending order
      } else if (sort === 4) {
        // Due Date (Past)
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Sort by due date in descending order
      }
      return 0;
    });

  const handleAddTodo = () => {
    if (newTodo.trim() !== "" && selectedDate && user) {
      const newTodoItem = {
        title: newTodo,
        date: selectedDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
        userId: user.id,
        completed: false,
      };
      addTodo(newTodoItem);
      setNewTodo("");
      setSelectedDate(null);
    }
  };

  const startEdit = (todo) => {
    setIsEditing(todo.id);
    setEditTitle(todo.title);
    setEditDate(new Date(todo.date)); // Convert date string to Date object
  };

  const cancelEdit = () => {
    setIsEditing(null);
  };

  const saveEdit = async () => {
    if (editTitle.trim() === "" || !editDate) {
      console.error("Title and date are required");
      return;
    }

    const updatedTodo = {
      id: isEditing,
      title: editTitle,
      date: editDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
    };

    await updateTodo(updatedTodo);
    setIsEditing(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ backgroundColor: "#B5F1CC" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <MDBIcon fas icon="check-square" className="me-1" />
            My Todo-s
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleLogout}
            sx={{ marginLeft: "auto" }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Main open={open} style={{ backgroundColor: "white" }}>
        <MDBRow className="m-4 d-flex justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard
              id="list1"
              style={{
                borderRadius: ".75rem",
                backgroundColor: "#FFE1E1",
                marginTop: "1rem",
              }}
            >
              <MDBCardBody className="py-4 px-4 px-md-5">
                <div className="pb-2">
                  <MDBCard>
                    <MDBCardBody>
                      <div className="d-flex flex-row align-items-center">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="exampleFormControlInput1"
                          placeholder="Add new..."
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                        />

                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd-MM-yyyy"
                          placeholderText="Select date"
                          className="form-control m-3 "
                        />

                        <div>
                          <MDBBtn
                            onClick={handleAddTodo}
                            className="m-4"
                            style={{ backgroundColor: "#554994" }}
                          >
                            Add
                          </MDBBtn>
                        </div>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </div>
                <hr className="my-4" />

                <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
                  <p className="small mb-0 me-2 text-dark">Search</p>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="form-control me-3"
                    style={{ width: "200px" }}
                  />
                  <p className="small mb-0 me-2 text-dark">Filter</p>
                  <Select
                    options={filterOptions}
                    defaultValue={filterOptions[0]}
                    onChange={handleFilterChange}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "200px",
                      }),
                    }}
                  />
                  <p className="small mb-0 ms-4 me-2 text-dark">Sort</p>
                  <Select
                    options={sortOptions}
                    defaultValue={sortOptions[0]}
                    onChange={handleSortChange}
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "200px",
                      }),
                    }}
                  />
                </div>
                <MDBListGroup className="pb-2">
                  {sortedTodos.map((todo) => (
                    <MDBListGroupItem
                      key={todo.id}
                      className="d-flex justify-content-between align-items-center border-0 mb-2 rounded"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "100%" }}
                      >
                        <MDBCheckbox
                          name="flexCheck"
                          id={`flexCheck-${todo.id}`}
                          checked={todo.completed}
                          onChange={() =>
                            updateTodo({
                              ...todo,
                              completed: !todo.completed, // Toggle completed status
                            })
                          }
                        />
                        {isEditing === todo.id ? (
                          <>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              style={{
                                fontSize: "1.2em",
                                color: "black",
                                textTransform: "capitalize",
                              }}
                            />
                            <DatePicker
                              selected={editDate}
                              onChange={(date) => setEditDate(date)}
                              dateFormat="dd-MM-yyyy"
                              className="form-control m-2"
                            />
                            <MDBBtn
                              color="success"
                              onClick={saveEdit}
                              style={{
                                marginLeft: "40px",
                                marginRight: "20px",
                              }}
                            >
                              Save
                            </MDBBtn>
                            <MDBBtn
                              color="danger"
                              onClick={cancelEdit}
                              className="ms-2"
                            >
                              Cancel
                            </MDBBtn>
                          </>
                        ) : (
                          <>
                            <span
                              className="ms-2"
                              style={{
                                fontSize: "1.2em",
                                color: "black",
                                textTransform: "capitalize",
                                textDecoration: todo.completed
                                  ? "line-through"
                                  : "none", // Strike-through if completed
                              }}
                            >
                              {todo.title}
                            </span>
                            <span className="ms-5">Date: {todo.date}</span>
                            <div style={{ marginLeft: "auto" }}>
                              <MDBIcon
                                fas
                                icon="edit"
                                size="lg"
                                onClick={() => startEdit(todo)}
                                style={{
                                  cursor: "pointer",
                                  color: "#007bff",
                                  marginRight: "20px",
                                }}
                              />
                              <MDBIcon
                                fas
                                icon="trash-alt"
                                size="lg"
                                onClick={() => deleteTodo(todo.id)}
                                style={{
                                  cursor: "pointer",
                                  color: "#dc3545",
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </Main>
    </Box>
  );
}
