import axios from "axios";

export const getUserClustering = async () => {
  const response = await axios.get("http://localhost:5000/userClustering" , {
	withCredentials : true
    });
  return response.data.data;
};
