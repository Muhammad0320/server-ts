import mongoose from "mongoose";

interface IRevokedToken {
  token: String;
}

const revokedTokenSchema = new mongoose.Schema<IRevokedToken>({
  token: {
    type: String,
    require: true,
    unique: true,
  },
});

const RevokedToken = mongoose.model<IRevokedToken>(
  "RevokedToken",
  revokedTokenSchema
);

export default RevokedToken;
