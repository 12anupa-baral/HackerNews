import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsersList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const jsonData = await res.json();
      setUsers(jsonData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  if (loading) {
    return <div>DATA IS LOADING...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>S.N.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">User Name</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>

              <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">{user.username}</TableCell>
              <TableCell align="right">{user.phone}</TableCell>
              <TableCell align="right">
                <Button>
                  <Link to={`/${user.id}`}>View User</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
