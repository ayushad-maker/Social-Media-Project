import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  connections: [],
  pendingConnections: [],
  followers: [],
  following: [],
};

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (token) => {
    const { data } = await api.get("/api/user/connections", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.success ? data : null;
  },
);

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {

  },
  extraReducers: (builder)=>{
   builder.addCase(fetchConnections.fulfilled,(state,actions)=>{
    if(actions.payload){
        state.connections = actions.payload.connections;
        state.pendingConnections = actions.payload.pendingConnections;
        state.followers = actions.payload.followers;
        state.following = actions.payload.following
    }
   })
  }
});

export default connectionsSlice.reducer;
