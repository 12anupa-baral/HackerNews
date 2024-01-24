import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";
import { Link, useParams } from "react-router-dom";

const UserInfo = () => {
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();

  const { userId } = params;

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users/" + userId
      );
      const jsonData = await res.json();
      setUserData(jsonData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <div>DATA IS LOADING...</div>;
  }

  return (
    <>
      <Link to="/">
        <Button>Go to home</Button>
      </Link>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {userData?.name}
          </Typography>
          <Typography variant="h5" component="div"></Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {userData?.email}
          </Typography>
          <Typography variant="body2">{userData?.address.city}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default UserInfo;
