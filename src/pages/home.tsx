import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { userService } from "../Service/ีuserService";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserGetRespons2 } from "../models/userGetRespons2";

function HomePage() {
  const service = new userService();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserGetRespons2>(); // Correct type is User[]
  const [searchValue, setSearchValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState<number>(0);
  const [body, setCurrentCar] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;// Use PartialAddress type here
  }>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const handleSubmit = async () => {
    console.log("handleSubmit: " + searchValue);
    const data = await service.getUserbynameEmail(searchValue);
    setUsers(data);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "black",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        const data = await service.getAlluser();
        setUsers(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadDataAsync();
  }, []);

  async function deleteUser() {
    const statusData = await service.deleteUser(userIdToDelete);
    if (statusData == 200) {
      handleDialogDeleteClose();
      alert("ลบสำเร็จ");
    }
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100vh", // เต็มความสูงของ viewport
          width: "100vw", // เต็มความกว้างของ viewport
          display: "flex",
          backgroundColor: "whitesmoke",
        }}
      >
        <p style={{ color: "black" }}>Loading...</p>
      </div>
    );
  }

  function navigateTo(id: number) {
    navigate(`/UserDetail/?id=${id}`);
  }

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogDeleteClose = () => {
    setOpenDialogDelete(false);
  };
  const handleDialogDeleteOpen = (id: number) => {
    setUserIdToDelete(id);
    setOpenDialogDelete(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCar((prevCar) => ({
      ...prevCar,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const { id, firstName, lastName, email} = body;

    // Check if fields are not empty
    if (id <= 0||!firstName.trim() || !lastName.trim() || !email.trim()) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบว่า ID มากกว่า 0");
    }
    else{
      const chk = await service.getFilteruser(body.id);
      if (Array.isArray(chk) && chk.length === 0) {
        const data = await service.addUser(body);
        setUsers(await service.getAlluser());
        handleDialogClose();
        alert("เพิ่มข้อมูลผู้ใช้สำเร็จ");
        console.log(data);
      } else {
        alert("ไอดีซ้ำกันนะ");
      }
  }
  };

  return (
    <>
      <div
        style={{
          height: "100vh", // เต็มความสูงของ viewport
          width: "100vw", // เต็มความกว้างของ viewport
          display: "flex",
          flexDirection: "column",
          backgroundColor: "whitesmoke",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "50px",
          }}
        >
          <TextField
            sx={{ width: "500px" }}
            id="outlined-basic"
            label="Search Name or Email"
            variant="outlined"
            onChange={async (e) => {
              setSearchValue(e.target.value);
              if (e.target.value == "") {
                setUsers(await service.getAlluser());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
          <Button size="medium" color="success" onClick={handleSubmit}>
            ค้นหา
            <SearchIcon />
          </Button>
        </div>
        <div
          style={{
            marginTop: "5vh",
            display: "flex",
            justifyContent: "center",
            marginLeft: "100vh",
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleDialogOpen()}
            color="success"
          >
            เพิ่มผู้ใช้งาน
          </Button>
        </div>
        <Container
          sx={{
            display: "flex",
            marginTop: "3vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "1000px",
                width: "100%",
                height: "550px",
                overflowY: "auto",
              }}
            >
              <Table
                stickyHeader
                aria-label="sticky table"
                sx={{ minWidth: 700 }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>id</StyledTableCell>
                    <StyledTableCell align="left">ชื่อ</StyledTableCell>
                    <StyledTableCell align="left">อีเมล</StyledTableCell>
                    <StyledTableCell align="left" sx={{ width: "120px" }}>
                      เบอร์โทรศัพท์
                    </StyledTableCell>
                    <StyledTableCell align="left">ที่อยู่</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(users) && users.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={5} align="center">
                        ไม่มีข้อมูล
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    Array.isArray(users) &&
                    users.map((user) => (
                      <StyledTableRow
                        key={user.id}
                        onClick={() => navigateTo(user.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {user.id}
                        </StyledTableCell>
                        <StyledTableCell>
                          {user.firstName} {user.lastName}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.email}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.phone}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.address.address}, {user.address.city},{" "}
                          {user.address.state}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation(); // ป้องกันไม่ให้เหตุการณ์ส่งผ่านไปยัง StyledTableRow
                              handleDialogDeleteOpen(user.id);
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <b style={{ color: "blue" }}>เพิ่มข้อมูลผู้ใช้</b>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="id"
            type="number"
            fullWidth
            variant="outlined"
            name="id"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="firstName"
            type="text"
            fullWidth
            variant="outlined"
            name="firstName"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="lastName"
            type="text"
            fullWidth
            variant="outlined"
            name="lastName"
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="outlined"
            name="email"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>ยกเลิก</Button>
          <Button onClick={handleSave}>ตกลง</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialogDelete} onClose={handleDialogDeleteClose}>
        <DialogTitle>
          <b style={{ color: "blue" }}>ต้องการลบข้อมูล id = {userIdToDelete}</b>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogDeleteClose}>ยกเลิก</Button>
          <Button onClick={deleteUser}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HomePage;
